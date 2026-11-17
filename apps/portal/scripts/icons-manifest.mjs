import fs from 'node:fs';
import path from 'node:path';

export function createIconsManifest(rootDir) {
  const source = path.join(rootDir, 'packages/icons/src');
  const dictionary = JSON.parse(fs.readFileSync(path.join(source, 'search-keywords.json'), 'utf8'));
  const variants = {
    fill: ['实心', '填充', 'solid', 'filled'],
    line: ['线框', '描边', '空心', 'outline', 'outlined'],
    color: ['彩色', '颜色', 'colour', 'colored'],
    long: ['长箭头', '长'],
    big: ['大', 'large'],
    square: ['方形', 'square'],
  };
  return {
    categories: ['system', 'social-media'].map((category) => {
      const icons = fs.readdirSync(path.join(source, 'icons', category))
        .filter((name) => name.endsWith('.svg')).sort().map((name) => name.slice(0, -4));
      const keywords = Object.fromEntries(icons.map((name) => {
        const aliases = Object.entries(dictionary)
          .filter(([key]) => name === key || name.startsWith(`${key}-`))
          .flatMap(([, words]) => words);
        const suffixes = name.split('-').slice(1).flatMap((part) => variants[part] ?? []);
        return [name, [...new Set([name.replaceAll('-', ' '), ...aliases, ...suffixes])]];
      }));
      return { category, assets: `assets/${category}/`, icons, keywords };
    }),
  };
}
