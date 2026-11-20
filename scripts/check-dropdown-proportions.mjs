import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";
const root = path.resolve(import.meta.dirname, ".."),
  output = path.join(root, "output/dropdown-proportions-20261120");
fs.mkdirSync(output, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const theme of ["v1", "v2", "v3"])
        for (const mode of ["light", "dark"])
          for (const width of [375, 820, 1024, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            await page.goto(
              `${origin}/examples/pages/components/refinement.html?theme=${theme}`,
            );
            await page.waitForFunction(
              () =>
                document.querySelector("#refined-dropdown")?.options.length > 1,
            );
            await page.evaluate(async (mode) => {
              window.__aiyazoneColorMode.setTheme(mode);
              await document.fonts.ready;
            }, mode);
            const d = page.locator("#refined-dropdown");
            const state = await d.evaluate((host) => {
              const root = host.shadowRoot;
              const trigger = root.querySelector(".trigger"),
                f = document
                  .querySelector("#refined-filter")
                  .shadowRoot.querySelector(".trigger");
              return {
                height: trigger.getBoundingClientRect().height,
                filterHeight: f.getBoundingClientRect().height,
                font: parseFloat(getComputedStyle(trigger).fontSize),
                label: parseFloat(
                  getComputedStyle(root.querySelector(".label")).fontSize,
                ),
                icon: root
                  .querySelector(".trigger-icon svg")
                  .getBoundingClientRect().width,
                iconBox: root
                  .querySelector(".trigger-icon")
                  .getBoundingClientRect().width,
              };
            });
            assert.equal(state.height, 36);
            assert.equal(state.height, state.filterHeight);
            assert.equal(state.font, 16);
            assert.equal(state.label, 14);
            assert.equal(state.icon, 16);
            assert.equal(state.iconBox, 20);
            await d.locator(".trigger").focus();
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("Enter");
            assert.equal(
              await d.evaluate((el) => el.value),
              "express",
              "keyboard skips disabled",
            );
            const clear = await d.locator(".clear").boundingBox(),
              arrow = await d.locator(".trigger-icon").boundingBox();
            assert.ok(
              clear.x + clear.width <= arrow.x,
              "clear and arrow do not overlap",
            );
            await d.locator(".clear").click();
            assert.equal(await d.evaluate((el) => el.value), "");
            await d.locator(".trigger").click();
            const sizes = await d
              .locator(".option")
              .evaluateAll((rows) =>
                rows.map((el) => parseFloat(getComputedStyle(el).fontSize)),
              );
            assert.ok(
              sizes.every((size) => size === 14),
              "uniform menu type",
            );
            if (width === 1440) {
              await page.addScriptTag({
                path: path.join(root, "node_modules/axe-core/axe.min.js"),
              });
              const violations = await page.evaluate(async () => {
                axe.reset();
                axe.configure({ rules: [{ id: "region", enabled: false }] });
                return (
                  await axe.run({ include: ["#refined-dropdown"] })
                ).violations.map((v) => v.id);
              });
              assert.deepEqual(violations, []);
            }
            if (mode === "light" && [375, 1440].includes(width))
              await page.screenshot({
                path: path.join(output, `aligned-${theme}-${width}.png`),
              });
            await page.keyboard.press("Escape");
            await d.evaluate((el) => {
              el.style.setProperty("--zone-dropdown-height", "48px");
              el.style.setProperty("--zone-dropdown-font-size", "20px");
              el.style.setProperty("--zone-dropdown-label-font-size", "15px");
            });
            assert.equal(
              (await d.locator(".trigger").boundingBox()).height,
              48,
            );
            assert.equal(
              await d
                .locator(".label")
                .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
              15,
            );
            assert.ok(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1,
              ),
            );
            results.push({ theme, mode, width, ...state });
          }
      for (const theme of ["v1", "v2", "v3"]) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.goto(
          `${origin}/examples/pages/atoms/dropdown.html?theme=${theme}`,
        );
        await page.waitForFunction(
          () => !document.querySelector("#run-checks").disabled,
        );
        const tree = page.locator("#tree");
        await tree.locator(".trigger").focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Home");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Enter");
        assert.equal(
          await tree.evaluate((el) => el.value),
          "explorer",
          "tree keyboard expansion and leaf selection",
        );
        const large = page.locator("#large");
        await large.evaluate((el) =>
          el.style.setProperty("--zone-dropdown-width", "280px"),
        );
        await large.locator(".trigger").focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("End");
        await page.keyboard.press("Enter");
        assert.equal(await large.evaluate((el) => el.value), "large-4999");
        await large.locator(".trigger").focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Home");
        await page.waitForFunction(() => {
          const root = document.querySelector("#large").shadowRoot;
          return [...root.querySelectorAll("[data-virtual-row]")].some(
            (el) => el.getBoundingClientRect().height > 48,
          );
        });
        assert.ok(
          (await large.locator('[role="option"]').count()) < 60,
          "virtualization retained",
        );
        await page.keyboard.press("Escape");
        await page.setViewportSize({ width: 375, height: 1000 });
        await page.locator("#run-checks").click();
        await page.waitForFunction(() =>
          /passed:|FAILED/.test(
            document.querySelector("#checks-result").textContent,
          ),
        );
        assert.ok(
          !(await page.locator("#checks-result").textContent()).includes(
            "FAILED",
          ),
          await page.locator("#checks-result").textContent(),
        );
      }
      const context = await browser.newContext({
        hasTouch: true,
        isMobile: true,
        viewport: { width: 375, height: 900 },
        reducedMotion: "reduce",
      });
      const touch = await context.newPage();
      for (const theme of ["v1", "v2", "v3"]) {
        await touch.goto(
          `${origin}/examples/pages/components/refinement.html?theme=${theme}`,
        );
        await touch.waitForFunction(
          () => document.querySelector("#refined-dropdown")?.options.length > 1,
        );
        assert.equal(
          (await touch.locator("#refined-dropdown .trigger").boundingBox())
            .height,
          44,
        );
        assert.equal(
          (await touch.locator("#refined-filter .trigger").boundingBox())
            .height,
          44,
        );
        await touch.locator("#refined-dropdown .trigger").tap();
        assert.ok(
          (
            await touch
              .locator("#refined-dropdown .option")
              .first()
              .boundingBox()
          ).height >= 44,
        );
        await touch.locator("#refined-dropdown .option").first().tap();
        assert.equal(
          await touch.locator("#refined-dropdown").evaluate((el) => el.value),
          "standard",
        );
      }
      await context.close();
      assert.deepEqual(errors, []);
      console.log(
        `${results.length} layout combinations; tree, 5000-item list, native forms, overrides and 3 touch themes passed.`,
      );
    },
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "verification.json"),
    JSON.stringify(results, null, 2),
  );
}
