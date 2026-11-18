import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const packages = ['.', 'packages/core', 'packages/icons', 'packages/i18n', 'packages/utils'];
const runtimeMarker = /\b(?:litHtmlVersions|litElementVersions|reactiveElementVersions)\b/;
let checked = 0;
for (const directory of packages) {
  const dist = path.join(root, directory, 'dist');
  const files = fs.globSync('**/*.{js,cjs}', { cwd: dist }).filter(file => !file.startsWith('cdn/'));
  assert.ok(files.length, `${directory} 必须有 npm 构建产物`);
  for (const file of files) {
    assert.ok(!runtimeMarker.test(fs.readFileSync(path.join(dist, file), 'utf8')),
      `${directory}/dist/${file} 不得内嵌 Lit 运行时`);
    checked++;
  }
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.equal(manifest.exports['./cdn']?.import, './dist/cdn/index.js', 'CDN 必须有明确入口');
const cdn = fs.readFileSync(path.join(root, manifest.exports['./cdn'].import), 'utf8');
assert.ok(runtimeMarker.test(cdn), 'CDN 入口必须包含 Lit 运行时');
assert.ok(!/\b(?:from\s*|import\s*\()\s*["'](?:lit|@lit\/)/.test(cdn), 'CDN 不得要求浏览器解析 Lit 裸导入');
console.log(`Lit 产物检查通过：${checked} 个 npm JS 文件无内嵌运行时，CDN 有独立自包含入口。`);
