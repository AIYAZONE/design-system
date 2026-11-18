import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(path.join(root, 'apps/storybook/package.json'));
export const { chromium } = require('playwright-core');

export async function withStaticServer(directory, check) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = http.createServer((request, response) => {
    const filename = path.resolve(directory, '.' + new URL(request.url, 'http://localhost').pathname);
    if (!filename.startsWith(directory + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.setHeader('Content-Type', `${types[path.extname(filename)] ?? 'application/octet-stream'}; charset=utf-8`);
    fs.createReadStream(filename).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  try {
    return await check(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}

export async function checkConsumerBrowser(directory, scenarios, diagnostics) {
  fs.mkdirSync(diagnostics, { recursive: true });
  const results = [];
  let browser;
  let current;
  let page;
  const errors = [];
  try {
    browser = await chromium.launch({ headless: true });
    await withStaticServer(path.join(directory, 'dist'), async origin => {
      for (const scenario of scenarios) {
        for (const width of [1440, 768, 390]) {
          current = { scenario, width };
          page = await browser.newPage({ viewport: { width, height: 900 } });
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => {
            if (message.type() === 'error') errors.push(message.text());
          });
          await page.goto(`${origin}/${scenario}.html`);
          await page.waitForFunction(() => window.consumerReady);
          assert.ok(await page.evaluate(() => ['zone-button', 'zone-icon', 'zone-i18n'].every(tag => document.createElement(tag) instanceof window.consumerLit)), '组件必须共享消费者 Lit');
          await page.locator('#dynamic-icon svg').waitFor();
          await page.getByRole('button', { name: '验证按钮', exact: true }).click();
          assert.equal(await page.evaluate(() => window.buttonClicks), 1);
          await page.getByRole('button', { name: '验证按钮', exact: true }).focus();
          await page.keyboard.press('Enter');
          assert.equal(await page.evaluate(() => window.buttonClicks), 2, '一次按键只能触发一次点击');
          assert.notEqual(await page.locator('#action button').evaluate(el => getComputedStyle(el).outlineStyle), 'none', '键盘焦点必须可见');
          assert.equal(await page.locator('[data-i18n-key]').textContent(), await page.evaluate(() => window.translations.en));
          await page.locator('#language').click();
          await page.waitForFunction(() => document.querySelector('[data-i18n-key]').textContent === window.translations.ja);
          await page.getByRole('button', { name: '保存中', exact: true }).waitFor();
          assert.equal(await page.locator('#loading button').getAttribute('aria-busy'), 'true');

          await page.getByRole('button', { name: '打开弹窗', exact: true }).click();
          await page.waitForFunction(() => document.activeElement?.id === 'first');
          await page.keyboard.press('Tab');
          assert.ok(await page.locator('#last button').evaluate(el => el.getRootNode().activeElement === el), 'Tab 必须进入插槽 Shadow 按钮');
          await page.keyboard.press('Tab');
          assert.ok(await page.locator('button[part="dialog-close"]').evaluate(el => el.getRootNode().activeElement === el), 'Tab 必须循环至关闭按钮');
          await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(() => document.activeElement.id), 'first');
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Enter');
          await page.waitForFunction(() => !document.querySelector('zone-dialog').open);
          assert.ok(await page.locator('#open-dialog button').evaluate(el => el.getRootNode().activeElement === el), '关闭后必须恢复触发按钮的内部焦点');
          await page.getByRole('button', { name: '打开弹窗', exact: true }).click();
          await page.waitForFunction(() => document.activeElement?.id === 'first');
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => !document.querySelector('zone-dialog').open);
          await page.getByRole('combobox', { name: '选择项目' }).focus();
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
          assert.equal(await page.evaluate(() => document.querySelector('zone-dropdown').value), 'leaf');
          assert.equal(await page.evaluate(() => window.dropdownValue), 'leaf', '下拉必须派发真实选择事件');

          await page.addScriptTag({ path: path.join(root, 'node_modules/axe-core/axe.min.js') });
          await page.locator('[part="dialog-polyfill"]').waitFor({ state: 'hidden' });
          for (const theme of ['v1', 'v2', 'v3']) {
            await page.evaluate(theme => {
              document.querySelector('#theme').href = window.themes[theme];
            }, theme);
            await page.waitForFunction(theme => document.querySelector('#theme').sheet?.href?.endsWith(window.themes[theme]), theme);
            const violations = await page.evaluate(async () => (await axe.run(document.body)).violations);
            assert.deepEqual(violations, [], `${theme} 消费者必须没有 axe 违规`);
            await page.getByRole('button', { name: '打开弹窗', exact: true }).click();
            await page.waitForFunction(() => document.activeElement?.id === 'first');
            await page.waitForFunction(() => getComputedStyle(document.querySelector('zone-dialog').shadowRoot.querySelector('[part="dialog-polyfill"]')).opacity === '1');
            const dialogViolations = await page.evaluate(async () => (await axe.run(document.querySelector('zone-dialog'))).violations);
            assert.deepEqual(dialogViolations, [], `${theme} 打开弹窗必须没有 axe 违规`);
            await page.keyboard.press('Escape');
            await page.waitForFunction(() => !document.querySelector('zone-dialog').open);
            await page.locator('[part="dialog-polyfill"]').waitFor({ state: 'hidden' });
          }
          await page.evaluate(async () => {
            const dialog = document.querySelector('zone-dialog');
            dialog.noClose = true;
            dialog.querySelector('#first').disabled = true;
            dialog.querySelector('#last').disabled = true;
            dialog.initialFocus = undefined;
            dialog.open = true;
            await dialog.updateComplete;
          });
          await page.waitForFunction(() => {
            const dialog = document.querySelector('zone-dialog');
            return dialog.shadowRoot.activeElement?.matches('[part="dialog-container"]');
          });
          await page.keyboard.press('Tab');
          assert.ok(await page.locator('[part="dialog-container"]').evaluate(el => el.getRootNode().activeElement === el), '无可用控件时焦点必须留在弹窗容器');
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => !document.querySelector('zone-dialog').open);
          await page.locator('[part="dialog-polyfill"]').waitFor({ state: 'hidden' });
          await page.evaluate(() => document.documentElement.style.setProperty('--zone-custom-color-primary', '#245BC0'));
          assert.equal(await page.locator('#action button').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(36, 91, 192)', '主题覆盖必须生效');
          assert.equal(errors.length, 0, '生产页面不能出现浏览器错误');
          await page.screenshot({ path: path.join(diagnostics, `${scenario}-${width}.png`), fullPage: true });
          results.push({ ...current, themes: ['v1', 'v2', 'v3'], passed: true });
          await page.close();
          page = undefined;
        }
      }
    });
    console.log(`独立 tarball 浏览器：${results.length} 组交互、三主题对比度通过。`);
  } catch (error) {
    let state;
    if (page && !page.isClosed()) {
      state = await page.evaluate(() => {
        const dialog = document.querySelector('zone-dialog');
        const active = document.activeElement;
        return {
          active: active?.outerHTML,
          shadowActive: active?.shadowRoot?.activeElement?.outerHTML,
          dialog: dialog && { open: dialog.open, initialFocus: dialog.initialFocus },
        };
      }).catch(() => undefined);
      await page.screenshot({ path: path.join(diagnostics, 'failure.png'), fullPage: true }).catch(() => {});
    }
    fs.writeFileSync(path.join(diagnostics, 'failure.json'), JSON.stringify({
      current, message: error.message, stack: error.stack, errors, results, state,
    }, null, 2) + '\n');
    throw error;
  } finally {
    await browser?.close();
    fs.writeFileSync(path.join(diagnostics, 'browser-results.json'), JSON.stringify({ results, errors }, null, 2) + '\n');
  }
}
