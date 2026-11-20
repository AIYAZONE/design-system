import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "output/component-refinement-20261119");
fs.mkdirSync(path.join(output, "after"), { recursive: true });
const results = [];
const errors = [];
const browser = await chromium.launch({ headless: true });
const settle = (page) =>
  page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  });
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      page.on("pageerror", (error) => errors.push(error.message));
      for (const mode of ["light", "dark"])
        for (const theme of ["v1", "v2", "v3"])
          for (const width of [1440, 768, 414, 375, 320]) {
            const current = { mode, theme, width };
            await page.setViewportSize({ width, height: 900 });
            await page.goto(
              `${origin}/examples/pages/components/refinement.html?theme=${theme}`,
            );
            await page.waitForFunction(
              () =>
                document.querySelector("#refined-dropdown")?.options.length >
                10,
            );
            await page.evaluate(async (mode) => {
              window.__aiyazoneColorMode.setTheme(mode);
              await document.fonts.ready;
            }, mode);
            assert.ok(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1,
              ),
              `page overflow ${JSON.stringify(current)}`,
            );
            const checkbox = page.locator("#mixed-checkbox");
            assert.equal(
              await checkbox
                .locator("input")
                .evaluate((el) => el.indeterminate),
              true,
            );
            await checkbox.locator("input").focus();
            await page.keyboard.press("Space");
            assert.equal(
              await checkbox
                .locator("input")
                .evaluate((el) => el.indeterminate),
              false,
            );
            assert.equal(await checkbox.locator("input").isChecked(), true);
            for (const selector of [
              "#long-checkbox .checkbox",
              "#long-badge .badge",
              "#long-toast .toast",
            ]) {
              const locator = page.locator(selector);
              assert.ok(
                await locator.evaluate(
                  (el) => el.scrollWidth <= el.clientWidth + 1,
                ),
                `${selector} content overflow ${JSON.stringify(current)}`,
              );
            }
            assert.ok((await page.locator("#long-toast .toast").boundingBox()).width <= 561, "notification max width");
            const badgeIcon = page.locator('#long-badge slot[name="icon"]');
            assert.ok(
              await badgeIcon.evaluate(
                (el) => el.getBoundingClientRect().width > 0,
              ),
            );
            const dropdown = page.locator("#refined-dropdown");
            await dropdown.locator(".trigger").focus();
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("Enter");
            assert.equal(
              await dropdown.evaluate((el) => el.value),
              "express",
              "keyboard skips disabled dropdown option",
            );
            const filter = page.locator("#refined-filter");
            await filter.locator(".trigger").focus();
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            await settle(page);
            assert.ok(
              (await filter.locator(".option--active").count()) === 1,
              "one active keyboard row " +
                JSON.stringify(
                  await filter.evaluate((el) => ({
                    open: el.open,
                    active: el._activeIndex,
                    focus: el.shadowRoot.activeElement?.className,
                    y: scrollY,
                  })),
                ),
            );
            assert.notEqual(
              await filter
                .locator(".option--active")
                .evaluate((el) => getComputedStyle(el).boxShadow),
              "none",
            );
            await page.keyboard.press("Space");
            await filter.locator(".confirm").click();
            assert.ok(await filter.evaluate((el) => el.value.length > 0));
            const trigger = page.locator("#popover-trigger");
            await trigger.click();
            await settle(page);
            const popover = page.locator("#long-popover .popover");
            let bounds = await popover.boundingBox();
            assert.ok(
              bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
              "popover within horizontal viewport",
            );
            assert.ok(
              bounds.y >= -1 && bounds.y + bounds.height <= 901,
              "popover within vertical viewport",
            );
            assert.ok(
              await page
                .locator("#long-popover .popover__content")
                .evaluate((el) => el.scrollHeight > el.clientHeight),
              "long popover scrolls internally",
            );
            await page.keyboard.press("Escape");
            const tooltipTrigger = page.locator("#long-tooltip zone-button");
            await tooltipTrigger.locator("button").focus();
            await page.waitForFunction(
              () => document.querySelector("#long-tooltip").visible,
            );
            const tooltip = page.locator("#long-tooltip zone-popover .popover");
            await settle(page);
            bounds = await tooltip.boundingBox();
            assert.ok(
              bounds.width <= Math.min(320, width - 14) + 1,
              "tooltip line length " + JSON.stringify({ ...current, bounds }),
            );
            assert.ok(
              bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
              "tooltip contained",
            );
            await page.keyboard.press("Escape");
            const paused = page.locator("#paused-spinner .spinner");
            assert.equal(
              await paused.evaluate(
                (el) => getComputedStyle(el).animationPlayState,
              ),
              "paused",
            );
            await page.locator("#dialog-trigger").click();
            const dialog = page.locator("#refined-dialog");
            await settle(page);
            assert.equal(await dialog.locator('.content').evaluate(el => el.scrollTop), 0, 'long dialog starts at its title');
      const closeBounds = await dialog
              .locator("button.close")
              .boundingBox();
            assert.ok(
              closeBounds.width >= 44 && closeBounds.height >= 44,
              "dialog close hit area",
            );
            const container = dialog.locator(".container");
            bounds = await container.boundingBox();
            assert.ok(
              bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
              "dialog horizontal containment",
            );
            assert.ok(
              bounds.y >= -1 && bounds.y + bounds.height <= 901,
              "dialog vertical containment",
            );
            if (width === 1440 || width === 375) {
              await page.screenshot({
                path: path.join(
                  output,
                  `after/dialog-${theme}-${mode}-${width}.png`,
                ),
              });
            }
            await page.keyboard.press("Escape");
            await settle(page);
            assert.equal(
              await page
                .locator("#dialog-trigger button")
                .evaluate((el) => el === el.getRootNode().activeElement),
              true,
              "dialog restores trigger focus",
            );
            // Notification can close and replay without losing caller actions.
            await page.locator("#long-toast .close button").click();
            assert.equal(await page.locator("#long-toast").isVisible(), false);
            await page.locator('[data-replay-toast="long-toast"]').click();
            assert.equal(await page.locator("#long-toast").isVisible(), true);
            assert.equal(
              await page.locator('#long-toast [slot="action"]').count(),
              1,
            );
            if (width === 1440 || width === 375) {
              await page.locator("#long-toast").scrollIntoViewIfNeeded();
              await page.screenshot({
                path: path.join(
                  output,
                  `after/notifications-${theme}-${mode}-${width}.png`,
                ),
              });
              await page.evaluate(() => window.scrollTo(0, 0));
              await page.screenshot({
                path: path.join(
                  output,
                  `after/controls-${theme}-${mode}-${width}.png`,
                ),
              });
            }
            if (mode === "light" && [1440, 375].includes(width)) {
              await page.addScriptTag({ path: path.join(root, "node_modules/axe-core/axe.min.js") });
              const violations = await page.evaluate(async () => {
                axe.reset();
                axe.configure({ rules: [{ id: "region", enabled: false }] });
                return (await axe.run(document.body)).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }));
              });
              fs.writeFileSync(path.join(output, `axe-${theme}-${width}.json`), JSON.stringify(violations, null, 2));
              assert.deepEqual(violations, [], `component reference accessibility ${theme} ${width}`);
            }
            results.push(current);
            console.log(
              `${mode} ${theme} ${width}px: states, wrapping, keyboard, overlays passed`,
            );
          }
      // Short desktop window and high zoom equivalent: dialog content remains reachable.
      await page.setViewportSize({ width: 1024, height: 420 });
      await page.locator("#dialog-trigger").click();
      await settle(page);
      const rect = await page
        .locator("#refined-dialog .container")
        .boundingBox();
      assert.ok(
        rect.y >= 0 && rect.y + rect.height <= 420,
        "short viewport dialog",
      );
      await page
        .locator("#refined-dialog .content")
        .evaluate((el) => (el.scrollTop = el.scrollHeight));
      assert.equal(await page.locator("#dialog-confirm").isVisible(), true);
      await page.keyboard.press("Escape");
      const touch = await browser.newContext({ isMobile: true, hasTouch: true, viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
      const touchPage = await touch.newPage();
      for (const theme of ["v1", "v2", "v3"]) {
        await touchPage.goto(`${origin}/examples/pages/components/refinement.html?theme=${theme}`);
        await touchPage.waitForFunction(() => document.querySelector("#refined-filter")?.options.length > 10);
        await touchPage.locator("#refined-filter .trigger").tap();
        const row = await touchPage.locator("#refined-filter .option").first().boundingBox();
        assert.ok(row.height >= 44, `touch option hit target ${theme}`);
        await touchPage.locator("#refined-filter .option").first().tap();
        await touchPage.locator("#refined-filter .confirm").tap();
        assert.equal(await touchPage.locator("#refined-filter").evaluate(el => el.value.length), 1);
      }
      await touch.close();
      assert.deepEqual(errors, [], "runtime errors");
    },
  );
  console.log(
    `${results.length} component combinations passed; no runtime errors`,
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "verification.json"),
    JSON.stringify({ results, errors }, null, 2),
  );
}
