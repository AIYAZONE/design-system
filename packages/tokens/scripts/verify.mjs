#!/usr/bin/env node
/**
 * Tokens 真源化验证：编译产物 diff = 0
 *
 * old = 基线（packages/tokens/baseline 保存的手写原版）
 * new = 当前 src/styles（generated-tokens.less 生成版）
 * 对 v1 / v3 两个主题分别用 lessc 编译并逐行比对，输出不同则为失败。
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PKG_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PKG_DIR, '../..');
const LESSC = path.join(PKG_DIR, 'node_modules/.bin/lessc');
const WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'zds-tokens-verify-'));

function copyStyles(dest) {
  fs.cpSync(path.join(REPO_ROOT, 'src/styles'), dest, { recursive: true });
}
function normalize(css) {
  return css
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l !== '' && !l.trim().startsWith('/*') && !l.trim().startsWith('*'))
    .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
    .join('\n');
}
function compile(shadowRoot, entry) {
  const out = path.join(shadowRoot, 'out.css');
  const r = spawnSync(LESSC, [entry, out], { stdio: 'pipe', encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`lessc 编译失败 (${entry}):\n${r.stderr}`);
  return normalize(fs.readFileSync(out, 'utf8'));
}

const results = [];
for (const theme of ['v3', 'v1', 'v2']) {
  const oldRoot = path.join(WORK, theme, 'old');
  const newRoot = path.join(WORK, theme, 'new');
  copyStyles(path.join(oldRoot, 'src/styles'));
  copyStyles(path.join(newRoot, 'src/styles'));
  // old 用基线手写版覆盖两个被生成替代的文件
  fs.copyFileSync(
    path.join(PKG_DIR, 'baseline/tokens.base.less'),
    path.join(oldRoot, 'src/styles/zone/tokens.base.less'),
  );
  fs.copyFileSync(
    path.join(PKG_DIR, 'baseline/v3-tokens.less'),
    path.join(oldRoot, 'src/styles/themes/v3/tokens.less'),
  );

  let oldCss, newCss;
  try {
    oldCss = compile(oldRoot, path.join(oldRoot, `src/styles/themes/${theme}/index.less`));
    newCss = compile(newRoot, path.join(newRoot, `src/styles/themes/${theme}/index.less`));
  } catch (e) {
    console.error(`✗ [${theme}] ${e.message}`);
    process.exit(1);
  }
  if (oldCss === newCss) {
    console.log(`✓ [${theme}] 编译产物 diff = 0（${oldCss.split('\n').length} 行）`);
    results.push(0);
  } else {
    console.error(`✗ [${theme}] 编译产物存在差异：`);
    const oldL = oldCss.split('\n');
    const newL = newCss.split('\n');
    let shown = 0;
    for (let i = 0; i < Math.max(oldL.length, newL.length) && shown < 12; i++) {
      if (oldL[i] !== newL[i]) {
        console.error(`  行 ${i + 1}:\n    old: ${oldL[i]}\n    new: ${newL[i]}`);
        shown++;
      }
    }
    results.push(1);
  }
}
fs.rmSync(WORK, { recursive: true, force: true });
process.exit(results.some((r) => r !== 0) ? 1 : 0);
