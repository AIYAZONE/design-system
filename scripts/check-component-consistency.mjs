import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";
const root = path.resolve(import.meta.dirname, "..");
const stage = Number(
  process.argv.find((a) => a.startsWith("--stage="))?.split("=")[1] ?? 1,
);
const output = path.join(
  root,
  "output/component-consistency-20261120",
  `stage-${stage}`,
);
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [],
  errors = [];
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      page.on("pageerror", (e) => errors.push(e.message));
      for (const theme of ["v1", "v2", "v3"])
        for (const mode of ["light", "dark"])
          for (const width of [375, 820, 1023, 1024, 1440]) {
            await page.setViewportSize({ width, height: 950 });
            await page.goto(
              `${origin}/examples/pages/components/index.html?theme=${theme}#section-1`,
            );
            await page.evaluate(async (mode) => {
              window.__aiyazoneColorMode.setTheme(mode);
              await document.fonts.ready;
            }, mode);
            await page.waitForFunction(
              () => document.querySelector("zone-badge")?.hasUpdated,
            );
            const colors = await page
              .locator("zone-badge")
              .evaluateAll((hosts) =>
                hosts.map((h) => {
                  const s = getComputedStyle(
                    h.shadowRoot.querySelector(".badge"),
                  );
                  return {
                    label: h.textContent.trim(),
                    color: s.color,
                    bg: s.backgroundColor,
                  };
                }),
              );
            assert.ok(
              new Set(colors.map((c) => c.color)).size >= 6,
              `semantic colors ${theme}`,
            );
            // Convert actual browser color values (including color-mix) to sRGB for contrast.
            const probes = await page.evaluate(async () => {
              const area = document.createElement("div");
              document.querySelector("main").append(area);
              area.innerHTML =
                '<zone-badge style="--zone-badge-color:rgb(20 40 100);--zone-badge-bg-color:rgb(235 240 255)">Local</zone-badge><zone-badge kind="success" style="--zone-badge-text-color:rgb(20 40 100)">Text</zone-badge><zone-badge kind="custom">Fallback</zone-badge>';
              await Promise.all(
                [...area.children].map((h) => h.updateComplete),
              );
              const local = getComputedStyle(
                area.children[0].shadowRoot.querySelector(".badge"),
              );
              const text = getComputedStyle(
                area.children[1].shadowRoot.querySelector(".badge"),
              );
              const canvas = document.createElement("canvas");
              canvas.width = canvas.height = 1;
              const c = canvas.getContext("2d");
              const rgb = (color) => {
                c.clearRect(0, 0, 1, 1);
                c.fillStyle = color;
                c.fillRect(0, 0, 1, 1);
                return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3);
              };
              const fallback = getComputedStyle(
                area.children[2].shadowRoot.querySelector(".badge"),
              );
              const result = {
                local: local.color,
                bg: local.backgroundColor,
                text: text.color,
                fallback: [rgb(fallback.color), rgb(fallback.backgroundColor)],
              };
              area.remove();
              return result;
            });
            assert.equal(probes.local, "rgb(20, 40, 100)");
            assert.equal(probes.bg, "rgb(235, 240, 255)");
            assert.equal(probes.text, "rgb(20, 40, 100)");
            const lum = (rgb) =>
              rgb
                .map((n) => n / 255)
                .map((n) =>
                  n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4,
                )
                .reduce((s, n, i) => s + n * [0.2126, 0.7152, 0.0722][i], 0);
            const contrast = (pair) => {
              const [a, b] = pair.map(lum).sort((a, b) => a - b);
              return (b + 0.05) / (a + 0.05);
            };
            assert.ok(
              contrast(probes.fallback) >= 4.5,
              "custom kind without explicit color remains readable",
            );
            if (mode === "light" && width === 1440)
              await page.screenshot({
                path: path.join(output, `${theme}-overview.png`),
              });
            await page.goto(
              `${origin}/examples/pages/components/refinement.html?theme=${theme}#notifications`,
            );
            await page.waitForFunction(
              () =>
                document.querySelector(
                  '#long-toast > zone-button[slot="action-secondary"]',
                )?.variant === "secondary",
            );
            const actions = await page
              .locator("#long-toast > zone-button")
              .evaluateAll((buttons) =>
                buttons.map((b) => ({
                  slot: b.slot,
                  variant: b.variant,
                  size: b.size,
                  kind: b.kind,
                })),
              );
            assert.deepEqual(
              actions.map((a) => a.variant),
              ["primary", "secondary"],
            );
            assert.ok(
              actions.every((a) => a.size === "medium" && a.kind === "neutral"),
            );
            if (mode === "light" && width === 1440)
              await page.screenshot({
                path: path.join(output, `${theme}-toast.png`),
              });
            // Explicit choices equal to standalone defaults must survive composition too.
            await page.evaluate(async () => {
              const b = document.createElement("zone-button");
              b.variant = "primary";
              b.kind = "default";
              b.size = "large";
              b.slot = "action-secondary";
              const t = document.createElement("zone-toast");
              t.append(b);
              document.querySelector("main").append(t);
              await t.updateComplete;
              await b.updateComplete;
              window.__auditExplicit = [b.variant, b.kind, b.size];
              t.remove();
            });
            assert.deepEqual(
              await page.evaluate(() => window.__auditExplicit),
              ["primary", "default", "large"],
            );
            assert.ok(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1,
              ),
            );
            if (stage >= 2) {
              await page.locator("#dialog-trigger").click();
              const dialog = page.locator("#refined-dialog");
              await page.waitForFunction(
                () => document.querySelector("#refined-dialog").open,
              );
              const geometry = await dialog.evaluate((h) => {
                const r = h.shadowRoot,
                  c = r.querySelector(".container"),
                  t = r.querySelector(".dialog-title"),
                  b = r.querySelector(".content");
                return {
                  width: c.getBoundingClientRect().width,
                  title: parseFloat(getComputedStyle(t).fontSize),
                  padding: parseFloat(getComputedStyle(b).paddingLeft),
                  scrollable: b.scrollHeight > b.clientHeight,
                  radius: parseFloat(getComputedStyle(c).borderRadius),
                };
              });
              assert.ok(
                Math.abs(geometry.width - Math.min(640, width - 32)) < 1,
                JSON.stringify(geometry),
              );
              assert.equal(geometry.title, width < 600 ? 20 : 24);
              assert.equal(
                geometry.padding,
                width < 600 ? 16 : width < 1024 ? 24 : 32,
              );
              assert.equal(geometry.radius, theme === "v1" ? 12 : 0);
              assert.ok(geometry.scrollable, "long dialog scrolls");
              if (
                mode === "light" &&
                [375, 820, 1023, 1024, 1440].includes(width)
              )
                await page.screenshot({
                  path: path.join(output, `${theme}-dialog-${width}.png`),
                });
              await page.keyboard.press("Escape");
              assert.equal(await dialog.evaluate((h) => h.open), false);
              assert.equal(
                await page.evaluate(() => document.activeElement.id),
                "dialog-trigger",
              );
              await page.locator("#popover-trigger").click();
              const popover = page.locator("#long-popover .popover");
              await popover.waitFor({ state: "visible" });
              const floating = await popover.evaluate((e) => {
                const s = getComputedStyle(e);
                const probe = document.createElement("span");
                probe.style.color = "var(--zone-color-hr)";
                document.body.append(probe);
                const border = getComputedStyle(probe).color;
                probe.remove();
                return {
                  font: parseFloat(s.fontSize),
                  border: s.borderColor,
                  expected: border,
                  shadow: s.boxShadow,
                  width: e.getBoundingClientRect().width,
                };
              });
              assert.equal(floating.font, 16);
              assert.equal(floating.border, floating.expected);
              assert.notEqual(floating.shadow, "none");
              assert.ok(floating.width <= width - 14);
              if (mode === "light" && width === 1440)
                await page.screenshot({
                  path: path.join(output, `${theme}-popover.png`),
                });
              await page.keyboard.press("Escape");
            }
            if (stage >= 3) {
              const originalPath = path.join(
                root,
                "output/component-audit-20261120/metrics.json",
              );
              if (fs.existsSync(originalPath)) {
                const prior = JSON.parse(
                  fs.readFileSync(originalPath, "utf8"),
                ).find(
                  (r) =>
                    r.theme === theme &&
                    r.mode === mode &&
                    r.viewport === width,
                );
                if (prior) {
                  const current = await page
                    .locator("zone-button .button")
                    .first()
                    .evaluate((e) => {
                      const s = getComputedStyle(e);
                      return {
                        font: s.fontSize,
                        line: s.lineHeight,
                        color: s.color,
                        bg: s.backgroundColor,
                        radius: s.borderRadius,
                        height: e.getBoundingClientRect().height,
                      };
                    });
                  for (const key of Object.keys(current))
                    assert.equal(
                      current[key],
                      prior.button[key],
                      `standalone Button unchanged: ${theme} ${mode} ${width} ${key}`,
                    );
                }
              }

              const density = await page.evaluate(() => {
                const b = document
                  .querySelector('zone-badge[kind="success"]')
                  .shadowRoot.querySelector(".badge");
                return {
                  badgeFont: getComputedStyle(b).fontSize,
                  badgeHeight: b.getBoundingClientRect().height,
                  tooltipFont: getComputedStyle(
                    document
                      .querySelector("#long-tooltip")
                      .shadowRoot.querySelector(".content"),
                  ).fontSize,
                };
              });
              assert.equal(density.badgeFont, "14px");
              assert.equal(density.badgeHeight, 24);
              assert.equal(density.tooltipFont, "14px");
              await page.locator("#refined-filter .trigger").click();
              const panel = page.locator("#refined-filter .panel");
              await panel.waitFor({ state: "visible" });
              assert.ok((await panel.boundingBox()).width >= 240);
              assert.equal(
                await page
                  .locator("#refined-filter .option__label")
                  .first()
                  .evaluate((e) => getComputedStyle(e).fontSize),
                "14px",
              );
              assert.equal(
                (
                  await page
                    .locator("#refined-filter .trigger__arrow svg")
                    .boundingBox()
                ).width,
                16,
              );
              assert.ok(
                (
                  await page
                    .locator("#refined-filter .option")
                    .first()
                    .boundingBox()
                ).height >= 36,
              );
              if (mode === "light" && width === 1440)
                await page.screenshot({
                  path: path.join(output, `${theme}-filter.png`),
                });
              await page.keyboard.press("Escape");
              if (mode === "light" && [375, 1440].includes(width)) {
                await page
                  .locator("#composition-form")
                  .getByRole("button", { name: "保存偏好", exact: true })
                  .click();
                await page.locator("#composition-cancel").click();
                assert.equal(
                  await page
                    .locator("#composition-dialog")
                    .evaluate((h) => h.open),
                  false,
                );
                await page
                  .locator("#composition-form")
                  .getByRole("button", { name: "保存偏好", exact: true })
                  .click();
                await page.locator("#composition-confirm").click();
                await page.waitForFunction(
                  () => !document.querySelector("#composition-result").closed,
                );
                assert.equal(
                  await page
                    .locator("#composition-state")
                    .evaluate((h) => h.kind),
                  "success",
                );
                assert.ok(
                  (
                    await page.locator("#composition-summary").textContent()
                  ).includes("标准配送"),
                );
                assert.equal(
                  await page
                    .locator("#composition-undo")
                    .evaluate((h) => h.variant),
                  "secondary",
                );
                await page.locator("#composition-record").click();
                assert.ok(
                  (
                    await page.locator("#composition-feedback").textContent()
                  ).includes("演示记录"),
                );
                await page.locator("#composition").scrollIntoViewIfNeeded();
                await page.screenshot({
                  path: path.join(output, `${theme}-composition-${width}.png`),
                });
                await page.locator("#composition-undo").click();
                assert.equal(
                  await page
                    .locator("#composition-result")
                    .evaluate((h) => h.closed),
                  true,
                );
                assert.equal(
                  await page
                    .locator("#composition-state")
                    .evaluate((h) => h.kind),
                  "neutral",
                );
              }
            }
            results.push({ theme, mode, width, colors, actions });
          }
      await page.goto(
        `${origin}/examples/pages/atoms/badge.html#badge-variants`,
      );
      const pairs = await page
        .locator('zone-badge[kind="custom"]')
        .evaluateAll(async (hosts) => {
          await Promise.all(hosts.map((h) => h.updateComplete));
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const c = canvas.getContext("2d");
          const rgb = (color) => {
            c.fillStyle = color;
            c.fillRect(0, 0, 1, 1);
            return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3);
          };
          return hosts
            .filter((h) => h.variant === "soft" || h.variant === "solid")
            .map((h) => {
              const s = getComputedStyle(h.shadowRoot.querySelector(".badge"));
              return {
                variant: h.variant,
                pair: [rgb(s.color), rgb(s.backgroundColor)],
              };
            });
        });
      const lum = (rgb) =>
        rgb
          .map((n) => n / 255)
          .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
          .reduce((s, n, i) => s + n * [0.2126, 0.7152, 0.0722][i], 0);
      for (const { variant, pair } of pairs) {
        const [a, b] = pair.map(lum).sort((a, b) => a - b);
        assert.ok((b + 0.05) / (a + 0.05) >= 4.5, `custom ${variant} contrast`);
      }
      if (stage >= 2) {
        await page.setViewportSize({ width: 320, height: 400 });
        await page.goto(
          `${origin}/examples/pages/components/refinement.html#floating`,
        );
        for (const size of ["large", "extra"]) {
          await page.evaluate(async (size) => {
            const h = document.querySelector("#refined-dialog");
            h.size = size;
            h.open = true;
            await h.updateComplete;
          }, size);
          const bounds = await page
            .locator("#refined-dialog .container")
            .boundingBox();
          assert.ok(
            bounds.x >= 0 &&
              bounds.x + bounds.width <= 321 &&
              bounds.y >= 0 &&
              bounds.y + bounds.height <= 401,
            JSON.stringify(bounds),
          );
          await page.keyboard.press("Escape");
        }
        await page.evaluate(async () => {
          const d = document.querySelector("#refined-dialog");
          d.size = "large";
          d.style.setProperty("--zone-dialog-width", "290px");
          d.style.setProperty(
            "--zone-dialog-title-font",
            "500 19px/1.5 system-ui",
          );
          d.open = true;
          await d.updateComplete;
        });
        assert.equal(
          await page
            .locator("#refined-dialog .dialog-title")
            .evaluate((e) => getComputedStyle(e).fontSize),
          "19px",
        );
        assert.equal(
          Math.round(
            (await page.locator("#refined-dialog .container").boundingBox())
              .width,
          ),
          290,
        );
        await page.keyboard.press("Escape");
      }
      if (stage >= 3) {
        for (const theme of ["v1", "v2", "v3"])
          for (const width of [375, 820]) {
            const context = await browser.newContext({
              hasTouch: true,
              isMobile: true,
              viewport: { width, height: 950 },
              reducedMotion: "reduce",
            });
            const touch = await context.newPage();
            await touch.goto(
              `${origin}/examples/pages/components/refinement.html?theme=${theme}#notifications`,
            );
            await touch.waitForFunction(
              () =>
                document.querySelector(
                  '#long-toast > zone-button[slot="action-secondary"]',
                )?.variant === "secondary",
            );
            for (const sel of [
              "#refined-dropdown .trigger",
              "#refined-filter .trigger",
              '#long-toast > zone-button[slot="action"] .button',
              '#long-toast > zone-button[slot="action-secondary"] .button',
              '#composition-form zone-button[type="submit"] .button',
            ]) {
              assert.ok(
                (await touch.locator(sel).boundingBox()).height >= 44,
                `touch ${sel}`,
              );
            }
            await touch.locator("#refined-filter .trigger").tap();
            assert.ok(
              (
                await touch
                  .locator("#refined-filter .option")
                  .first()
                  .boundingBox()
              ).height >= 44,
            );
            await touch.locator("#refined-filter .option").first().tap();
            await touch.locator("#refined-filter .confirm").tap();
            assert.ok(
              (await touch
                .locator("#refined-filter")
                .evaluate((h) => h.value.length)) > 0,
            );
            await context.close();
          }
        await page.goto(`${origin}/examples/pages/components/refinement.html`);
        const late = await page.evaluate(async () => {
          const host = document.createElement("late-action-toast");
          host.innerHTML =
            '<zone-button slot="action">Primary</zone-button><zone-button slot="action-secondary">Secondary</zone-button>';
          document.querySelector("main").append(host);
          await Promise.all([...host.children].map((h) => h.updateComplete));
          customElements.define(
            "late-action-toast",
            class extends customElements.get("zone-toast") {},
          );
          await host.updateComplete;
          await new Promise((r) => setTimeout(r, 0));
          await Promise.all([...host.children].map((h) => h.updateComplete));
          const result = [...host.children].map((h) => [h.variant, h.size]);
          host.remove();
          return result;
        });
        assert.deepEqual(late, [
          ["primary", "medium"],
          ["secondary", "medium"],
        ]);
      }
      if (stage >= 3) {
        await page.goto(`${origin}/examples/pages/components/refinement.html`);
        await page.locator("#refined-filter").evaluate(async (h) => {
          h.style.setProperty("--zone-filter-select-font-size", "19px");
          h.style.setProperty("--zone-filter-select-panel-width", "210px");
          h.open = true;
          await h.updateComplete;
        });
        await page
          .locator("#refined-filter .panel")
          .waitFor({ state: "visible" });
        assert.equal(
          await page
            .locator("#refined-filter .option__label")
            .first()
            .evaluate((e) => getComputedStyle(e).fontSize),
          "19px",
        );
        assert.equal(
          Math.round(
            (await page.locator("#refined-filter .panel").boundingBox()).width,
          ),
          210,
        );
        await page
          .locator("#refined-filter")
          .evaluate((h) =>
            h.style.setProperty(
              "--zone-filter-select-option-font-size",
              "15px",
            ),
          );
        assert.equal(
          await page
            .locator("#refined-filter .option__label")
            .first()
            .evaluate((e) => getComputedStyle(e).fontSize),
          "15px",
        );
        assert.equal(
          await page
            .locator("#refined-filter .trigger")
            .evaluate((e) => getComputedStyle(e).fontSize),
          "19px",
        );
      }
      await page.close();
    },
  );
  assert.deepEqual(errors, []);
  console.log(
    `Stage ${stage}: ${results.length} theme/mode/viewport cases; local colors, semantic palettes, custom contrast and action defaults passed.`,
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "verification.json"),
    JSON.stringify({ results, errors }, null, 2),
  );
}
