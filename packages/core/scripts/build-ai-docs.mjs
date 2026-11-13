#!/usr/bin/env node
/**
 * ZDS AI 文档生成器
 *
 * 输入：
 *   - packages/core/custom-elements.json（CEM 分析器产物，提供类型/默认值/描述）
 *   - 组件源码 src/components/<dir>/index.ts（增强解析 @property/@state/事件/插槽）
 *   - 组件样式 src/components/<dir>/index.less（CSS 变量契约）
 *   - packages/tokens/tokens.json（令牌摘要）
 *
 * 输出：
 *   - packages/core/zone-manifest.json     结构化组件清单（AI/工具消费）
 *   - docs/api/zone-<tag>.md               每组件规格文档
 *   - docs/api/README.md                   组件索引
 *   - apps/portal/public/llms.txt          精简 AI 索引
 *   - apps/portal/public/llms-full.txt     全量文档拼接
 *   - apps/portal/public/ai-usage.html     AI 使用规范页（由 docs/ai-usage.md 渲染）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CORE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(CORE_DIR, '../..');
const COMPONENTS_DIR = path.join(CORE_DIR, 'src/components');
const CEM_PATH = path.join(CORE_DIR, 'custom-elements.json');
const TOKENS_PATH = path.join(REPO_ROOT, 'packages/tokens/tokens.json');
const API_DIR = path.join(REPO_ROOT, 'docs/api');
const PORTAL_PUBLIC = path.join(REPO_ROOT, 'apps/portal/public');

const corePkg = JSON.parse(fs.readFileSync(path.join(CORE_DIR, 'package.json'), 'utf8'));
const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
const cem = fs.existsSync(CEM_PATH) ? JSON.parse(fs.readFileSync(CEM_PATH, 'utf8')) : { modules: [] };

// CEM 输出顺序依赖文件系统扫描顺序（不稳定）——规范化排序后写回，保证 docs:check 可复现
{
  const sortedModules = [...(cem.modules ?? [])].sort((a, b) => a.path.localeCompare(b.path));
  let changed = sortedModules.length !== (cem.modules ?? []).length;
  for (const m of sortedModules) {
    if (Array.isArray(m.declarations) && m.declarations.length > 1) {
      const before = JSON.stringify(m.declarations.map((d) => d.name));
      m.declarations.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      if (JSON.stringify(m.declarations.map((d) => d.name)) !== before) changed = true;
    }
  }
  cem.modules = sortedModules;
  if (changed) fs.writeFileSync(CEM_PATH, JSON.stringify(cem, null, 2) + '\n');
}

// ---------- CEM 索引（className → 声明） ----------
const cemDecl = new Map();
for (const m of cem.modules ?? []) {
  for (const d of m.declarations ?? []) {
    if (d.customElement) cemDecl.set(d.name, { ...d, _path: m.path });
  }
}

// ---------- 源码解析工具 ----------
function parseJsDocBlock(raw) {
  if (!raw) return '';
  return raw
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
    .filter((l) => l && !l.startsWith('@'))
    .join(' ')
    .trim();
}

/** 解析 export type 别名，用于展开联合类型 */
function parseTypeAliases(src) {
  const map = new Map();
  const re = /export type (\w+)\s*=\s*([^;]+);/g;
  let m;
  while ((m = re.exec(src))) map.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  return map;
}
function expandType(typeText, aliases, depth = 0) {
  if (!typeText || depth > 3) return typeText;
  const t = typeText.trim();
  // 直接别名
  if (aliases.has(t)) return expandType(aliases.get(t), aliases, depth + 1);
  // 数组 / 泛型 中的别名（仅处理简单 Array<X> 与 X[]）
  const arr = /^(.+)\[\]$/.exec(t);
  if (arr) return `${expandType(arr[1], aliases, depth + 1)}[]`;
  return t;
}

/** 解析 @property/@state 装饰的字段 */
function parseDecoratedFields(src) {
  const fields = [];
  // 匹配 [JSDoc] @decorator(...) [name][?]: type [= default];
  const re =
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?@(property|state)\(([\s\S]*?)\)\s*(?:@\w+\([^)]*\)\s*)?([A-Za-z_$][\w$]*)\s*\??\s*:\s*([^=\n]+?)\s*(?:=\s*([^;\n]+))?;/g;
  let m;
  while ((m = re.exec(src))) {
    const [, doc, kind, decoratorBody, name, type, def] = m;
    if (kind === 'state') continue; // 内部状态不作为公开 API
    const attrMatch = /attribute\s*:\s*false/.test(decoratorBody);
    const reflect = /reflect\s*:\s*true/.test(decoratorBody);
    const typeHint = /type\s*:\s*(Boolean|Number|String)/.exec(decoratorBody);
    fields.push({
      name,
      attribute: attrMatch ? null : name.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase()),
      reflects: reflect,
      type: type?.trim() ?? (typeHint ? typeHint[1] : 'string'),
      default: def?.trim() ?? null,
      description: parseJsDocBlock(doc),
    });
  }
  return fields;
}

/** 解析事件：new CustomEvent("zone-xxx", { detail... }) */
function parseEvents(src) {
  const out = [];
  const re = /(?:\/\*\*([\s\S]*?)\*\/\s*)?dispatchEvent\(\s*new CustomEvent\(\s*["'`]([\w-]+)["'`]/g;
  let m;
  while ((m = re.exec(src))) {
    out.push({ name: m[2], description: parseJsDocBlock(m[1]) });
  }
  return out;
}

/** 解析插槽 */
function parseSlots(src) {
  const out = [];
  for (const m of src.matchAll(/<slot([^>]*)>/g)) {
    const attrs = m[1];
    if (attrs.includes(':not(')) continue;
    const name = /name=["']([^"']+)["']/.exec(attrs);
    out.push({ name: name ? name[1] : '', description: name ? `具名插槽 ${name[1]}` : '默认插槽' });
  }
  // 去重
  const seen = new Set();
  return out.filter((s) => (seen.has(s.name) ? false : (seen.add(s.name), true)));
}

/** 解析组件 LESS 中消费的 CSS 变量 */
function parseCssVars(lessSrc) {
  const vars = new Set();
  for (const m of lessSrc.matchAll(/var\((--zone-[\w-]+)/g)) vars.add(m[1]);
  return [...vars].sort();
}

/** 从 stories 抽取首个可运行的 HTML 片段（拒绝含 args 插值/绑定/硬编码样式的模板） */
function parseStoryUsage(storySrc) {
  if (!storySrc) return null;
  const candidates = [...storySrc.matchAll(/html`([\s\S]*?)`/g)].map((m) => m[1]);
  for (const raw of candidates) {
    // 含插值、属性绑定、事件绑定的模板不可直接复用
    if (/\$\{/.test(raw)) continue;
    if (/(^|\s)[.?@][\w-]+=/.test(raw)) continue;
    if (/="\s*"/.test(raw)) continue;
    // 模板内出现硬编码 px / 十六进制色值，说明是演示壳而非规范用法
    if (/style="[^"]*(\d+px|#[0-9A-Fa-f]{3,8})/.test(raw)) continue;
    const tpl = raw.replace(/\n\s*\n/g, '\n').trim();
    if (!tpl || tpl.length > 700 || !/<zone-/.test(tpl)) continue;
    return tpl;
  }
  return null;
}

/** 由清单数据合成最小可用示例（stories 无法直接复用时兜底） */
const PREFERRED_ATTRS = ['variant', 'kind', 'size', 'type', 'interaction'];
const SKIP_ATTRS = new Set(['label', 'form', 'href', 'target', 'id', 'name', 'value', 'for', 'key']);
function synthUsage(c) {
  const enumAttrs = c.attributes.filter((a) => /\|/.test(a.type) && !SKIP_ATTRS.has(a.name));
  const preferred = enumAttrs.filter((a) => PREFERRED_ATTRS.includes(a.name));
  const pick = preferred[0] ?? enumAttrs[0];
  let attr = '';
  if (pick) {
    const first = pick.type.split('|')[0].trim().replace(/^["']|["']$/g, '');
    if (first && !/^(string|boolean|number)$/i.test(first)) attr = ` ${pick.attribute}="${first}"`;
  }
  return `<${c.tag}${attr}>内容</${c.tag}>`;
}

// ---------- 收集组件 ----------
const dirs = fs
  .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const components = [];
for (const dir of dirs) {
  const tsPath = path.join(COMPONENTS_DIR, dir, 'index.ts');
  const lessPath = path.join(COMPONENTS_DIR, dir, 'index.less');
  if (!fs.existsSync(tsPath)) continue;
  const src = fs.readFileSync(tsPath, 'utf8');
  const lessSrc = fs.existsSync(lessPath) ? fs.readFileSync(lessPath, 'utf8') : '';
  const className = /class\s+(Zone\w+)\s+extends/.exec(src)?.[1] ?? null;
  const tag = /@customElement\(\s*["'`]([\w-]+)["'`]/.exec(src)?.[1] ?? `zone-${dir}`;
  const aliases = parseTypeAliases(src);
  const cemEntry = className ? cemDecl.get(className) : null;

  // 取 @customElement 之前最近的一个 JSDoc 作为组件简介（支持 @summary / @cssproperty 标签）
  let summary = '';
  let cssProps = [];
  const ceIdx = src.indexOf('@customElement');
  if (ceIdx > -1) {
    const docEnd = src.lastIndexOf('*/', ceIdx);
    const docStart = docEnd > -1 ? src.lastIndexOf('/**', docEnd) : -1;
    if (docStart > -1) {
      const rawDoc = src.slice(docStart + 3, docEnd);
      summary = parseJsDocBlock(rawDoc);
      const tagSummary = /@summary\s+([^\n*]+)/.exec(rawDoc)?.[1]?.trim();
      if (tagSummary) summary = tagSummary;
      cssProps = [...rawDoc.matchAll(/@cssproperty\s+\[(--zone-[\w-]+)(?:[=:]\s*([^\]]+))?\]\s*-?\s*([^\n*]+)?/g)].map((m) => ({
        name: m[1],
        default: m[2]?.trim() ?? null,
        description: m[3]?.trim() ?? '',
      }));
    }
  }
  if (!summary) summary = parseJsDocBlock(cemEntry?.description);
  // 只保留第一句，避免长注释进入索引
  summary = summary.split(/(?<=。|\.)\s/)[0].slice(0, 90).trim();

  const fields = parseDecoratedFields(src).map((f) => ({ ...f, type: expandType(f.type, aliases) }));
  const events = parseEvents(src);
  const slots = parseSlots(src);
  const cssVars = parseCssVars(lessSrc);

  const storyFile = fs.readdirSync(path.join(COMPONENTS_DIR, dir)).find((f) => f.endsWith('.stories.ts'));
  const storyPath = storyFile ? path.join(COMPONENTS_DIR, dir, storyFile) : null;
  const usage = storyPath ? parseStoryUsage(fs.readFileSync(storyPath, 'utf8')) : null;

  const testDir = path.join(COMPONENTS_DIR, dir, '__tests__');
  let testCount = 0;
  if (fs.existsSync(testDir)) {
    for (const f of fs.readdirSync(testDir)) {
      if (!f.endsWith('.ts')) continue;
      testCount += (fs.readFileSync(path.join(testDir, f), 'utf8').match(/\bit\(|\btest\(/g) ?? []).length;
    }
  }

  const comp = {
    tag,
    className,
    dir,
    summary,
    scope: `packages/core/src/components/${dir}`,
    attributes: fields.filter((f) => f.attribute),
    properties: fields.filter((f) => !f.attribute),
    events,
    slots,
    cssVariables: cssVars,
    cssProps,
    usage,
    story: storyFile ?? null,
    tests: testCount,
  };
  comp.usage = comp.usage ?? synthUsage(comp);
  components.push(comp);
}

// ---------- 清单输出 ----------
const manifest = {
  name: 'AIYAZONE Design System',
  shortName: 'ZDS',
  package: corePkg.name,
  version: corePkg.version,
  generatedBy: 'packages/core/scripts/build-ai-docs.mjs',
  components: components.map(({ tag, className, dir, summary, attributes, properties, events, slots, cssVariables, story, tests }) => ({
    tag, className, dir, summary, attributes, properties, events, slots, cssVariables, story, tests,
  })),
};
fs.writeFileSync(path.join(CORE_DIR, 'zone-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// ---------- Markdown 组件文档 ----------
function mdEscape(s) {
  return String(s ?? '—').replace(/\|/g, '\\|');
}
function renderComponentMd(c) {
  const L = [];
  L.push(`# \`<${c.tag}>\`${c.className ? ` · ${c.className}` : ''}`);
  L.push('');
  if (c.summary) L.push(`> ${c.summary}`, '');
  L.push(`- **标签**：\`<${c.tag}>\``);
  L.push(`- **实现**：\`${c.className}\`（Lit · Shadow DOM）`);
  L.push(`- **来源**：\`${c.scope}\``);
  L.push(`- **测试**：${c.tests} 个用例`);
  L.push(`- **包**：\`${corePkg.name}@${corePkg.version}\``);
  L.push('');
  L.push('## 快速使用', '');
  L.push('```html');
  L.push('<!-- 1. 注册组件 -->');
  L.push(`<script type="module">import '${corePkg.name}';</script>`);
  L.push('');
  L.push('<!-- 2. 主题令牌（仅令牌用 tokens.css；完整主题用 index-v3.css） -->');
  L.push('<link rel="stylesheet" href="@aiyazone/tokens/dist/tokens.css">');
  L.push('');
  L.push('<!-- 3. 使用 -->');
  L.push(c.usage ?? synthUsage(c));
  L.push('```');
  L.push('');
  if (c.attributes.length) {
    L.push('## 属性（Attributes / Properties）', '');
    L.push('| 属性 | Attribute | 类型 | 默认值 | 说明 |');
    L.push('|------|-----------|------|--------|------|');
    for (const a of c.attributes) {
      L.push(`| \`${a.name}\` | ${a.attribute ? `\`${a.attribute}\`` : '—'} | \`${mdEscape(a.type)}\` | ${a.default ? `\`${mdEscape(a.default)}\`` : '—'} | ${mdEscape(a.description)} |`);
    }
    L.push('');
  }
  if (c.properties.length) {
    L.push('## 仅 JS 属性（无对应 attribute）', '');
    L.push('| 属性 | 类型 | 默认值 | 说明 |');
    L.push('|------|------|--------|------|');
    for (const p of c.properties) {
      L.push(`| \`${p.name}\` | \`${mdEscape(p.type)}\` | ${p.default ? `\`${mdEscape(p.default)}\`` : '—'} | ${mdEscape(p.description)} |`);
    }
    L.push('');
  }
  if (c.events.length) {
    L.push('## 事件', '', '| 事件名 | 说明 |', '|--------|------|');
    for (const e of c.events) L.push(`| \`${e.name}\` | ${mdEscape(e.description)} |`);
    L.push('', '```js', `document.querySelector('${c.tag}').addEventListener('${c.events[0].name}', (e) => {`, '  console.log(e.detail);', '});', '```', '');
  }
  if (c.slots.length) {
    L.push('## 插槽', '', '| 插槽 | 说明 |', '|------|------|');
    for (const s of c.slots) L.push(`| \`${s.name ? s.name : '（默认）'}\` | ${mdEscape(s.description)} |`);
    L.push('');
  }
  if (c.cssProps.length) {
    L.push('## 可覆盖的 CSS 变量', '');
    L.push('| 变量 | 默认值 | 说明 |');
    L.push('|------|--------|------|');
    for (const p of c.cssProps) L.push(`| \`${p.name}\` | ${p.default ? `\`${mdEscape(p.default)}\`` : '—'} | ${mdEscape(p.description)} |`);
    L.push('');
    L.push(
      `另有 ${Math.max(0, c.cssVariables.length - c.cssProps.length)} 个间接消费的 \`--zone-*\` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。`,
      '',
    );
  } else if (c.cssVariables.length) {
    L.push('## 可覆盖的 CSS 变量', '', '```css', `:root {`, ...c.cssVariables.slice(0, 12).map((v) => `  ${v}: /* 你的值 */;`), `}`, '```', '');
    L.push(`共消费 ${c.cssVariables.length} 个 \`--zone-*\` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。`, '');
  }
  L.push('## 约束', '');
  L.push('- 只允许通过 \`--zone-*\` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；');
  L.push('- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；');
  L.push('- 交互元素自带键盘可达性与 ARIA 语义，请勿用 \`div\` 模拟。');
  L.push('');
  return L.join('\n');
}

fs.mkdirSync(API_DIR, { recursive: true });
// 清理旧 md（保留 README 生成器管理的全部文件）
for (const f of fs.readdirSync(API_DIR)) {
  if (f.startsWith('zone-') && f.endsWith('.md')) fs.rmSync(path.join(API_DIR, f));
}
for (const c of components) {
  fs.writeFileSync(path.join(API_DIR, `${c.tag}.md`), renderComponentMd(c));
}

const indexLines = [
  '# 组件 API 规格（自动生成）',
  '',
  `> 由 \`packages/core/scripts/build-ai-docs.mjs\` 从源码 / CEM / tokens 生成，版本 \`${corePkg.name}@${corePkg.version}\`。**请勿手改**。`,
  '',
  '| 组件 | 标签 | 说明 | 属性 | 事件 | 插槽 |',
  '|------|------|------|------|------|------|',
  ...components.map((c) => {
    const brief = c.summary.length > 42 ? c.summary.slice(0, 42) + '…' : c.summary;
    return `| [${c.className ?? c.dir}](./${c.tag}.md) | \`<${c.tag}>\` | ${mdEscape(brief || '—')} | ${c.attributes.length} | ${c.events.length} | ${c.slots.length} |`;
  }),
  '',
];
fs.writeFileSync(path.join(API_DIR, 'README.md'), indexLines.join('\n'));

// ---------- llms.txt / llms-full.txt ----------
const baseColors = { ...tokens.base.color, ...tokens.v3.colorOverride };
function llmsIndex() {
  const L = [];
  L.push('# AIYAZONE Design System (ZDS)');
  L.push('');
  L.push('> ZDS 是一套「标准零件 + 统一规范」：人或 AI 写的页面，都只用这套零件和规范来拼，风格统一、质量达标。');
  L.push('> 技术栈：Web Components (Lit 3) + CSS 变量设计令牌 + Storybook 文档。框架无关，React/Vue/原生均可使用。');
  L.push('');
  L.push('## 使用规则（必须遵守）');
  L.push('');
  L.push('1. 颜色、字号、间距、圆角、层级一律使用 `--zone-*` 令牌，禁止硬编码色值与像素魔法数值；');
  L.push('2. 页面结构优先用 ZDS 基础组件组合，不得用 `div` 模拟按钮、弹窗、下拉等交互元素；');
  L.push('3. 组件样式定制只通过 `--zone-*` CSS 变量或公开属性，禁止覆盖 shadow DOM 内部类名；');
  L.push('4. 交互必须保留键盘可达性与 ARIA 语义；');
  L.push('5. 响应式断点：桌面 ≥1024px、移动 <1024px（750 设计稿基准），字号/间距令牌已按断点自动缩放。');
  L.push('');
  L.push('## 安装');
  L.push('');
  L.push('```bash');
  L.push(`pnpm add ${corePkg.name} @aiyazone/tokens`);
  L.push('```');
  L.push('');
  L.push('```js');
  L.push(`import '${corePkg.name}';   // 注册全部 zone-* 自定义元素`);
  L.push('```');
  L.push('');
  L.push('```html');
  L.push('<link rel="stylesheet" href="@aiyazone/tokens/dist/tokens.css">');
  L.push('```');
  L.push('');
  L.push('## 组件索引');
  L.push('');
  L.push('| 标签 | 说明 | 文档 |');
  L.push('|------|------|------|');
  for (const c of components) {
    const brief = c.summary.length > 42 ? c.summary.slice(0, 42) + '…' : c.summary;
    L.push(`| \`<${c.tag}>\` | ${brief.replace(/\n/g, ' ') || '—'} | [${c.tag}.md](./docs/api/${c.tag}.md) |`);
  }
  L.push('');
  L.push('## 设计令牌摘要');
  L.push('');
  L.push('```css');
  L.push(':root {');
  for (const [k, v] of Object.entries(baseColors)) L.push(`  --zone-color-${k}: ${v};`);
  L.push(`  --zone-size-16: 1rem;                    /* 4 的倍数，2..128 */`);
  L.push(`  --zone-font-size-14: 0.875rem;           /* 12..96，最小 12px */`);
  L.push(`  --zone-rounded-8: 0.5rem;                /* 2/4/8/12/14/24 + pill/circle */`);
  L.push('}');
  L.push('```');
  L.push('');
  L.push(`令牌全量表：\`@aiyazone/tokens/dist/tokens.css\`（${Object.keys(baseColors).length} 色板 + 尺寸/字号/圆角/层级）；真源 \`packages/tokens/tokens.json\`。`);
  L.push('');
  L.push('## 全量文档');
  L.push('');
  L.push('- [llms-full.txt](./llms-full.txt)：全部组件 API 规格拼接（单文件喂给模型）');
  L.push('- [AI 使用规范](./ai-usage.html)：生成页面时的提示词要点与验收清单');
  L.push('- Storybook：/storybook/ · 示例站：/examples/ · 图标库：/icons/');
  L.push('');
  return L.join('\n');
}

function llmsFull() {
  const L = [llmsIndex(), '', '---', '', `# 组件 API 全量规格（${corePkg.name}@${corePkg.version}）`, ''];
  for (const c of components) {
    L.push('---', '', renderComponentMd(c));
  }
  const aiUsage = path.join(REPO_ROOT, 'docs/ai-usage.md');
  if (fs.existsSync(aiUsage)) {
    L.push('---', '', fs.readFileSync(aiUsage, 'utf8'));
  }
  return L.join('\n');
}

fs.mkdirSync(PORTAL_PUBLIC, { recursive: true });
fs.writeFileSync(path.join(PORTAL_PUBLIC, 'llms.txt'), llmsIndex());
fs.writeFileSync(path.join(PORTAL_PUBLIC, 'llms-full.txt'), llmsFull());

// ---------- ai-usage.html（Markdown → 静态页） ----------
function mdToHtml(md) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const out = [];
  const lines = md.split('\n');
  let inCode = false;
  let inList = false;
  let tableBuf = [];
  const flushTable = () => {
    if (!tableBuf.length) return;
    const rows = tableBuf.filter((r) => !/^\|[\s:|-]+\|$/.test(r));
    const cells = (r) => r.split('|').slice(1, -1).map((c) => c.trim());
    out.push('<table><thead><tr>' + cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>');
    for (const r of rows.slice(1)) out.push('<tr>' + cells(r).map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>');
    out.push('</tbody></table>');
    tableBuf = [];
  };
  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) { out.push('</code></pre>'); inCode = false; }
      else { out.push('<pre><code>'); inCode = true; }
      continue;
    }
    if (inCode) { out.push(esc(line)); continue; }
    if (line.startsWith('|')) { tableBuf.push(line); continue; }
    flushTable();
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inline(line.replace(/^\s*[-*]\s+/, '')) + '</li>');
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { const lv = h[1].length; out.push(`<h${lv + 1}>${inline(h[2])}</h${lv + 1}>`); continue; }
    if (line.trim() === '---') { out.push('<hr>'); continue; }
    if (line.trim() === '') continue;
    out.push('<p>' + inline(line) + '</p>');
  }
  if (inList) out.push('</ul>');
  if (inCode) out.push('</code></pre>');
  flushTable();
  return out.join('\n');
}

const aiUsageMdPath = path.join(REPO_ROOT, 'docs/ai-usage.md');
if (fs.existsSync(aiUsageMdPath)) {
  const body = mdToHtml(fs.readFileSync(aiUsageMdPath, 'utf8'));
  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI 使用规范 · AIYAZONE Design System</title>
    <link rel="stylesheet" href="/shared/site-header.css" />
    <link rel="stylesheet" href="/shared/site-footer.css" />
    <style>
      :root { --ink:#1c1a17; --muted:#5b574f; --line:#e6e2da; --brand:#FD5000; }
      * { box-sizing: border-box; }
      body { margin:0; font-family: Inter, -apple-system, "PingFang SC", sans-serif; color:var(--ink); background:#fbfaf8; line-height:1.75; }
      main { max-width: 880px; margin: 0 auto; padding: 96px 24px 80px; }
      h1 { font-size: 2rem; letter-spacing:-.02em; margin: 0 0 8px; }
      h2 { font-size: 1.35rem; margin: 40px 0 12px; padding-left: 12px; border-left: 4px solid var(--brand); }
      h3 { font-size: 1.08rem; margin: 28px 0 8px; }
      p, li { color: var(--ink); font-size: .95rem; }
      code { background:#f1eee8; padding:2px 6px; border-radius:4px; font-family:"JetBrains Mono", ui-monospace, monospace; font-size:.86em; }
      pre { background:#1c1a17; color:#f4f1ea; padding:16px 18px; border-radius:10px; overflow:auto; }
      pre code { background:none; padding:0; color:inherit; }
      table { width:100%; border-collapse: collapse; margin: 16px 0; background:#fff; border:1px solid var(--line); border-radius:8px; overflow:hidden; }
      th, td { text-align:left; padding:10px 12px; border-bottom:1px solid var(--line); font-size:.9rem; }
      th { background:#f6f3ed; font-weight:600; }
      hr { border:none; border-top:1px solid var(--line); margin:36px 0; }
      a { color: var(--brand); }
    </style>
  </head>
  <body>
    <div class="tech-bg"></div>
    <div id="site-header"></div>
    <main id="content">
${body}
    </main>
    <div id="site-footer"></div>
    <script type="module" src="/shared/site-header.js"></script>
    <script type="module" src="/shared/site-footer.js"></script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(PORTAL_PUBLIC, 'ai-usage.html'), html);
}

console.log(`✓ 组件清单：${components.length} 个 → packages/core/zone-manifest.json`);
console.log(`✓ API 文档：docs/api/*.md（含 README 索引）`);
console.log(`✓ AI 入口：apps/portal/public/llms.txt / llms-full.txt / ai-usage.html`);
