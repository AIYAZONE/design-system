import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const repository = { type: 'git', url: 'https://github.com/AIYAZONE/design-system.git' };
function check(overrides = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'zds-release-scope-'));
  try {
    for (const name of ['scripts', 'packages/tokens', 'apps', 'tooling', '.changeset']) {
      fs.mkdirSync(path.join(directory, name), { recursive: true });
    }
    const write = (file, value) => fs.writeFileSync(path.join(directory, file), JSON.stringify(value));
    write('package.json', { name: '@aiyazone/design-system', repository, publishConfig: { access: 'public' }, workspaces: ['.'], ...overrides.root });
    write('packages/tokens/package.json', { name: '@aiyazone/tokens', repository, publishConfig: { access: 'public' }, ...overrides.tokens });
    write('.changeset/config.json', { privatePackages: { version: false, tag: false } });
    fs.copyFileSync(new URL('./check-release-scope.mjs', import.meta.url), path.join(directory, 'scripts/check-release-scope.mjs'));
    return spawnSync(process.execPath, ['scripts/check-release-scope.mjs'], { cwd: directory, encoding: 'utf8' });
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test('公开两包的 GitHub 仓库元数据可用于 provenance', () => {
  assert.equal(check().status, 0);
});
test('任一公开包缺失仓库地址时拒绝发布', () => {
  for (const name of ['root', 'tokens']) {
    const result = check({ [name]: { repository: undefined } });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /repository/);
  }
});
test('错误仓库地址时拒绝发布', () => {
  const result = check({ tokens: { repository: { type: 'git', url: 'https://github.com/other/repo.git' } } });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /repository/);
});
