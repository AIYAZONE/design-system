import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "output/tooltip-colors-20261120");
fs.mkdirSync(output, { recursive: true });
const rows = [];
const browser = await chromium.launch({ headless: true });
function luminance(rgb) {
  const channels = rgb
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map((n) => Number(n) / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
async function colors(tooltip) {
  return tooltip.evaluate((host) => {
    const popover = host.shadowRoot.querySelector("zone-popover").shadowRoot;
    const panel = popover.querySelector(".popover");
    const probe = document.createElement("span");
    document.body.append(probe);
    const resolve = (variable) => {
      probe.style.color = `var(${variable})`;
      return getComputedStyle(probe).color;
    };
    const result = {
      background: getComputedStyle(panel).backgroundColor,
      arrow: getComputedStyle(popover.querySelector(".arrow")).backgroundColor,
      text: getComputedStyle(host.shadowRoot.querySelector(".content")).color,
      rich: host.querySelector("h2")
        ? getComputedStyle(host.querySelector("h2")).color
        : null,
      neutral: resolve("--zone-color-neutral"),
      primary: resolve("--zone-color-primary"),
    };
    probe.remove();
    return result;
  });
}
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const theme of ["v1", "v2", "v3"])
        for (const mode of ["light", "dark"])
          for (const width of [375, 820, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            await page.goto(
              `${origin}/examples/pages/atoms/tooltip.html?theme=${theme}`,
            );
            await page.waitForSelector("zone-tooltip");
            await page.evaluate(async (mode) => {
              window.__aiyazoneColorMode.setTheme(mode);
              await document.fonts.ready;
            }, mode);
            assert.equal(
              await page.locator("zone-tooltip").count(),
              12,
              "preserve all placements",
            );
            for (const rich of [false, true]) {
              const tooltip = rich
                ? page.locator("zone-tooltip").last()
                : page.locator("zone-tooltip").first();
              await tooltip.locator("zone-button button").focus();
              await tooltip.evaluate((el) => el.updateComplete);
              await page.waitForFunction((rich) => {
                const tips = document.querySelectorAll("zone-tooltip");
                return (rich ? tips[tips.length - 1] : tips[0]).visible;
              }, rich);
              const state = await colors(tooltip);
              assert.equal(state.background, state.neutral);
              assert.equal(state.arrow, state.background);
              assert.equal(state.text, "rgb(255, 255, 255)");
              if (rich)
                assert.equal(state.rich, state.text, "rich content foreground");
              assert.ok(
                contrast(state.text, state.background) >= 4.5,
                "readable contrast",
              );
              rows.push({ theme, mode, width, rich, ...state });
              if (rich && [375, 1440].includes(width))
                await page.screenshot({
                  path: path.join(output, `${theme}-${mode}-${width}.png`),
                });
              await page.keyboard.press("Escape");
            }
            const tooltip = page.locator("zone-tooltip").first();
            await tooltip.evaluate((el) => {
              el.style.setProperty(
                "--zone-tooltip-background-color",
                "var(--zone-color-primary)",
              );
              el.style.setProperty(
                "--zone-tooltip-color",
                "var(--zone-color-white)",
              );
            });
            await tooltip.locator("zone-button button").focus();
            await page.waitForFunction(
              () => document.querySelector("zone-tooltip").visible,
            );
            const custom = await colors(tooltip);
            assert.equal(
              custom.background,
              custom.primary,
              "background override",
            );
            assert.equal(
              custom.arrow,
              custom.background,
              "custom arrow matches",
            );
            assert.ok(
              contrast(custom.text, custom.background) >= 4.5,
              "custom contrast",
            );
            if (width === 1440) {
              await page.addScriptTag({
                path: path.join(root, "node_modules/axe-core/axe.min.js"),
              });
              const violations = await page.evaluate(async () => {
                axe.reset();
                axe.configure({ rules: [{ id: "region", enabled: false }] });
                return (
                  await axe.run({ include: ["zone-tooltip"] })
                ).violations.map((v) => v.id);
              });
              assert.deepEqual(violations, [], "tooltip accessibility");
            }
            await page.keyboard.press("Escape");
            console.log(
              `${theme} ${mode} ${width}: default, rich and custom colors passed`,
            );
          }
      assert.deepEqual(errors, []);
    },
  );
  console.log(
    `${rows.length} default/rich color checks and 18 custom palette checks passed.`,
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "results.json"),
    JSON.stringify(rows, null, 2),
  );
}
