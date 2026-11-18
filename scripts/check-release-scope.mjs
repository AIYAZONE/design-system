import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const allowed = new Set(['@aiyazone/design-system', '@aiyazone/tokens']);
const directories = ['.', ...['packages', 'apps', 'tooling'].flatMap(parent =>
  fs.readdirSync(path.join(root, parent), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(root, parent, entry.name, 'package.json')))
    .map(entry => `${parent}/${entry.name}`))];
const manifests = directories.map(directory =>
  JSON.parse(fs.readFileSync(path.join(root, directory, 'package.json'), 'utf8')));
const publicPackages = manifests.filter(manifest => !manifest.private);
assert.deepEqual(publicPackages.map(manifest => manifest.name).sort(), [...allowed].sort(),
  '仅总包和 tokens 可以公开发布，其他工作区包必须 private:true');
const workspaceNames = new Set(manifests.map(manifest => manifest.name));
for (const manifest of publicPackages) {
  assert.equal(manifest.publishConfig?.access, 'public', `${manifest.name} 必须公开可安装`);
  for (const section of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    for (const [name, range] of Object.entries(manifest[section] ?? {})) {
      assert.ok(!/^(workspace|file|link):/.test(range), `${manifest.name} ${name} 不得依赖工作区路径`);
      assert.ok(!workspaceNames.has(name) || allowed.has(name), `${manifest.name} 不得依赖内部包 ${name}`);
    }
  }
}
const config = JSON.parse(fs.readFileSync(path.join(root, '.changeset/config.json'), 'utf8'));
assert.deepEqual(config.privatePackages, { version: false, tag: false }, '私有包不升版、不打标签');
assert.ok(manifests[0].workspaces.includes('.'), 'Changesets 必须识别根目录总包');
for (const file of fs.readdirSync(path.join(root, '.changeset'))) {
  if (!file.endsWith('.md') || file === 'README.md') continue;
  const text = fs.readFileSync(path.join(root, '.changeset', file), 'utf8');
  const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(header, `${file} 缺少 Changeset 版本声明`);
  for (const line of header[1].split(/\r?\n/).filter(line => line.trim())) {
    const release = line.match(/^\s*["']?(@[^"':\s]+)["']?\s*:\s*(patch|minor|major)\s*$/);
    assert.ok(release && allowed.has(release[1]), `${file} 只能声明总包或 tokens 的版本变更`);
  }
}
console.log('发布范围检查通过：design-system / tokens；四基础包及其他工作区包私有。');
