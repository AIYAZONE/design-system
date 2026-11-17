import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../../..');
const demoPath = path.join(repoRoot, 'apps/portal/public/ai-demo.html');
const manifestPath = path.join(repoRoot, 'packages/core/zone-manifest.json');
const iconRoot = path.join(repoRoot, 'packages/icons/src/icons');

const errors = [];
const report = (message) => errors.push(message);
const read = (filePath) => fs.readFileSync(filePath, 'utf8');

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
};

const manifest = JSON.parse(read(manifestPath));
const components = new Map(manifest.components.map((component) => [component.tag, component]));
const iconNames = new Set(
  walk(iconRoot)
    .filter((filePath) => filePath.endsWith('.svg'))
    .map((filePath) => path.basename(filePath, '.svg'))
);
const sourceDirs = [
  path.join(repoRoot, 'src/styles'),
  path.join(repoRoot, 'packages/core/src'),
  path.join(repoRoot, 'packages/icons/src'),
  path.join(repoRoot, 'packages/tokens/dist')
];
const tokenSourceFiles = sourceDirs.flatMap(walk).filter((filePath) => /\.(less|css|ts|js)$/.test(filePath));
const definedTokens = new Set();
for (const filePath of tokenSourceFiles) {
  const source = read(filePath);
  for (const declaration of source.matchAll(/(--zone-[\w-]+)\s*:\s*([^;}]*)/g)) {
    if (/\bundefined\b/i.test(declaration[2])) report(`${path.relative(repoRoot, filePath)} 中 ${declaration[1]} 的值为 undefined`);
  }
  for (const match of source.matchAll(/(--zone-[\w-]+)\s*:/g)) definedTokens.add(match[1]);
}

const html = read(demoPath);
const knownCustomTags = new Set([...components.keys(), 'zone-icon']);
const globalAttributes = new Set([
  'id', 'class', 'style', 'slot', 'part', 'role', 'tabindex', 'title', 'hidden', 'lang', 'dir', 'name', 'value',
  'autofocus', 'disabled', 'contenteditable', 'draggable', 'spellcheck', 'translate', 'accesskey', 'autocapitalize'
]);
const attributePattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const customTagPattern = /<\s*(zone-[\w-]+)\b([^>]*)>/gi;
const customElementIds = new Map();

for (const match of html.matchAll(customTagPattern)) {
  const tag = match[1].toLowerCase();
  const attributesText = match[2];
  if (!knownCustomTags.has(tag)) {
    report(`未知组件 <${tag}>`);
    continue;
  }

  const componentAttributeRecords = tag === 'zone-icon'
    ? [{ name: 'name' }, { name: 'hover-name' }]
    : components.get(tag)?.attributes ?? [];
  const componentAttributes = new Map(componentAttributeRecords
    .map((attribute) => [attribute.attribute ?? attribute.name, attribute])
    .filter(([attribute]) => typeof attribute === 'string' && attribute.length > 0));

  for (const attributeMatch of attributesText.matchAll(attributePattern)) {
    const name = attributeMatch[1].toLowerCase();
    const value = attributeMatch[2] ?? attributeMatch[3] ?? attributeMatch[4] ?? '';
    const allowedGlobal = globalAttributes.has(name) || name.startsWith('aria-') || name.startsWith('data-');
    const componentAttribute = componentAttributes.get(name);
    if (!allowedGlobal && !componentAttribute) {
      report(`<${tag}> 不支持属性 ${name}`);
    }
    if (componentAttribute?.type && value) {
      const enumValues = [...componentAttribute.type.matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
      if (enumValues.length > 0 && !enumValues.includes(value)) {
        report(`<${tag}> 属性 ${name} 的值 ${value} 不在组件 API 声明的枚举值中`);
      }
    }
    if ((name === 'name' && tag === 'zone-icon') || name === 'hover-name' || name === 'icon') {
      if (value && !iconNames.has(value)) report(`<${tag}> 使用了不存在的图标名 ${value}`);
    }
    if (name === 'id' && value) customElementIds.set(value, tag);
  }
}

const variableTags = new Map();
for (const scriptMatch of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc\s*=/.test(scriptMatch[1])) continue;
  const script = scriptMatch[2];
  for (const binding of script.matchAll(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*document\.getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const tag = customElementIds.get(binding[2]);
    if (tag) variableTags.set(binding[1], tag);
  }
  for (const binding of script.matchAll(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*document\.querySelector\(\s*['"](zone-[\w-]+)['"]\s*\)/g)) {
    if (knownCustomTags.has(binding[2])) variableTags.set(binding[1], binding[2]);
  }
  for (const assignment of script.matchAll(/\b([\w$]+)\.([\w$]+)\s*=(?!=)/g)) {
    const [, variable, property] = assignment;
    const tag = variableTags.get(variable);
    if (!tag) continue;
    const publicProperties = tag === 'zone-icon'
      ? new Set(['name', 'hoverName', 'hover-name'])
      : new Set([
          ...(components.get(tag)?.attributes ?? []).flatMap((attribute) => [attribute.name, attribute.attribute]),
          ...(components.get(tag)?.properties ?? []).map((item) => item.name)
        ]);
    if (!publicProperties.has(property)) report(`<${tag}> JavaScript 属性 ${property} 不在当前组件清单中`);
  }
}

const cssChunks = [];
for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) cssChunks.push(match[1]);
for (const match of html.matchAll(/\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
  cssChunks.push(`.inline-style { ${match[1] ?? match[2] ?? ''} }`);
}

let checkedDeclarations = 0;
for (const [index, css] of cssChunks.entries()) {
  let root;
  try {
    root = postcss.parse(css, { from: `${path.relative(repoRoot, demoPath)} style block ${index + 1}` });
  } catch (error) {
    report(`CSS 解析失败：${error.message}`);
    continue;
  }

  root.walkDecls((decl) => {
    checkedDeclarations += 1;
    const value = decl.value;
    for (const match of value.matchAll(/var\(\s*(--zone-[\w-]+)/g)) {
      if (!definedTokens.has(match[1])) report(`${decl.prop} 引用了未定义令牌 ${match[1]}`);
    }

    if (/(?:#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|color)\s*\()/i.test(value)) {
      report(`${decl.prop} 使用了硬编码颜色 ${value}`);
    }
    const valueWithoutVariables = value.replace(/var\([^)]*\)/g, '');
    if (/\b(?:black|white|red|green|blue|orange|purple|gray|grey|silver|maroon|navy)\b/i.test(valueWithoutVariables)) {
      report(`${decl.prop} 使用了命名颜色 ${value}`);
    }

    const tokenizedProperties = /^(?:color|background-color|border-color|outline-color|text-decoration-color|fill|stroke|font-size|font|padding(?:-.+)?|margin(?:-.+)?|gap|row-gap|column-gap|border-radius|box-shadow|z-index)$/i;
    if (!tokenizedProperties.test(decl.prop)) return;
    if (decl.prop.toLowerCase() === 'z-index') {
      if (!/var\(\s*--zone-index-[\w-]+/.test(value)) report(`z-index 应使用 --zone-index-* 令牌：${value}`);
      return;
    }
    if (decl.prop.toLowerCase() === 'box-shadow' && value !== 'none' && !/var\(/.test(value)) {
      report(`box-shadow 应使用令牌：${value}`);
      return;
    }
    for (const dimension of value.matchAll(/(-?\d*\.?\d+)(?:px|rem|em|vh|vw|vmin|vmax)\b/gi)) {
      if (Number.parseFloat(dimension[1]) !== 0) report(`${decl.prop} 使用了未令牌化尺寸 ${dimension[0]}`);
    }
  });
}

const inputIds = [...html.matchAll(/<input\b([^>]*)>/gi)].map((match) => {
  const attrs = [...match[1].matchAll(attributePattern)];
  const id = attrs.find((attr) => attr[1].toLowerCase() === 'id');
  const type = attrs.find((attr) => attr[1].toLowerCase() === 'type');
  return { id: id?.[2] ?? id?.[3] ?? id?.[4] ?? '', type: type?.[2] ?? type?.[3] ?? type?.[4] ?? '' };
});
for (const input of inputIds) {
  if (input.type.toLowerCase() === 'hidden') continue;
  if (!input.id) {
    report('页面包含没有 id 的原生 input，无法静态核对其 label 关联');
    continue;
  }
  const escapedId = input.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*["']${escapedId}["']`, 'i').test(html)) {
    report(`input#${input.id} 没有匹配的 label[for]`);
  }
}

if (errors.length) {
  console.error(`AI 样例检查失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`AI 样例检查通过：组件 HTML/JS 属性、${iconNames.size} 个 SVG 图标名、${definedTokens.size} 个可用令牌定义、${checkedDeclarations} 条 CSS 声明与 input/label 关联。`);
  console.log('范围仅限 apps/portal/public/ai-demo.html 的静态内容，不等同于任意 AI 输出的合规保证。');
}
