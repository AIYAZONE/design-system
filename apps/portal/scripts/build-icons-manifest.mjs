/**
 * 生成 /icons/ 图标库页的运行时清单 + 复制 SVG 资源到门户 dist。
 * 在 build-all 中于 portal 构建之后执行（产物直接写入 dist/icons/）。
 * 用法：node scripts/build-icons-manifest.mjs [iconsDistDir]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createIconsManifest } from './icons-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const iconsSrc = path.join(rootDir, 'packages/icons/src/icons');
const outDir = process.argv[2] || path.resolve(__dirname, '../dist/icons');

const manifest = createIconsManifest(rootDir);

for (const { category: cat, icons } of manifest.categories) {
  const dir = path.join(iconsSrc, cat);
  const assetDir = path.join(outDir, 'assets', cat);
  fs.mkdirSync(assetDir, { recursive: true });
  for (const name of icons) fs.copyFileSync(path.join(dir, `${name}.svg`), path.join(assetDir, `${name}.svg`));
}

const total = manifest.categories.reduce((n, c) => n + c.icons.length, 0);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icons-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ 图标清单：${total} 个（${manifest.categories.map((c) => `${c.category} ${c.icons.length}`).join(' / ')}）→ dist/icons/icons-manifest.json`);
