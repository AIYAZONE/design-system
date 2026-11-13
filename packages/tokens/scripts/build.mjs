#!/usr/bin/env node
/**
 * ZDS 设计令牌生成器
 *
 * 真源：packages/tokens/tokens.json
 * 产出：
 *   1. src/styles/zone/generated-tokens.less        （基础变量段，供 tokens.base.less 引用）
 *   2. src/styles/themes/v3/generated-tokens.less   （v3 主题变量段 + 语义变量 + 字体组合）
 *   3. packages/tokens/dist/tokens.css              （静态全量令牌表，桌面端基准，供 CDN/npm）
 *   4. packages/tokens/dist/tokens.ts               （typed 常量，TS 侧消费）
 *
 * 规则：本脚本只输出数据，不承载样式逻辑；mixin / 断点骨架等逻辑保留在手写文件中。
 * 生成物禁止手改；变更请改 tokens.json 后重新执行 pnpm --filter @aiyazone/tokens run build。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PKG_DIR, '../..');
const T = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'tokens.json'), 'utf8'));

// ---------- 工具 ----------
const MIX_BASE = T.meta.colorMixBase; // mix() 的白色端（与 LESS mix() 第一参数一致）

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase()).join('');
}
/** 复刻 LESS mix(c1, c2, weight)：c1 占 weight%，线性插值后四舍五入 */
function lessMix(c1, c2, weightPercent) {
  const w = weightPercent / 100;
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex(a.map((v, i) => v * w + b[i] * (1 - w)));
}
function fmtRem(px) {
  const v = px / 16;
  const s = String(Number(v.toFixed(6)));
  return `${s}rem`;
}

// ---------- 1. 基础变量段（tokens.base.less 原第 3–23 行） ----------
function genBaseVars() {
  const L = [];
  L.push('/* 基础令牌变量（由 packages/tokens/tokens.json 生成——禁止手改） */');
  L.push('');
  for (const [k, v] of Object.entries(T.base.color)) L.push(`@zone-color-${k}: ${v};`);
  L.push('');
  for (const [k, v] of Object.entries(T.base.colorContrast)) L.push(`@zone-color-${k}-contrast: ${v};`);
  L.push('');
  for (const [k, v] of Object.entries(T.base.fontWeight)) L.push(`@zone-font-${k}: ${v};`);
  L.push('');
  return L.join('\n');
}

// ---------- 2. v3 主题段 ----------
function genV3() {
  const v3 = T.v3;
  const L = [];
  L.push('/* 主题 v3 令牌（由 packages/tokens/tokens.json 生成——禁止手改） */');
  L.push('');
  L.push('// 行高');
  L.push(`@zone-h-line-height: ${v3.lineHeight.h};`);
  L.push(`@zone-b-line-height: ${v3.lineHeight.b};`);
  L.push(`@zone-c-line-height: ${v3.lineHeight.c};`);
  L.push('');
  L.push('// 主题覆盖变量');
  for (const [k, val] of Object.entries(v3.colorOverride)) L.push(`@zone-color-${k}: ${val};`);
  for (const [k, val] of Object.entries(v3.colorContrastOverride)) {
    if (typeof val === 'string') L.push(`@zone-color-${k}-contrast: ${val};`);
    else L.push(`@zone-color-${k}-contrast: mix(${MIX_BASE}, @zone-color-${k}, ${val.$mixPercent}%);`);
  }
  L.push('');

  // @{rootSel} 主块
  L.push(`@{rootSel} {`);
  // 语义色
  for (const name of v3.semanticColorScale) {
    L.push(`  .generate-color-common(${name}, @zone-color-${name}, @zone-color-${name}-contrast);`);
  }
  L.push('');
  // 文本色
  for (const [k, v] of Object.entries(v3.text)) L.push(`  --zone-color-text-${k}: ${v};`);
  L.push('');
  // 图标色
  for (const [k, v] of Object.entries(v3.icon)) L.push(`  --zone-color-icon-${k}: ${v};`);
  L.push('');
  // 背景色
  const kebab = (s) => s.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase()).replace(/^bg-(\d)/, 'bg-$1');
  for (const [k, v] of Object.entries(v3.background)) {
    const ref = typeof v === 'string' && v.startsWith('$') ? `@zone-${v.slice(1).replace('base.color.', 'color.').replace(/\./g, '-')}` : v;
    L.push(`  --zone-color-${k === 'bg500' || k === 'bg400' || k === 'bg300' || k === 'bg200' ? 'bg-' + k.slice(2) : kebab(k)}: ${ref};`);
  }
  L.push('');
  // 边框色
  for (const [k, v] of Object.entries(v3.line)) L.push(`  --zone-color-${k === 'line' ? 'line' : k}: ${v};`);
  L.push('');
  // 遮罩色
  for (const [k, v] of Object.entries(v3.overlay)) L.push(`  --zone-color-overlay-${k}: ${v};`);
  L.push('');
  // 主色梯度（500→100 显式排序）
  const gradKeys = Object.keys(v3.primaryGradient).sort((a, b) => Number(b) - Number(a));
  for (const k of gradKeys) {
    const v = v3.primaryGradient[k];
    if (typeof v === 'string') L.push(`  --zone-color-primary-${k}: ${v};`);
    else L.push(`  --zone-color-primary-${k}: mix(${MIX_BASE}, @zone-color-primary, ${v}%);`);
  }
  L.push('');
  L.push('  @supports (color: color-mix(in srgb, red, blue)) {');
  for (const k of gradKeys) {
    const v = v3.primaryGradient[k];
    if (typeof v === 'number') {
      L.push(`    --zone-color-primary-${k}: color-mix(in srgb, ${MIX_BASE} ${v}%, var(--zone-color-primary) ${100 - v}%);`);
    }
  }
  L.push('  }');
  L.push('');
  // 中性色梯度（数字键按 500→100 显式排序，与原文件一致）
  const descOrder = (obj) => Object.keys(obj).sort((a, b) => Number(b) - Number(a));
  for (const k of descOrder(v3.neutralScale)) L.push(`  --zone-color-neutral-${k}: ${v3.neutralScale[k]};`);
  L.push('');
  // 框架色
  for (const k of descOrder(v3.frame)) L.push(`  --zone-color-frame-${k}: ${v3.frame[k]};`);
  L.push('');
  // 交互态
  L.push(`  --zone-color-primary-hover: ${v3.states.primaryHover};`);
  L.push(`  --zone-color-primary-active: ${v3.states.primaryActive};`);
  L.push(`  --zone-color-neutral-hover: ${v3.states.neutralHover};`);
  L.push(`  --zone-color-neutral-active: ${v3.states.neutralActive};`);
  L.push(`  --zone-color-disabled-bg: ${v3.states.disabledBg};`);
  L.push(`  --zone-color-disabled-border: ${v3.states.disabledBorder};`);
  L.push(`  --zone-color-disabled-text: ${v3.states.disabledText};`);
  L.push('');
  L.push('  --zone-color-primary-button: var(--zone-color-primary);');
  L.push('  --zone-color-primary-button-hover: var(--zone-color-primary-hover);');
  L.push('  --zone-color-primary-button-active: var(--zone-color-primary-active);');
  L.push('');
  // 层级
  for (const [k, v] of Object.entries(v3.zIndex)) L.push(`  --zone-index-${k}: ${v};`);
  L.push('');
  // 字重
  for (const [k] of Object.entries(T.base.fontWeight)) L.push(`  --zone-font-${k}: @zone-font-${k};`);
  L.push('');
  // 其他
  L.push(`  --zone-text-x-direction: ${T.meta.rtl.ltr};`);
  L.push('}');
  L.push('');

  // 字体组合（原 .generate-font-vars 展开为静态输出；顺序与原 mixin 输出一致：h1..h6 → b1..b3 → c1 → display/h1 覆盖）
  const weightVar = (w) => `@zone-font-${w}`;
  function fontBlock(mediaQuery, remExpr, cfg) {
    const B = [];
    B.push(mediaQuery);
    B.push(`  @rem: (${remExpr});`);
    B.push('');
    B.push('  @{rootSel} {');
    B.push('    .generate-sizes(@rem);');
    B.push('    .generate-font-sizes(@rem);');
    B.push('    .generate-border-radius(@rem);');
    B.push('');
    // 标题 h1..h6
    cfg.headingSizes.forEach((size, i) => {
      const n = i + 1;
      B.push(`    --zone-font-h${n}: ${weightVar('semibold')} var(--zone-font-size-${size}) / @zone-h-line-height var(--zone-font-family);`);
      B.push(`    --zone-font-h${n}-weight: ${weightVar('semibold')};`);
    });
    // 正文
    const [b1, b2, b3] = cfg.bodySizes;
    B.push(`    --zone-font-b1: ${weightVar('regular')} var(--zone-font-size-${b1}) / @zone-b-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-b1-weight: ${weightVar('regular')};`);
    B.push('');
    B.push(`    --zone-font-b2: ${weightVar('regular')} var(--zone-font-size-${b2}) / @zone-b-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-b2-weight: ${weightVar('regular')};`);
    B.push('');
    B.push(`    --zone-font-b3: ${weightVar('regular')} var(--zone-font-size-${b3}) / @zone-b-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-b3-weight: ${weightVar('regular')};`);
    B.push('');
    // 辅助
    B.push(`    --zone-font-c1: ${weightVar('regular')} var(--zone-font-size-${cfg.captionSize}) / @zone-c-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-c1-weight: ${weightVar('regular')};`);
    B.push('');
    // display / h1 覆盖
    B.push(`    --zone-font-display-1: ${weightVar('extrabold')} var(--zone-font-size-${cfg.display1Size}) / @zone-h-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-display-1-weight: ${weightVar('extrabold')};`);
    B.push('');
    B.push(`    --zone-font-h1: ${weightVar('extrabold')} var(--zone-font-size-${cfg.h1Size}) / @zone-h-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-h1-weight: ${weightVar('extrabold')};`);
    B.push('');
    B.push('    --zone-font-display-2: var(--zone-font-h1);');
    B.push('    --zone-font-display-2-weight: @zone-font-extrabold;');
    B.push('');
    B.push(`    --zone-font-display-3: ${weightVar('extrabold')} var(--zone-font-size-${cfg.display3Size}) / @zone-h-line-height var(--zone-font-family);`);
    B.push(`    --zone-font-display-3-weight: ${weightVar('extrabold')};`);
    B.push('  }');
    B.push('}');
    B.push('');
    return B;
  }
  L.push('// 字体组合（桌面端）');
  L.push(...fontBlock(`@media screen and (min-width: ${T.meta.breakpoint.desktopMin}) {`, T.meta.remBase.desktop, v3.typography.desktop));
  L.push('// 字体组合（移动端，<1024px）');
  L.push(...fontBlock(`@media screen and (max-width: ${T.meta.breakpoint.mobileMax}) {`, T.meta.remBase.mobile, v3.typography.mobile));
  return L.join('\n');
}

// ---------- 3. 静态令牌表 tokens.css（v3 生效值，桌面端基准） ----------
function genStaticCss() {
  const v3 = T.v3;
  const color = { ...T.base.color, ...v3.colorOverride };
  const L = [];
  L.push('/* AIYAZONE Design System tokens v3（由 packages/tokens/tokens.json 生成——禁止手改） */');
  L.push('/* 桌面端基准（rem base = 1rem/16）；主题覆盖以 color-mix 增强为准 */');
  L.push(':root {');
  for (const [k, v] of Object.entries(color)) L.push(`  --zone-color-${k}: ${v};`);
  for (const [k, v] of Object.entries(T.base.colorContrast)) {
    const o = v3.colorContrastOverride[k];
    const resolved = o ? (typeof o === 'string' ? o : lessMix(MIX_BASE, color[k], o.$mixPercent)) : v;
    L.push(`  --zone-color-${k}-contrast: ${resolved};`);
  }
  for (const [k, v] of Object.entries(T.base.fontWeight)) L.push(`  --zone-font-${k}: ${v};`);
  for (const n of T.size.scale) L.push(`  --zone-size-${n}: max(0, ${fmtRem(n)});`);
  for (const n of T.fontSize.scale) {
    L.push(`  --zone-font-size-${n}: ${T.fontSize.noScale.includes(n) ? `${n}px` : `max(${T.meta.fontSizeFloor}, ${fmtRem(n)})`};`);
  }
  for (const n of T.rounded.scale) L.push(`  --zone-rounded-${n}: max(0, ${fmtRem(n)});`);
  L.push(`  --zone-rounded-pill: ${T.rounded.pill};`);
  L.push(`  --zone-rounded-circle: ${T.rounded.circle};`);
  for (const [k, v] of Object.entries(v3.text)) L.push(`  --zone-color-text-${k}: ${v};`);
  for (const [k, v] of Object.entries(v3.icon)) L.push(`  --zone-color-icon-${k}: ${v};`);
  for (const [k, v] of Object.entries(v3.background)) {
    const key = /^bg\d+$/.test(k) ? 'bg-' + k.slice(2) : k.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase());
    const val = typeof v === 'string' && v.startsWith('$') ? color[v.slice(1).split('.')[1]] : v;
    L.push(`  --zone-color-${key}: ${val};`);
  }
  for (const [k, v] of Object.entries(v3.line)) L.push(`  --zone-color-${k}: ${v};`);
  for (const [k, v] of Object.entries(v3.overlay)) L.push(`  --zone-color-overlay-${k}: ${v};`);
  for (const [k, v] of Object.entries(v3.primaryGradient)) {
    L.push(`  --zone-color-primary-${k}: ${typeof v === 'string' ? v : lessMix(MIX_BASE, color.primary, v)};`);
  }
  for (const [k, v] of Object.entries(v3.neutralScale)) L.push(`  --zone-color-neutral-${k}: ${v};`);
  for (const [k, v] of Object.entries(v3.frame)) L.push(`  --zone-color-frame-${k}: ${v};`);
  for (const [k, v] of Object.entries(v3.states)) {
    L.push(`  --zone-color-${k.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase())}: ${v};`);
  }
  for (const [k, v] of Object.entries(v3.zIndex)) L.push(`  --zone-index-${k}: ${v};`);
  L.push(`  --zone-text-x-direction: ${T.meta.rtl.ltr};`);
  const f = v3.typography.desktop;
  f.headingSizes.forEach((size, i) => {
    L.push(`  --zone-font-h${i + 1}: ${T.base.fontWeight.semibold} var(--zone-font-size-${size}) / ${v3.lineHeight.h} var(--zone-font-family);`);
    L.push(`  --zone-font-h${i + 1}-weight: ${T.base.fontWeight.semibold};`);
  });
  f.bodySizes.forEach((size, i) => {
    L.push(`  --zone-font-b${i + 1}: ${T.base.fontWeight.regular} var(--zone-font-size-${size}) / ${v3.lineHeight.b} var(--zone-font-family);`);
    L.push(`  --zone-font-b${i + 1}-weight: ${T.base.fontWeight.regular};`);
  });
  L.push(`  --zone-font-c1: ${T.base.fontWeight.regular} var(--zone-font-size-${f.captionSize}) / ${v3.lineHeight.c} var(--zone-font-family);`);
  L.push(`  --zone-font-c1-weight: ${T.base.fontWeight.regular};`);
  L.push(`  --zone-font-display-1: ${T.base.fontWeight.extrabold} var(--zone-font-size-${f.display1Size}) / ${v3.lineHeight.h} var(--zone-font-family);`);
  L.push(`  --zone-font-h1: ${T.base.fontWeight.extrabold} var(--zone-font-size-${f.h1Size}) / ${v3.lineHeight.h} var(--zone-font-family);`);
  L.push(`  --zone-font-display-2: var(--zone-font-h1);`);
  L.push(`  --zone-font-display-3: ${T.base.fontWeight.extrabold} var(--zone-font-size-${f.display3Size}) / ${v3.lineHeight.h} var(--zone-font-family);`);
  L.push('}');
  L.push('');
  return L.join('\n');
}

// ---------- 4. tokens.ts ----------
function genTs() {
  const v3 = T.v3;
  const color = { ...T.base.color, ...v3.colorOverride };
  const flat = {};
  for (const [k, v] of Object.entries(color)) flat[`color.${k}`] = v;
  for (const [k, v] of Object.entries(T.base.colorContrast)) {
    const o = v3.colorContrastOverride[k];
    const resolved = o ? (typeof o === 'string' ? o : lessMix(MIX_BASE, color[k], o.$mixPercent)) : v;
    flat[`colorContrast.${k}`] = resolved;
  }
  for (const [k, v] of Object.entries(T.base.fontWeight)) flat[`fontWeight.${k}`] = v;
  for (const n of T.size.scale) flat[`size.${n}`] = `max(0, ${fmtRem(n)})`;
  for (const n of T.fontSize.scale) flat[`fontSize.${n}`] = T.fontSize.noScale.includes(n) ? `${n}px` : `max(${T.meta.fontSizeFloor}, ${fmtRem(n)})`;
  for (const n of T.rounded.scale) flat[`rounded.${n}`] = `max(0, ${fmtRem(n)})`;
  for (const [k, v] of Object.entries(v3.zIndex)) flat[`zIndex.${k}`] = v;
  const lines = Object.entries(flat).map(([k, v]) => `  '${k}': ${typeof v === 'number' ? v : JSON.stringify(v)},`);
  return `/* 由 packages/tokens/tokens.json 生成——禁止手改 */\n\nexport const tokens = {\n${lines.join('\n')}\n} as const;\n\nexport type TokenKey = keyof typeof tokens;\nexport default tokens;\n`;
}

// ---------- 输出 ----------
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('generated:', path.relative(REPO_ROOT, file));
}
write(path.join(REPO_ROOT, 'src/styles/zone/generated-tokens.less'), genBaseVars());
write(path.join(REPO_ROOT, 'src/styles/themes/v3/generated-tokens.less'), genV3());
write(path.join(PKG_DIR, 'dist/tokens.css'), genStaticCss());
write(path.join(PKG_DIR, 'dist/tokens.ts'), genTs());
console.log('done.');
