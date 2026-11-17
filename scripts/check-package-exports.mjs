import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const packages = process.argv.slice(2);
if (!packages.length) packages.push('.', 'packages/core', 'packages/utils', 'packages/i18n', 'packages/icons', 'packages/tokens');

let checked = 0;
const failures = [];
for (const directory of packages) {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  const check = (target, label) => {
    if (typeof target === 'object' && target !== null) {
      for (const [condition, value] of Object.entries(target)) check(value, `${label}/${condition}`);
      return;
    }
    try {
      assert.equal(typeof target, 'string', `${label} 必须是文件路径`);
      const matches = target.includes('*') ? fs.globSync(target, { cwd: directory }) : [target];
      assert.ok(matches.length, `${label} 必须匹配产物`);
      for (const match of matches) assert.ok(fs.statSync(path.resolve(directory, match)).isFile(), `${label} 必须指向文件`);
      checked++;
    } catch {
      failures.push(`${manifest.name} ${label}: ${target}`);
    }
  };
  for (const key of ['main', 'module', 'types']) if (manifest[key]) check(manifest[key], key);
  for (const [key, value] of Object.entries(manifest.exports ?? {})) check(value, `exports ${key}`);
}
assert.equal(failures.length, 0, `包声明指向缺失产物：\n${failures.join('\n')}`);
console.log(`包接口检查通过：${packages.length} 个包，${checked} 个文件声明。`);
