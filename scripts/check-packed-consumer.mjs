import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { checkConsumerBrowser } from './check-consumer-browser.mjs';

const root = path.resolve(import.meta.dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'zds-consumer-'));
const internal = process.argv.includes('--internal');
const directories = internal ? ['.', 'packages/core', 'packages/utils', 'packages/i18n', 'packages/icons', 'packages/tokens'] : ['.', 'packages/tokens'];
const dependencies = {};
const artifacts = [];
const run = (command, args, cwd = temporary) => execFileSync(command, args, { cwd, stdio: 'inherit' });

try {
console.log(`独立消费者：${temporary}`);
for (const directory of directories) {
  const cwd = path.join(root, directory);
  const manifest = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  const tarball = path.join(temporary, `${manifest.name.replaceAll('/', '-').replace('@', '')}.tgz`);
  execFileSync('pnpm', ['pack', '--out', tarball], { cwd, stdio: 'pipe' });
  console.log(`已打包 ${manifest.name}@${manifest.version}`);
  dependencies[manifest.name] = `file:${tarball}`;
  const packedManifest = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }));
  if (['@aiyazone/design-system', '@aiyazone/tokens'].includes(manifest.name)) {
    for (const name of ['@aiyazone/eslint-config', '@aiyazone/tsconfig']) {
      assert.ok(!(name in (packedManifest.devDependencies ?? {})), `${manifest.name} 发布产物不得包含内部开发依赖 ${name}`);
    }
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')), manifest,
      '打包不得改写仓库 package.json');
  }
  if (!internal) {
    for (const section of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [name, range] of Object.entries(packedManifest[section] ?? {})) {
        assert.ok(!/^@aiyazone\/(core|utils|icons|i18n)$/.test(name), `${name} 不能出现在公开包运行依赖中`);
        assert.ok(!/^(workspace|file|link):/.test(range), `${name} 必须能从 registry 安装`);
      }
    }
  }
  artifacts.push({
    name: manifest.name, version: manifest.version,
    tarball: path.basename(tarball),
    sha256: createHash('sha256').update(fs.readFileSync(tarball)).digest('hex'),
    files: execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).trim().split('\n').sort(),
    dependencies: packedManifest.dependencies ?? {}, peerDependencies: packedManifest.peerDependencies ?? {}
  });
  const packIndex = process.argv.indexOf('--pack-dir');
  if (packIndex !== -1) {
    assert.ok(process.argv[packIndex + 1], '--pack-dir 需要已有目录');
    fs.copyFileSync(tarball, path.join(path.resolve(process.argv[packIndex + 1]), path.basename(tarball)));
  }
}
fs.writeFileSync(path.join(temporary, 'package.json'), JSON.stringify({
  private: true, type: 'module', dependencies,
  devDependencies: { lit: '^3.3.1', typescript: '~5.8.3', jsdom: '^27.4.0', vite: '^7.2.2' }
}, null, 2));
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--loglevel=error']);
if (!internal) {
  for (const name of ['core', 'utils', 'i18n', 'icons']) {
    assert.ok(!fs.existsSync(path.join(temporary, 'node_modules/@aiyazone', name)), `公开消费者不得安装内部 ${name}`);
  }
}
const tokens = JSON.parse(fs.readFileSync(path.join(temporary, 'node_modules/@aiyazone/tokens/tokens.json'), 'utf8'));
assert.ok(Object.keys(tokens).length, '独立令牌包必须包含实际设计令牌');
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
for (const mode of internal ? ['esm', 'cjs', 'bundle-esm', 'bundle-cjs', 'mixed', 'mixed-reverse', 'mixed-cjs', 'mixed-reverse-cjs'] : ['bundle-esm', 'bundle-cjs']) {
  const useRequire = mode.endsWith('cjs');
  const scenarioImports = mode.startsWith('bundle') ? ['@aiyazone/design-system'] : mode.startsWith('mixed-reverse') ? [...imports, '@aiyazone/design-system'] : mode.startsWith('mixed') ? ['@aiyazone/design-system', ...imports] : imports;
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
const { LitElement } = ${useRequire ? 'require' : 'await import'}('lit');
assert.ok(button instanceof LitElement, 'npm 按钮必须共享消费者的 Lit');
const icon = document.createElement('zone-icon');
icon.name = 'plus';
document.body.append(icon);
await icon.load();
await icon.updateComplete;
assert.ok(icon.shadowRoot?.querySelector('svg'), '动态图标必须从打包产物真实加载');
assert.ok(icon instanceof LitElement, 'npm 图标必须共享消费者的 Lit');
assert.ok(document.createElement('zone-i18n') instanceof LitElement, 'npm 多语言组件必须共享消费者的 Lit');
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
  const bundle = ${useRequire ? 'require' : 'await import'}('@aiyazone/design-system');
  const i18n = ${useRequire ? 'require' : 'await import'}('@aiyazone/i18n');
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
fs.writeFileSync(path.join(temporary, 'consumer.ts'), internal ? `
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
` : `
import { ZoneButton, ZoneDropdown, ZoneBaseElement, setCurrLanguage, type DropdownOption } from '@aiyazone/design-system';
import '@aiyazone/design-system/index-v3.css';
const button: ZoneButton = new ZoneButton();
const base = new ZoneBaseElement();
const dropdown = new ZoneDropdown();
const options: DropdownOption[] = [{ label: '示例', value: 'example' }];
dropdown.options = options;
document.createElement('zone-button').variant = 'primary';
setCurrLanguage('ja');
console.log(button, base, dropdown);
`);
for (const resolution of ['bundler', 'nodenext']) {
  run('node', ['node_modules/typescript/bin/tsc', '--noEmit', '--strict', '--skipLibCheck', 'false', '--target', 'es2022', '--module', resolution === 'bundler' ? 'esnext' : 'nodenext', '--moduleResolution', resolution, 'consumer.ts']);
}
const browserImports = internal ? {
  core: ["@aiyazone/core", "@aiyazone/icons"],
  bundle: ["@aiyazone/design-system"],
  mixed: ["@aiyazone/design-system", "@aiyazone/core", "@aiyazone/icons"],
  reverse: ["@aiyazone/core", "@aiyazone/icons", "@aiyazone/design-system"]
} : { bundle: ['@aiyazone/design-system'] };
for (const [scenario, names] of Object.entries(browserImports)) {
  fs.writeFileSync(path.join(temporary, `${scenario}.html`), `<!doctype html><html lang="zh-CN"><head><title>ZDS 独立消费者</title><meta name="viewport" content="width=device-width, initial-scale=1"><link id="theme" rel="stylesheet"><style>body{padding:24px;display:flex;gap:16px;flex-direction:column;align-items:flex-start}zone-dropdown{width:min(320px,100%)}zone-dialog input{display:block}</style></head><body><main><h1>ZDS 独立消费者</h1><zone-button id="action">验证按钮</zone-button><zone-icon id="dynamic-icon" name="plus"></zone-icon><span data-i18n-key="common.submit"></span><button id="language">日本語</button><zone-button id="loading" loading>保存中</zone-button><zone-button id="open-dialog">打开弹窗</zone-button><zone-dialog caption="编辑内容" initialfocus="#first"><label for="first">名称</label><input id="first"><zone-button id="last">完成</zone-button></zone-dialog><zone-dropdown label="选择项目" placeholder="选择项目"></zone-dropdown></main><script type="module" src="/${scenario}.js"></script></body></html>`);
  fs.writeFileSync(path.join(temporary, `${scenario}.js`), `
${names.map(name => `import '${name}';`).join('\n')}
import v1 from '@aiyazone/design-system/index.css?url';
import v2 from '@aiyazone/design-system/index-v2.css?url';
import v3 from '@aiyazone/design-system/index-v3.css?url';
import { LitElement } from 'lit';
import { setCurrLanguage, t } from '${scenario === 'bundle' ? '@aiyazone/design-system' : '@aiyazone/i18n'}';
(async () => {
window.consumerLit = LitElement;
window.themes = {v1, v2, v3};
document.querySelector('#theme').href = v3;
window.buttonClicks = 0;
document.querySelector('#action').addEventListener('zone-click', () => window.buttonClicks++);
document.querySelector('#open-dialog').addEventListener('zone-click', () => document.querySelector('zone-dialog').open = true);
const dropdown = document.querySelector('zone-dropdown');
dropdown.options = [{label: '项目', value: 'parent', children: [{label: '子项目', value: 'leaf'}, {label: '禁用', value: 'disabled', disabled: true}]}];
dropdown.addEventListener('change', event => window.dropdownValue = event.detail.value);
setCurrLanguage('ja');
window.translations = {ja: t('common.submit')};
setCurrLanguage('en');
window.translations.en = t('common.submit');
document.querySelector('#language').addEventListener('click', () => setCurrLanguage('ja'));
await Promise.all([...document.querySelectorAll('zone-button, zone-dropdown, zone-dialog')].map(el => el.updateComplete));
await document.querySelector('#dynamic-icon').load();
window.consumerReady = true;
})();`);
}
fs.writeFileSync(path.join(temporary, 'vite.config.js'), `
import assert from 'node:assert/strict';
export default {
  build: { rollupOptions: { input: ${JSON.stringify(Object.fromEntries(Object.keys(browserImports).map(name => [name, path.join(temporary, `${name}.html`)])))} } },
  plugins: [{
    name: 'single-lit-consumer',
    generateBundle() {
      const runtimes = [...this.getModuleIds()].filter(id => /node_modules\\/@lit\\/reactive-element\\/reactive-element\\.js$/.test(id));
      assert.equal(runtimes.length, 1, '实际消费者构建只能包含一份 Lit ReactiveElement');
      console.log('实际消费者构建：一份 Lit ReactiveElement，${Object.keys(browserImports).length} 种接入页面。');
    }
  }]
};`);
run('node', ['node_modules/vite/bin/vite.js', 'build']);
const assets = fs.readdirSync(path.join(temporary, 'dist/assets'));
assert.ok(assets.some(name => name.endsWith('.css')), '生产构建必须保留公共样式');
console.log('打包安装、ESM/CJS、类型和生产构建全部通过。');
if (process.argv.includes('--browser')) {
  const diagnosticsIndex = process.argv.indexOf('--diagnostics');
  assert.ok(diagnosticsIndex === -1 || process.argv[diagnosticsIndex + 1], '--diagnostics 需要输出目录');
  const diagnostics = path.resolve(diagnosticsIndex === -1 ? path.join(root, 'output/consumer-browser') : process.argv[diagnosticsIndex + 1]);
  await checkConsumerBrowser(temporary, Object.keys(browserImports), diagnostics);
}
const recordIndex = process.argv.indexOf('--record');
if (recordIndex !== -1) {
  assert.ok(process.argv[recordIndex + 1], '--record 需要输出文件路径');
  fs.writeFileSync(path.resolve(process.argv[recordIndex + 1]), JSON.stringify({
    date: new Date().toISOString(), mode: internal ? 'internal' : 'public',
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    uncommitted: Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()),
    artifacts
  }, null, 2) + '\n');
}
} finally {
  if (process.argv.includes('--keep')) {
    console.log(`保留消费者目录：${temporary}`);
  } else {
    fs.rmSync(temporary, { recursive: true, force: true });
    console.log(`已清理消费者目录：${temporary}`);
  }
}
