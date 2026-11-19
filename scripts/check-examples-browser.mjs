import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "output/examples-20261119");
fs.mkdirSync(output, { recursive: true });
const pages = [
  "index.html",
  ...fs
    .readdirSync(path.join(root, "apps/examples/pages"), { recursive: true })
    .filter((p) => p.endsWith(".html"))
    .sort()
    .map((p) => `pages/${p}`),
];
const baselinePath = path.join(output, "source-baseline.json");
const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, "utf8"))
  : {};
const results = [];
const failures = [];
const screenshots = [];
const slug = (file) => file.replace(/\.html$/, "").replaceAll("/", "-");
const browser = await chromium.launch({ headless: true });
try {
  const run = async (origin) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      let errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (
          response.status() >= 400 &&
          new URL(response.url()).origin === new URL(origin).origin
        )
          errors.push(`${response.status()} ${response.url()}`);
      });
      for (const theme of ["v1", "v2", "v3"]) {
        for (const width of [1440, 768, 390, 320]) {
          await page.setViewportSize({ width, height: 1000 });
          for (const file of pages) {
            errors = [];
            const url = `${origin}/${file}?theme=${theme}`;
            try {
              await page.goto(url);
              await page.waitForSelector(
                file === "index.html"
                  ? ".examples-groups"
                  : ".examples-sidebar",
              );
              await page.evaluate(async () => {
                await document.fonts.ready;
                await Promise.all(
                  [...document.querySelectorAll("*")]
                    .filter((el) => el.localName.startsWith("zone-"))
                    .map((el) => el.updateComplete),
                );
              });
              const state = await page.evaluate(() => ({
                viewport: innerWidth,
                width: document.documentElement.scrollWidth,
                title: document.querySelector("h1")?.textContent,
                sections: document.querySelectorAll(".example-section").length,
                activeTheme: document.querySelector(
                  ".theme-switcher__btn.is-active",
                )?.textContent,
                components: [...document.querySelectorAll("*")]
                  .filter((el) => el.localName.startsWith("zone-"))
                  .map((el) => el.localName),
                brokenAnchors: [...document.querySelectorAll(".examples-toc a")]
                  .filter((a) => !document.getElementById(a.hash.slice(1)))
                  .map((a) => a.hash),
              }));
              assert.ok(state.title, "page title");
              assert.equal(
                state.activeTheme,
                theme.toUpperCase(),
                "active component theme",
              );
              assert.ok(
                state.width <= width + 1,
                `page overflow: ${state.width} > ${width}`,
              );
              assert.deepEqual(state.brokenAnchors, [], "TOC anchors");
              const prior = baseline[file.replace(/^pages\//, "")];
              if (prior) {
                const count = (items) =>
                  items.reduce(
                    (all, tag) => ({ ...all, [tag]: (all[tag] ?? 0) + 1 }),
                    {},
                  );
                const before = count(prior.tags.map((item) => item.tag));
                const after = count(state.components);
                for (const [tag, n] of Object.entries(before))
                  assert.ok(
                    after[tag] >= n,
                    `${tag}: preserved ${after[tag]}/${n}`,
                  );
              }
              assert.deepEqual(errors, [], "runtime and local resources");
              results.push({
                file,
                theme,
                width,
                sections: state.sections,
                status: "passed",
              });
              if (theme === "v1" && [1440, 390].includes(width)) {
                const name = `${slug(file)}-${width}.png`;
                await page.screenshot({ path: path.join(output, name) });
                screenshots.push({ file, name, width });
              }
            } catch (error) {
              failures.push({
                file,
                theme,
                width,
                error: error.message,
                errors: [...errors],
              });
              console.error(file, theme, width, error.message, errors);
              if (errors.some((message) => message.startsWith("404")))
                throw error;
              await page
                .screenshot({
                  path: path.join(
                    output,
                    `failure-${slug(file)}-${theme}-${width}.png`,
                  ),
                })
                .catch(() => {});
            }
          }
          console.log(
            `${theme} / ${width}px: ${pages.length} pages checked; ${failures.length} failures so far`,
          );
        }
      }
      // Real native form association, including fieldset disable and reset.
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${origin}/pages/atoms/checkbox.html`);
      const gift = page.locator("#checkbox-form zone-checkbox").first();
      assert.equal(
        await page.evaluate(() =>
          new FormData(document.querySelector("#checkbox-form")).get("service"),
        ),
        "gift",
      );
      await gift.locator("input").focus();
      await page.keyboard.press("Space");
      assert.equal(
        await page.evaluate(() =>
          new FormData(document.querySelector("#checkbox-form")).has("service"),
        ),
        false,
      );
      await page.getByRole("button", { name: "重置选择", exact: true }).click();
      await page.waitForFunction(
        () => document.querySelector("#checkbox-form zone-checkbox").checked,
      );
      assert.equal(
        await page.evaluate(() =>
          new FormData(document.querySelector("#checkbox-form")).get("service"),
        ),
        "gift",
      );
      await page
        .getByRole("button", { name: "切换整组禁用", exact: true })
        .click();
      assert.equal(
        await page.evaluate(
          () =>
            [...new FormData(document.querySelector("#checkbox-form"))].length,
        ),
        0,
      );
      results.push({
        scenario: "native checkbox FormData/Space/reset/fieldset",
        status: "passed",
      });

      await page.goto(`${origin}/pages/atoms/dropdown.html?theme=v3`);
      await page.locator("#flat .trigger").click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      assert.ok(
        await page.locator("#flat").evaluate((el) => el.value),
        "dropdown keyboard selection",
      );
      await page.locator("#tree .trigger").click();
      await page.screenshot({
        path: path.join(output, "dropdown-open-desktop.png"),
      });
      results.push({
        scenario: "dropdown keyboard and tree popup",
        status: "passed",
      });

      await page.goto(`${origin}/pages/atoms/filter-select.html`);
      const filter = page.locator("zone-filter-select").first();
      await filter.locator(".trigger").click();
      await filter.locator('[role="option"]').first().click();
      assert.equal(
        await filter.evaluate((el) => el.value.length),
        0,
        "draft is not submitted",
      );
      await filter.locator(".confirm").click();
      assert.equal(
        await filter.evaluate((el) => el.value.length),
        1,
        "confirm submits",
      );
      results.push({ scenario: "filter draft/confirm", status: "passed" });

      await page.goto(`${origin}/pages/atoms/dialog.html`);
      await page.locator(".btn-small").click();
      await page.waitForFunction(
        () => document.querySelector(".dialog-small").open,
      );
      assert.ok(
        await page
          .locator(".examples-sidebar")
          .evaluate((el) => !!el.closest("[inert]")),
        "modal background isolation",
      );
      await page.screenshot({
        path: path.join(output, "dialog-open-desktop.png"),
      });
      await page.keyboard.press("Escape");
      await page.waitForFunction(
        () => !document.querySelector(".dialog-small").open,
      );
      assert.ok(
        await page
          .locator(".btn-small button")
          .evaluate((el) => el.getRootNode().activeElement === el),
        "modal restores shadow trigger",
      );
      results.push({
        scenario: "dialog open/Escape/background/focus",
        status: "passed",
      });

      await page.goto(`${origin}/pages/atoms/tooltip.html`);
      const trigger = page
        .locator("zone-tooltip")
        .first()
        .locator("zone-button button");
      await trigger.focus();
      await page.waitForFunction(
        () => document.querySelector("zone-tooltip").visible,
      );
      assert.ok(
        await trigger.evaluate((el) =>
          (el.getAttribute("aria-describedby") ?? "")
            .split(/\s+/)
            .some((id) =>
              el
                .getRootNode()
                .getElementById(id)
                ?.textContent.includes("cancel"),
            ),
        ),
        "description resolves in the real focused control root",
      );
      await page.keyboard.press("Escape");
      await page.waitForFunction(
        () => !document.querySelector("zone-tooltip").visible,
      );
      results.push({
        scenario: "tooltip keyboard description/Escape",
        status: "passed",
      });

      await page.goto(`${origin}/pages/atoms/popover.html`);
      await page.locator("#button-13").click();
      await page.waitForFunction(
        () => document.querySelector("#popover-13").visible,
      );
      await page.keyboard.press("Escape");
      await page.waitForFunction(
        () => !document.querySelector("#popover-13").visible,
      );
      results.push({ scenario: "popover click/Escape", status: "passed" });

      await page.goto(`${origin}/pages/atoms/toast.html`);
      await page.getByRole("button", { name: "重新演示倒计时" }).click();
      assert.equal(
        await page.locator("#timed-toast").evaluate((el) => el.countdownTime),
        5,
      );
      await page.waitForFunction(
        () => document.querySelector("#timed-toast").closed,
        { timeout: 8000 },
      );
      await page.getByRole("button", { name: "重新演示倒计时" }).click();
      assert.equal(
        await page.locator("#timed-toast").evaluate((el) => el.closed),
        false,
      );
      results.push({ scenario: "toast timer and replay", status: "passed" });

      for (const view of ["pc", "mb"]) {
        await page.goto(
          `${origin}/pages/atoms/dropdown.html?view=${view}&theme=v2`,
        );
        assert.equal(
          await page.locator("body").getAttribute("data-view"),
          view,
        );
        assert.equal(await page.locator(".examples-sidebar").count(), 0);
      }
      results.push({
        scenario: "legacy pc/mb preview modes",
        status: "passed",
      });
      await page.goto(`${origin}/pages/i18n/all.html`);
      await page.locator("#table-root table").waitFor();
      const search = page.getByRole("textbox", { name: "搜索翻译键或文案" });
      await search.fill("common.close");
      assert.ok(await page.locator("#table-root tbody tr").count());
      results.push({ scenario: "translations table search", status: "passed" });
    } finally {
      await context.close();
    }
  };
  if (process.env.EXAMPLES_ORIGIN)
    await run(process.env.EXAMPLES_ORIGIN.replace(/\/$/, ""));
  else
    await withStaticServer(
      path.resolve(
        root,
        process.env.EXAMPLES_DIRECTORY ?? "apps/examples/dist",
      ),
      (origin) => run(origin + (process.env.EXAMPLES_BASE_PATH ?? "")),
    );
} catch (error) {
  failures.push({ scenario: "interactive verification", error: error.stack });
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "verification.json"),
    JSON.stringify({ results, failures, screenshots }, null, 2),
  );
}
console.log(`${results.length} checks passed; ${failures.length} failures`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
