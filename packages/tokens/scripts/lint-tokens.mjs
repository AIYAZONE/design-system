#!/usr/bin/env node
/**
 * Tokens 纪律 lint：组件 less 禁止新增裸 hex / 魔法色值（存量冻结在 hex-allowlist.json）。
 *
 * 用法：
 *   node scripts/lint-tokens.mjs           # 检查（CI / tokens:lint）
 *   node scripts/lint-tokens.mjs --update  # 重扫存量，更新白名单（确认后提交）
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PKG_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PKG_DIR, '../..');
const ALLOWLIST = path.join(PKG_DIR, 'hex-allowlist.json');
const SCAN_ROOTS = ['packages/core/src/components'];
const HEX_RE = /#[0-9A-Fa-f]{3,8}\b/g;

function scan() {
  const out = [];
  const files = execSync(`git ls-files "${SCAN_ROOTS.map((r) => `${r}/*.less`).join('" "')}"`, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
  for (const rel of files) {
    const abs = path.join(REPO_ROOT, rel);
    fs.readFileSync(abs, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '') // 去块注释
      .split('\n')
      .forEach((line, i) => {
        const code = line.replace(/\/\/.*$/, ''); // 去行注释
        for (const m of code.matchAll(HEX_RE)) {
          out.push(`${rel}:${i + 1}::${code.trim().replace(/\s+/g, ' ')}::${m[0].toUpperCase()}`);
        }
      });
  }
  return out;
}

const update = process.argv.includes('--update');
const found = scan();

if (update) {
  fs.writeFileSync(ALLOWLIST, JSON.stringify([...new Set(found)].sort(), null, 2) + '\n');
  console.log(`allowlist updated: ${new Set(found).size} 处存量（提交后生效）`);
  process.exit(0);
}

const known = new Set(JSON.parse(fs.readFileSync(ALLOWLIST, 'utf8')));
const violations = found.filter((f) => {
  const key = f.split('::').slice(0, 3).join('::');
  return !known.has(key);
});
if (violations.length === 0) {
  console.log(`✓ tokens lint 通过（存量冻结 ${known.size} 处，无新增裸 hex）`);
  process.exit(0);
}
console.error(`✗ 发现 ${violations.length} 处新增裸 hex，请改用 var(--zone-*) 令牌：`);
for (const v of violations.slice(0, 20)) console.error('  ' + v);
process.exit(1);
