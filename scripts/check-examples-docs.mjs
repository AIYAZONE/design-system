import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { build } from "vite";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "output/responsive-docs-20261120");
const fixtures = path.join(output, "copied-examples");
fs.mkdirSync(fixtures, { recursive: true });
const routes = [
  "index.html",
  ...fs
    .readdirSync(path.join(root, "apps/examples/pages"), { recursive: true })
    .filter((p) => p.endsWith(".html"))
    .map((p) => "pages/" + p)
    .sort(),
];
const copies = [];
const checks = [];
const errors = [];
const browser = await chromium.launch({ headless: true });
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      await context.addInitScript(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (text) => {
              window.__copiedExample = text;
            },
          },
        }),
      );
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      for (const theme of ["v1", "v2", "v3"])
        for (const route of routes) {
          await page.setViewportSize({ width: 820, height: 1000 });
          await page.goto(`${origin}/examples/${route}?theme=${theme}`);
          await page.waitForSelector('[data-example-doc="usage-code"]');
          for (const text of ["何时使用", "如何选择", "注意事项"])
            assert.ok(
              (await page.getByText(text, { exact: true }).count()) > 0,
              `${route}: ${text}`,
            );
          assert.equal(
            await page.locator("[data-example-doc]").count(),
            3,
            route,
          );
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            route,
          );
          const details = page
            .locator("details")
            .filter({
              has: page
                .locator("summary")
                .filter({ hasText: "完整 HTML 页 · 包含初始化与当前主题" }),
            })
            .first();
          await details.locator("summary").click();
          const button = details.getByRole("button", {
            name: "复制 完整 HTML 代码",
            exact: true,
          });
          await button.focus();
          await page.keyboard.press("Enter");
          await page.waitForFunction(() => !!window.__copiedExample);
          const source = await page.evaluate(() => window.__copiedExample);
          assert.ok(
            source.includes(
              `@aiyazone/design-system/${theme === "v1" ? "index.css" : `index-${theme}.css`}`,
            ),
            `${route}: copied theme`,
          );
          assert.ok(source.startsWith("<!doctype html>"), route);
          const name =
            route.replaceAll("/", "-").replace(".html", "") + "-" + theme;
          fs.writeFileSync(path.join(fixtures, name + ".html"), source);
          copies.push({ route, theme, name });
          await page.setViewportSize({ width: 375, height: 900 });
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            `${route}: mobile code overflow`,
          );
          if (
            theme === "v1" &&
            [
              "pages/atoms/button.html",
              "pages/atoms/filter-select.html",
              "pages/font/ja.html",
              "index.html",
            ].includes(route)
          ) {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({
              path: path.join(output, `docs-${name}-mobile.png`),
            });
          }
          checks.push({ route, theme });
        }
      // Copy failures remain actionable and preserve the original code text.
      await page.goto(`${origin}/examples/pages/atoms/checkbox.html`);
      await page.waitForSelector('[data-code-kind="HTML"]');
      await page.evaluate(() => {
        navigator.clipboard.writeText = async () => {
          throw new Error("blocked");
        };
      });
      await page
        .getByRole("button", { name: "复制 HTML 代码", exact: true })
        .click();
      assert.equal(
        await page.evaluate(() => getSelection().toString()),
        await page.locator('[data-code-kind="HTML"]').textContent(),
      );
      assert.ok(
        (
          await page
            .locator(".usage-copy-feedback")
            .filter({ hasText: "未能自动复制" })
            .textContent()
        ).includes("手动复制"),
      );
      await context.close();
    },
  );
  const input = Object.fromEntries(
    copies.map((x) => [x.name, path.join(fixtures, x.name + ".html")]),
  );
  await build({
    configFile: false,
    root: fixtures,
    base: "./",
    logLevel: "warn",
    build: { outDir: "dist", emptyOutDir: true, rollupOptions: { input } },
  });
  await withStaticServer(path.join(fixtures, "dist"), async (origin) => {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.on("pageerror", (e) => errors.push(e.message));
    for (const copy of copies)
      for (const width of [375, 820]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${origin}/${copy.name}.html`);
        await page.evaluate(async () => {
          await Promise.all(
            [...document.querySelectorAll("*")]
              .filter((el) => el.localName.startsWith("zone-"))
              .map((el) =>
                customElements
                  .whenDefined(el.localName)
                  .then(() => el.updateComplete),
              ),
          );
        });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${copy.name}: standalone overflow ${width}`,
        );
        assert.ok(
          await page.evaluate(
            () =>
              parseFloat(getComputedStyle(document.documentElement).fontSize) <=
              18,
          ),
          `${copy.name}: installed scale`,
        );
        const primary = page.locator("zone-button").first();
        if (await primary.count()) {
          const radius = await primary
            .locator(".button")
            .evaluate((el) =>
              parseFloat(getComputedStyle(el).borderTopLeftRadius),
            );
          assert.ok(
            copy.theme === "v1" ? radius > 20 : radius === 0,
            `${copy.name}: component theme mismatch`,
          );
        }
        if (copy.route.endsWith("atoms/dropdown.html"))
          assert.equal(
            await page.locator("#shipping").evaluate((el) => el.options.length),
            3,
          );
        if (copy.route.endsWith("atoms/filter-select.html"))
          assert.equal(
            await page
              .locator("#service-filter")
              .evaluate((el) => el.options.length),
            3,
          );
        if (copy.route.endsWith("atoms/dialog.html")) {
          await page.locator("#open-confirm").click();
          assert.equal(
            await page.locator("#confirm-dialog").evaluate((el) => el.open),
            true,
          );
          await page.keyboard.press("Escape");
        }
        if (copy.route.endsWith("atoms/toast.html")) {
          await page.locator("#show-notice").click();
          assert.equal(
            await page.locator("#saved-notice").evaluate((el) => el.closed),
            false,
          );
        }
        if (copy.route.endsWith("atoms/button.html")) {
          await page.locator("#save").click();
          assert.ok(
            (await page.locator("#save-result").textContent()).includes(
              "已触发",
            ),
          );
        }
      }
    await page.close();
  });
  assert.deepEqual(errors, [], "copied examples runtime errors");
  console.log(
    `${checks.length} documentation/theme checks and ${copies.length * 2} independently built copied examples passed.`,
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "docs-verification.json"),
    JSON.stringify({ checks, copies, errors }, null, 2),
  );
}
