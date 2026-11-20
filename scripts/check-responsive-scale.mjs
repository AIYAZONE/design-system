import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium, withStaticServer } from "./check-consumer-browser.mjs";
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "output/responsive-docs-20261120");
fs.mkdirSync(output, { recursive: true });
const rows = [];
const browser = await chromium.launch({ headless: true });
try {
  await withStaticServer(
    path.join(root, "apps/portal/dist"),
    async (origin) => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      for (const theme of ["v1", "v2", "v3"])
        for (const width of [
          320, 375, 414, 600, 768, 820, 900, 1023, 1024, 1280, 1440,
        ]) {
          await page.setViewportSize({ width, height: 1000 });
          await page.goto(
            `${origin}/examples/pages/components/refinement.html?theme=${theme}`,
          );
          await page.waitForFunction(
            () =>
              document.querySelector("#refined-dropdown")?.options.length > 1,
          );
          await page.evaluate(async () => {
            await document.fonts.ready;
          });
          const row = await page.evaluate(
            ({ theme, width }) => {
              const button = document
                .querySelector("zone-button")
                .shadowRoot.querySelector("button");
              const f = document
                .querySelector("#refined-filter")
                .shadowRoot.querySelector(".trigger");
              const toast = document
                .querySelector("#long-toast")
                .shadowRoot.querySelector(".description");
              const cb = document
                .querySelector("#mixed-checkbox")
                .shadowRoot.querySelector(".label");
              return {
                theme,
                width,
                root: parseFloat(
                  getComputedStyle(document.documentElement).fontSize,
                ),
                button: parseFloat(getComputedStyle(button).fontSize),
                height: button.getBoundingClientRect().height,
                filter: parseFloat(getComputedStyle(f).fontSize),
                toast: parseFloat(getComputedStyle(toast).fontSize),
                checkbox: parseFloat(getComputedStyle(cb).fontSize),
                scrollWidth: document.documentElement.scrollWidth,
              };
            },
            { theme, width },
          );
          assert.ok(row.root >= 16 && row.root <= 18, JSON.stringify(row));
          assert.ok(row.button >= 12 && row.button <= 22, JSON.stringify(row));
          assert.ok(row.height >= 36 && row.height <= 56, JSON.stringify(row));
          assert.ok(row.filter >= 14 && row.filter <= 18, JSON.stringify(row));
          assert.ok(
            row.checkbox >= 14 && row.checkbox <= 18,
            JSON.stringify(row),
          );
          assert.ok(row.toast >= 12 && row.toast <= 20, JSON.stringify(row));
          assert.ok(row.scrollWidth <= width + 1, JSON.stringify(row));
          rows.push(row);
          if (theme === "v1" && [768, 1023, 1024].includes(width))
            await page.screenshot({
              path: path.join(output, `after-${width}.png`),
            });
        }
      for (const theme of ["v1", "v2", "v3"]) {
        const left = rows.find((r) => r.theme === theme && r.width === 1023),
          right = rows.find((r) => r.theme === theme && r.width === 1024);
        assert.ok(
          Math.abs(left.button - right.button) <= 4,
          `${theme}: typography jump`,
        );
        assert.ok(
          Math.abs(left.height - right.height) <= 8,
          `${theme}: control size jump`,
        );
      }
      console.log(
        `${rows.length} responsive combinations passed; 1024px boundary verified.`,
      );
    },
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(output, "responsive.json"),
    JSON.stringify(rows, null, 2),
  );
}
