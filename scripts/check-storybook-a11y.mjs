import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium, withStaticServer } from './check-consumer-browser.mjs';

const root = path.resolve(import.meta.dirname, '..');
const directory = path.join(root, 'apps/storybook/storybook-static');
const output = path.resolve(process.argv.slice(2).filter(argument => argument !== '--')[0] ?? path.join(root, 'output/storybook-a11y'));
fs.mkdirSync(output, { recursive: true });
const stories = Object.values(JSON.parse(fs.readFileSync(path.join(directory, 'index.json'), 'utf8')).entries).filter(entry => entry.type === 'story');
const results = [];
let browser;
let page;
let current;
try {
  browser = await chromium.launch({ headless: true });
  await withStaticServer(directory, async origin => {
    page = await browser.newPage();
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const story of stories) {
        current = { id: story.id, width };
        await page.goto(`${origin}/iframe.html?id=${story.id}&viewMode=story`);
        await page.waitForFunction(() => document.querySelector('#storybook-root')?.children.length > 0);
        await page.waitForLoadState('networkidle');
        await page.addScriptTag({ path: path.join(root, 'node_modules/axe-core/axe.min.js') });
        const report = await page.evaluate(async () => {
          axe.reset();
          // 与 addon-a11y 的既有默认范围一致；只禁用文档画布已有的 region 规则。
          axe.configure({ rules: [{ id: 'region', enabled: false }] });
          const { violations, incomplete } = await axe.run({
            include: document.body,
            exclude: ['.sb-wrapper', '#storybook-docs', '#storybook-highlights-root'],
          });
          return { violations, incomplete };
        });
        results.push({ ...current, ...report });
        if (report.violations.length) {
          await page.screenshot({ path: path.join(output, `${story.id}-${width}.png`), fullPage: true });
        }
        console.log(`${story.id} / ${width}: ${report.violations.map(v => v.id).join(', ') || '通过'}`);
      }
    }
  });
  assert.equal(results.filter(result => result.violations.length).length, 0, 'Storybook 不允许新增或保留已复现的 axe 违规');
} catch (error) {
  fs.writeFileSync(path.join(output, 'failure.json'), JSON.stringify({ current, message: error.message, stack: error.stack }, null, 2) + '\n');
  throw error;
} finally {
  await browser?.close();
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
}
