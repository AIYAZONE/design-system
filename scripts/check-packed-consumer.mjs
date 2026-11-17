import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'zds-consumer-'));
const directories = ['.', 'packages/core', 'packages/utils', 'packages/i18n', 'packages/icons', 'packages/tokens'];
const dependencies = {};
const run = (command, args, cwd = temporary) => execFileSync(command, args, { cwd, stdio: 'inherit' });

console.log(`独立消费者：${temporary}`);
for (const directory of directories) {
  const cwd = path.join(root, directory);
  const manifest = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  const tarball = path.join(temporary, `${manifest.name.replaceAll('/', '-').replace('@', '')}.tgz`);
  execFileSync('pnpm', ['pack', '--out', tarball], { cwd, stdio: 'pipe' });
  console.log(`已打包 ${manifest.name}@${manifest.version}`);
  dependencies[manifest.name] = `file:${tarball}`;
}
fs.writeFileSync(path.join(temporary, 'package.json'), JSON.stringify({
  private: true, type: 'module', dependencies,
  devDependencies: { lit: '^3.3.1', typescript: '~5.8.3', jsdom: '^27.4.0', vite: '^7.2.2' }
}, null, 2));
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--loglevel=error']);
run('node', [path.join(root, 'scripts/check-package-exports.mjs'), ...Object.keys(dependencies).map(name => `node_modules/${name}`)]);

const components = ['button', 'checkbox', 'badge', 'dialog', 'dropdown', 'filter-select', 'popover', 'spinner', 'toast', 'tooltip'];
const imports = ['@aiyazone/core', ...components.map(name => `@aiyazone/core/${name}`), '@aiyazone/utils', ...['common', 'elements', 'event', 'form-control'].map(name => `@aiyazone/utils/${name}`), '@aiyazone/i18n', '@aiyazone/icons'];
const setup = `
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const dom = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost/' });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'ShadowRoot', 'Document', 'CSSStyleSheet', 'customElements', 'MutationObserver', 'Node', 'NodeFilter', 'CustomEvent', 'Event', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLFormElement']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
}
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
let languageListeners = 0;
const addListener = dom.window.addEventListener.bind(dom.window);
dom.window.addEventListener = (name, ...args) => {
  if (name === 'i18n-language-change') languageListeners++;
  return addListener(name, ...args);
};
`;
for (const mode of ['esm', 'cjs', 'bundle-esm', 'bundle-cjs', 'mixed', 'mixed-reverse']) {
  const useRequire = mode.endsWith('cjs');
  const scenarioImports = mode.startsWith('bundle') ? ['@aiyazone/design-system'] : mode === 'mixed' ? ['@aiyazone/design-system', ...imports] : mode === 'mixed-reverse' ? [...imports, '@aiyazone/design-system'] : imports;
  const source = setup + `
const imports = ${JSON.stringify(scenarioImports)};
for (const name of imports) {
  const module = ${useRequire ? 'require(name)' : 'await import(name)'};
  assert.ok(Object.keys(module).length, name);
}
const button = document.createElement('zone-button');
document.body.append(button);
await button.updateComplete;
assert.ok(button.shadowRoot?.querySelector('button'), '按钮必须真实渲染');
const icon = document.createElement('zone-icon');
icon.name = 'plus';
document.body.append(icon);
await icon.load();
await icon.updateComplete;
assert.ok(icon.shadowRoot?.querySelector('svg'), '动态图标必须从打包产物真实加载');
assert.ok(customElements.get('zone-dropdown'), '下拉组件必须注册');
const { ZoneButton } = ${useRequire ? 'require' : 'await import'}('${mode.startsWith('bundle') ? '@aiyazone/design-system' : '@aiyazone/core/button'}');
assert.equal(customElements.get('zone-button'), ZoneButton, '导出类必须与已注册构造器一致');
const languageModule = ${useRequire ? 'require' : 'await import'}('${mode.startsWith('bundle') ? '@aiyazone/design-system' : '@aiyazone/i18n'}');
const listenerCount = languageListeners;
languageModule.initialize();
languageModule.initialize();
assert.equal(languageListeners, listenerCount, '重复初始化不得新增语言监听');
assert.equal(languageModule.initI18nDom(), languageModule.initI18nDom(), '重复初始化必须复用 DOM 观察器');
const disconnect = languageModule.initI18nDom();
disconnect();
const reconnect = languageModule.initI18nDom();
assert.notEqual(reconnect, disconnect, '清理后必须创建可用的 DOM 观察器');
const translated = document.createElement('span');
translated.setAttribute('data-i18n-key', 'common.submit');
document.body.append(translated);
await new Promise(resolve => setTimeout(resolve, 0));
assert.notEqual(languageModule.t('common.submit'), 'common.submit', '必须使用实际翻译键');
assert.equal(translated.textContent, languageModule.t('common.submit'), '重新初始化后必须翻译新增节点');
if ('${mode}'.startsWith('mixed')) {
  const bundle = await import('@aiyazone/design-system');
  const i18n = await import('@aiyazone/i18n');
  bundle.setCurrLanguage('ja');
  assert.equal(i18n.getCurrLanguage(), 'ja', '总包切换语言后，基础包必须同步');
  i18n.setCurrLanguage('en');
  assert.equal(bundle.getCurrLanguage(), 'en', '基础包切换语言后，总包必须同步');
}
dom.window.close();
console.log('${mode} 导入、子路径与组件注册通过');
`;
  const filename = path.join(temporary, `${mode}.mjs`);
  fs.writeFileSync(filename, source);
  run('node', [filename]);
}
fs.writeFileSync(path.join(temporary, 'consumer.ts'), `
import { ZoneButton } from '@aiyazone/core/button';
import { ZoneDropdown } from '@aiyazone/core/dropdown';
import { ZoneBaseElement, ZoneButton as MainButton } from '@aiyazone/core';
import { ZoneButton as BundledButton } from '@aiyazone/design-system';
import { submit } from '@aiyazone/utils';
import '@aiyazone/core/styles';
import '@aiyazone/design-system/index.css';
const values: Array<typeof ZoneButton | typeof ZoneDropdown | typeof ZoneBaseElement | typeof BundledButton> = [ZoneButton, ZoneDropdown, ZoneBaseElement, BundledButton];
const typedButton: MainButton = new ZoneButton();
document.createElement('zone-button').variant = 'primary';
submit(document.createElement('form'));
console.log(values, typedButton);
`);
for (const resolution of ['bundler', 'nodenext']) {
  run('node', ['node_modules/typescript/bin/tsc', '--noEmit', '--strict', '--skipLibCheck', 'false', '--target', 'es2022', '--module', resolution === 'bundler' ? 'esnext' : 'nodenext', '--moduleResolution', resolution, 'consumer.ts']);
}
fs.writeFileSync(path.join(temporary, 'index.html'), '<!doctype html><html><body><zone-button>验证按钮</zone-button><zone-icon name="plus"></zone-icon><span data-i18n-key="common.submit"></span><button id="language">日本語</button><script type="module" src="/consumer.js"></script></body></html>');
fs.writeFileSync(path.join(temporary, 'consumer.js'), `import '@aiyazone/core/button'; import '@aiyazone/core/dropdown'; import '@aiyazone/core/styles'; import '@aiyazone/icons'; import { setCurrLanguage } from '@aiyazone/i18n'; setCurrLanguage('en'); document.querySelector('#language').addEventListener('click', () => setCurrLanguage('ja'));`);
run('node', ['node_modules/vite/bin/vite.js', 'build']);
const assets = fs.readdirSync(path.join(temporary, 'dist/assets'));
assert.ok(assets.some(name => name.endsWith('.css')), '生产构建必须保留公共样式');
console.log('打包安装、ESM/CJS、类型和生产构建全部通过。');
