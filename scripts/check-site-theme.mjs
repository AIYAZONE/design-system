import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "output/site-theme-20261119");
fs.mkdirSync(output, { recursive: true });
const key = "aiyazone-site-theme";
const examples = fs
  .readdirSync(path.join(root, "apps/examples/pages"), { recursive: true })
  .filter((file) => file.endsWith(".html"))
  .map((file) => `/examples/pages/${file}`);
const routes = [
  "/index.html",
  "/ai-usage.html",
  "/ai-demo.html",
  "/icons/index.html",
  "/architecture.html",
  "/architecture-reference.html",
  "/examples/index.html",
  ...examples,
];
const results = [];
const errors = [];
const browser = await chromium.launch({ headless: true });
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      let pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (response) => {
        if (
          response.status() >= 400 &&
          new URL(response.url()).origin === origin
        )
          pageErrors.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(`${origin}/index.html`);
      assert.equal(
        await page.locator("html").getAttribute("data-site-theme"),
        "light",
        "light default",
      );
      await page.getByRole("button", { name: "切换到深色主题" }).click();
      assert.equal(
        await page.evaluate((key) => localStorage.getItem(key), key),
        "dark",
      );
      await page.reload();
      assert.equal(
        await page.locator("html").getAttribute("data-site-theme"),
        "dark",
        "persist after reload",
      );
      results.push("default, switch and persistence");
      for (const mode of ["light", "dark"]) {
        await page.evaluate(
          ({ key, mode }) => {
            localStorage.setItem(key, mode);
            window.__aiyazoneColorMode.setTheme(mode);
          },
          { key, mode },
        );
        for (const width of [1440, 768, 390, 320]) {
          await page.setViewportSize({ width, height: 1000 });
          for (const route of routes) {
            pageErrors = [];
            await page.goto(origin + route);
            await page.waitForSelector("[data-site-theme-toggle]");
            await page.evaluate(async () => {
              await document.fonts.ready;
            });
            assert.equal(
              await page.locator("html").getAttribute("data-site-theme"),
              mode,
              route,
            );
            assert.equal(
              await page
                .locator("[data-site-theme-toggle]")
                .getAttribute("aria-pressed"),
              String(mode === "light"),
            );
            assert.ok(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1,
              ),
              `overflow ${route} ${width}`,
            );
            assert.deepEqual(pageErrors, [], `${route} runtime/resources`);
            if (mode === "light")
              assert.equal(
                await page.evaluate(
                  () => getComputedStyle(document.body).backgroundColor,
                ),
                "rgb(247, 249, 252)",
                route,
              );
            if (width === 1440) {
              const before = await page.locator("main").boundingBox();
              await page.evaluate(async () => {
                window.scrollTo(0, document.documentElement.scrollHeight);
                await new Promise(requestAnimationFrame);
                await new Promise(requestAnimationFrame);
              });
              const state = await page.evaluate(() => ({
                top: document.querySelector(".portal-topbar").getBoundingClientRect().top,
                scrolled: window.scrollY,
                shadow: document.querySelector(".portal-topbar").classList.contains("is-scrolled"),
                main: document.querySelector("main").getBoundingClientRect().top + window.scrollY,
              }));
              assert.ok(Math.abs(state.top) < 1, `sticky header ${route}`);
              assert.equal(state.shadow, state.scrolled > 8, `scroll state ${route}`);
              assert.ok(Math.abs(state.main - before.y) < 1, `header layout shift ${route}`);
              await page.evaluate(async () => {
                window.scrollTo(0, 0);
                await new Promise(requestAnimationFrame);
                await new Promise(requestAnimationFrame);
              });
              assert.equal(await page.locator(".portal-topbar").evaluate(el => el.classList.contains("is-scrolled")), false);
            }
            results.push({ route, mode, width });
            if (
              [1440, 390].includes(width) &&
              [
                "/index.html",
                "/examples/pages/atoms/button.html",
                "/icons/index.html",
                "/architecture.html",
              ].includes(route)
            ) {
              await page.screenshot({
                path: path.join(
                  output,
                  `${route.replaceAll("/", "-").replace(".html", "")}-${mode}-${width}.png`,
                ),
              });
            }
          }
          console.log(`${mode} ${width}px: ${routes.length} routes passed`);
        }
      }
      // Site appearance must never rewrite the component theme values.
      for (const theme of ["v1", "v2", "v3"]) {
        await page.goto(
          `${origin}/examples/pages/atoms/button.html?theme=${theme}`,
        );
        const colors = async () =>
          page
            .locator("main zone-button")
            .first()
            .locator("button")
            .evaluate((el) => ({
              color: getComputedStyle(el).color,
              background: getComputedStyle(el).backgroundColor,
              radius: getComputedStyle(el).borderRadius,
              height: el.getBoundingClientRect().height,
            }));
        const before = await colors();
        await page.getByRole("button", { name: "切换到浅色主题" }).click();
        assert.deepEqual(
          await colors(),
          before,
          `${theme} component style changed`,
        );
        assert.equal(
          await page.locator(".theme-switcher__btn.is-active").textContent(),
          theme.toUpperCase(),
        );
        await page.getByRole("button", { name: "切换到深色主题" }).click();
      }
      results.push("V1/V2/V3 component theme independence");
      const second = await context.newPage();
      await second.goto(`${origin}/icons/index.html`);
      await page.getByRole("button", { name: "切换到浅色主题" }).click();
      await second.waitForFunction(
        () => document.documentElement.dataset.siteTheme === "light",
      );
      results.push("cross-tab synchronization");
      await second.close();
      // Keyboard switching and persistence when storage is unavailable.
      const toggle = page.getByRole("button", { name: "切换到深色主题" });
      await toggle.focus();
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator("html").getAttribute("data-site-theme"),
        "dark",
      );
      const blocked = await browser.newContext();
      await blocked.addInitScript(() =>
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new DOMException("blocked", "SecurityError");
          },
        }),
      );
      const blockedPage = await blocked.newPage();
      await blockedPage.goto(`${origin}/index.html`);
      await blockedPage.getByRole("button", { name: "切换到深色主题" }).click();
      assert.equal(
        await blockedPage.locator("html").getAttribute("data-site-theme"),
        "dark",
      );
      await blocked.close();
      results.push("keyboard and blocked-storage fallback");
      // Storybook manager and its independent docs renderer update without a reload.
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(
        `${origin}/storybook/index.html?path=/docs/介绍--document`,
      );
      await page.waitForSelector("[data-site-theme-toggle]");
      const frame = page.frameLocator("#storybook-preview-iframe");
      await frame.locator(".sbdocs-wrapper").waitFor();
      await page.getByRole("button", { name: "切换到浅色主题" }).click();
      await frame.locator('html[data-site-theme="light"]').waitFor();
      await page.waitForTimeout(250);
      assert.equal(
        await frame
          .locator(".sbdocs-wrapper")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgb(247, 249, 252)",
      );
      const headingLight = await frame
        .locator(".sbdocs-content h1")
        .first()
        .evaluate((el) => getComputedStyle(el).color);
      await page.screenshot({
        path: path.join(output, "storybook-light-1440.png"),
      });
      await page.getByRole("button", { name: "切换到深色主题" }).click();
      await frame.locator('html[data-site-theme="dark"]').waitFor();
      await page.waitForTimeout(250);
      assert.notEqual(
        await frame
          .locator(".sbdocs-content h1")
          .first()
          .evaluate((el) => getComputedStyle(el).color),
        headingLight,
        "Docs React theme must update",
      );
      await page.screenshot({
        path: path.join(output, "storybook-dark-1440.png"),
      });
      results.push("Storybook manager/docs live synchronization");
      for (const width of [390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const mode of ["light", "dark"]) {
          if (
            (await page.locator("html").getAttribute("data-site-theme")) !==
            mode
          )
            await page.locator("[data-site-theme-toggle]").click();
          await frame.locator(`html[data-site-theme="${mode}"]`).waitFor();
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            `Storybook overflow ${width}`,
          );
          assert.ok(await page.locator("[data-site-theme-toggle]").isVisible());
          await page.screenshot({
            path: path.join(output, `storybook-${mode}-${width}.png`),
          });
          results.push({ route: "storybook", mode, width });
        }
      }
      await context.close();
    },
  );
} catch (error) {
  errors.push(error.stack);
  console.error(error);
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "verification.json"),
    JSON.stringify({ results, errors }, null, 2),
  );
}
console.log(
  `${results.length} appearance checks passed; ${errors.length} errors`,
);
if (errors.length) process.exitCode = 1;
