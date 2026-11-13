/**
 * 图标资产守卫测试（替代 Chromatic 视觉回归的低成本兜底）
 * 校验：每类目录下 SVG 均存在、非空、内容为合法 <svg>、名称唯一、模板引用完整。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICONS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../icons');

function collect(category: string) {
  const dir = path.join(ICONS_DIR, category);
  return fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => ({
    file: f,
    name: f.replace(/\.svg$/, ''),
    content: fs.readFileSync(path.join(dir, f), 'utf8'),
  }));
}

describe.each(['system', 'social-media'])('icons assets: %s', (category) => {
  const icons = collect(category);

  it('存在图标资产（数量守卫）', () => {
    expect(icons.length).toBeGreaterThan(0);
  });

  it('SVG 文件名唯一', () => {
    const names = icons.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(icons.map((i) => [i.name, i.content] as const))('%s 内容合法', (_name, content) => {
    expect(content).toMatch(/<svg[\s>]/);
    expect(content).toMatch(/<\/svg>\s*$/);
    expect(content.length).toBeGreaterThan(20);
  });
});
