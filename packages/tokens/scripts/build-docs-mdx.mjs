#!/usr/bin/env node
/**
 * ZDS 设计令牌文档生成器（阶段 1 余项：docs/tokens 色板/间距表从 JSON 自动渲染）
 *
 * 真源：packages/tokens/tokens.json
 * 产出：docs/tokens/ 下 4 个 mdx 的自动渲染段（用「zds-tokens:auto」JSX 注释标记包裹）：
 *   1. colors.mdx            功能色 / 文本色 / 其他色 ColorPalette
 *   2. size-and-spacing.mdx  尺寸 mixin + 编译后变量表（桌面 1rem/16、移动 1rem/32）
 *   3. radius.mdx            圆角 mixin + 编译后变量表
 *   4. z-index.mdx           层级变量表
 *
 * 规则：标记（JSX 注释形态，开标记含段 ID）之间的内容由本脚本生成，禁止手改；标记之外的叙述文字保持手写。
 * 变更请改 tokens.json 后重新执行 pnpm docs:gen。
 * 换算逻辑与 scripts/build.mjs 保持一致（fmtRem / lessMix）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PKG_DIR, '../..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs/tokens');
const T = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'tokens.json'), 'utf8'));

// ---------- 工具（与 build.mjs 保持一致） ----------
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase()).join('');
}
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
const MIX_BASE = T.meta.colorMixBase;
const v3 = T.v3;
const effectiveColor = { ...T.base.color, ...v3.colorOverride };
const kebab = (s) => s.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase());
const descOrder = (obj) => Object.keys(obj).sort((a, b) => Number(b) - Number(a));

// ---------- 标记替换（MDX2 不支持 HTML 注释，使用 JSX 注释） ----------
const MARKER_OPEN = (id) => `{/* zds-tokens:auto:${id} */}`;
const MARKER_CLOSE = `{/* /zds-tokens:auto */}`;

function patch(file, id, content) {
  const p = path.join(DOCS_DIR, file);
  const src = fs.readFileSync(p, 'utf8');
  const open = MARKER_OPEN(id);
  if (!src.includes(open)) {
    throw new Error(`${file}: 缺少自动渲染标记 ${open}（请在文档中手动补标记后重跑）`);
  }
  const start = src.indexOf(open) + open.length;
  const end = src.indexOf(MARKER_CLOSE, start);
  if (end === -1) throw new Error(`${file}: 缺少闭合标记 ${MARKER_CLOSE}`);
  fs.writeFileSync(p, src.slice(0, start) + '\n' + content.trimEnd() + '\n' + src.slice(end));
  console.log('generated:', path.relative(REPO_ROOT, p), `(${id})`);
}

// ---------- 1. colors.mdx ----------
function colorItem(title, subtitle, colors) {
  const entries = Object.entries(colors)
    .map(([k, v]) => `    '${k}': '${v}'`)
    .join(',\n');
  return `  <ColorItem\n    title="${title}"\n    subtitle="${subtitle}"\n    colors={{\n${entries},\n  }}\n  />`;
}

function genFunctionalColors() {
  const labels = {
    primary: '主色',
    success: '成功色',
    danger: '错误色/危险色',
    warning: '警告色 - 暂未定义',
    info: '信息色 - 暂未定义',
  };
  const items = v3.semanticColorScale.map((name) => {
    const resolved = effectiveColor[name];
    const o = v3.colorContrastOverride[name];
    const contrast = o ? (typeof o === 'string' ? o : lessMix(MIX_BASE, resolved, o.$mixPercent)) : T.base.colorContrast[name];
    return colorItem(`--zone-color-${name}-{x}`, labels[name] ?? name, {
      '(正常)': resolved,
      'highlight (高亮)': `var(--zone-color-${name}-highlight)`,
      'contrast (对比)': contrast,
    });
  });
  return `<ColorPalette>\n${items.join('\n')}\n</ColorPalette>`;
}

function genTextColors() {
  const text = v3.text;
  return [
    '<ColorPalette>',
    colorItem('--zone-color-text-{x}', '文本', {
      'l1(一级文本)': text.l1,
      'l2(二级文本)': text.l2,
      'l3(三级文本)': text.l3,
    }),
    colorItem('--zone-color-text-{x}', '状态文本', {
      'invalid(无效文本)': text.invalid,
      'highlight(高亮文本)': text.highlight,
      'link(超链接文本)': text.link,
    }),
    '</ColorPalette>',
  ].join('\n');
}

function genOtherColors() {
  const bg = v3.background;
  const bgKey = (k) => (/^bg\d+$/.test(k) ? 'bg-' + k.slice(2) : kebab(k));
  const resolve = (v) => {
    if (typeof v === 'string' && v.startsWith('$')) return effectiveColor[v.slice(1).split('.')[1]];
    return v;
  };
  const items = [];
  items.push(colorItem('--zone-color-icon-{x}', '系统图标颜色', Object.fromEntries(Object.entries(v3.icon).map(([k, v]) => [`${k}`, v]))));
  items.push(
    colorItem('--zone-color-bg-{x}', '背景颜色', {
      'white(白色)': effectiveColor.white,
      'grey(灰色)': effectiveColor.grey,
    }),
  );
  items.push(
    colorItem(
      '--zone-color-card-{x}',
      '系统卡片色',
      Object.fromEntries(
        Object.entries(bg)
          .filter(([k]) => k.startsWith('card'))
          .map(([k, v]) => [`${kebab(k.slice(4))}(${k === 'cardWhite' ? '白卡片' : k === 'cardGrey' ? '灰卡片' : '列表卡片（用于导航栏）'})`, resolve(v)]),
      ),
    ),
  );
  items.push(
    colorItem('--zone-color-{x}', '线条颜色', Object.fromEntries(Object.entries(v3.line).map(([k, v]) => [`${k}`, v]))),
  );
  items.push(
    colorItem(
      '--zone-color-overlay-{x}',
      '蒙黑颜色',
      Object.fromEntries(Object.entries(v3.overlay).map(([k, v]) => [k, v])),
    ),
  );
  const grad = descOrder(v3.primaryGradient);
  items.push(
    colorItem(
      '--zone-color-primary-{x}',
      '品牌橙色',
      Object.fromEntries(
        grad.map((k) => {
          const v = v3.primaryGradient[k];
          return [k, typeof v === 'string' ? v : lessMix(MIX_BASE, effectiveColor.primary, v)];
        }),
      ),
    ),
  );
  items.push(
    colorItem('--zone-color-neutral-{x}', '中性色', Object.fromEntries(descOrder(v3.neutralScale).map((k) => [k, v3.neutralScale[k]]))),
  );
  items.push(
    colorItem(
      '--zone-color-bg-{x}',
      '背景色系列',
      Object.fromEntries(
        Object.entries(bg)
          .filter(([k]) => /^bg\d+$/.test(k))
          .sort((a, b) => Number(b[0].slice(2)) - Number(a[0].slice(2)))
          .map(([k, v]) => [bgKey(k), resolve(v)]),
      ),
    ),
  );
  items.push(colorItem('--zone-color-frame-{x}', '框架色', Object.fromEntries(descOrder(v3.frame).map((k) => [k, v3.frame[k]]))));
  items.push(
    colorItem(
      '--zone-color-{x}',
      '交互状态色',
      Object.fromEntries(Object.entries(v3.states).map(([k, v]) => [kebab(k), v])),
    ),
  );
  return `<ColorPalette>\n${items.join('\n')}\n</ColorPalette>`;
}

// ---------- 2/3. 尺寸与圆角（mixin + 双端编译值） ----------
function genScaleBlock(kind, scale, extraLines, comments) {
  const mixinName = kind === 'size' ? '.generate-sizes' : '.generate-border-radius';
  const varPrefix = kind === 'size' ? 'size' : 'rounded';
  const L = [];
  L.push('```css');
  L.push(''); 
  L.push(`/**`);
  L.push(` * 由 packages/tokens/tokens.json 自动生成（zds-tokens:auto 标记段，禁止手改）`);
  L.push(` */`);
  L.push(`${mixinName}(@rem-base) {`);
  for (const n of scale) L.push(`  --zone-${varPrefix}-${n}: max(0, ${n} * @rem-base);${comments?.[n] ? `  /* ${comments[n]} */` : ''}`);
  for (const line of extraLines) L.push(`  ${line}`);
  L.push('}');
  L.push('');
  L.push(`@media screen and (min-width: ${T.meta.breakpoint.desktopMin}) {`);
  L.push(`  @rem: (1rem / 16);`);
  L.push('  :root {');
  L.push(`    ${mixinName}(@rem);`);
  L.push('  }');
  L.push('}');
  L.push('');
  L.push(`@media screen and (max-width: ${T.meta.breakpoint.mobileMax}) {`);
  L.push(`  @rem: (1rem / 32);`);
  L.push('  :root {');
  L.push(`    ${mixinName}(@rem);`);
  L.push('  }');
  L.push('}');
  L.push('');
  L.push('/* --- 编译后 --- */');
  // 桌面端 rem 基准 16：px/16；移动端 rem 基准 32：px/32（fmtRem 除以 16，故移动端传 n/2）
  L.push(`@media screen and (min-width: ${T.meta.breakpoint.desktopMin}) {`);
  L.push('  :root {');
  L.push(...scale.map((n) => `    --zone-${varPrefix}-${n}: ${fmtRem(n)};`));
  if (extraLines.length) L.push(...extraLines.map((l) => '    ' + l.trim()));
  L.push('  }');
  L.push('}');
  L.push(`@media screen and (max-width: ${T.meta.breakpoint.mobileMax}) {`);
  L.push('  :root {');
  L.push(...scale.map((n) => `    --zone-${varPrefix}-${n}: ${fmtRem(n / 2)};`));
  if (extraLines.length) L.push(...extraLines.map((l) => '    ' + l.replace('@rem-base', '1rem / 32').trim()));
  L.push('  }');
  L.push('}');
  L.push('```');
  return L.join('\n');
}

// ---------- 4. z-index ----------
function genZIndex() {
  const labels = {
    deep: '深层级：负层级，用于背景元素',
    base: '基础层级：默认内容层级',
    popover: '弹出层级：下拉菜单、弹出框',
    tooltip: '工具提示层级：提示信息',
    sticky: '固定层级：粘性定位元素',
    overlay: '遮罩层级：模态背景遮罩',
    dialog: '对话框层级：模态对话框',
    notification: '通知层级：全局通知消息',
  };
  const L = [];
  L.push('```css');
  L.push('');
  L.push('/* ----------------------------------------');
  L.push(' * Z-index 层级系统（由 packages/tokens/tokens.json 自动生成——禁止手改）');
  L.push(' * ---------------------------------------- */');
  L.push('');
  for (const [k, v] of Object.entries(v3.zIndex)) L.push(`--zone-index-${k}: ${v};${labels[k] ? ` /* ${labels[k]} */` : ''}`);
  L.push('```');
  return L.join('\n');
}

// ---------- 输出 ----------
patch('colors.mdx', 'colors-functional', genFunctionalColors());
patch('colors.mdx', 'colors-text', genTextColors());
patch('colors.mdx', 'colors-other', genOtherColors());
patch(
  'size-and-spacing.mdx',
  'sizes',
  genScaleBlock('size', T.size.scale, [], Object.fromEntries(T.size.scale.map((n) => [n, `${n}px等效尺寸`]))),
);
patch(
  'radius.mdx',
  'radius',
  genScaleBlock('rounded', T.rounded.scale, [`--zone-rounded-pill: ${T.rounded.pill};  /* 胶囊圆角：标签、徽章 */`, `--zone-rounded-circle: ${T.rounded.circle};  /* 圆形：头像、图标按钮 */`], {
    2: '当需要使用圆角的组件长度小于20px时，使用2px圆角',
    4: '当需要使用圆角的组件长度在20-60px时，使用4px圆角',
    8: '当需要使用圆角的组件长度大于60px时，使用8px圆角',
    12: 'PC端卡片圆角',
    14: '嵌套圆角-内卡片圆角',
    24: '移动端卡片圆角、嵌套圆角-外卡片圆角',
  }),
);
patch('z-index.mdx', 'z-index', genZIndex());
console.log('done.');
