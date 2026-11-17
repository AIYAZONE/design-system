import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dts from 'rollup-plugin-dts';

const core = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../packages/core');
const components = fs.readdirSync(path.join(core, 'src/components'))
  .filter(name => fs.existsSync(path.join(core, 'src/components', name, 'index.ts')));
const entries = { index: 'src/index.ts', ...Object.fromEntries(components.map(name => [`${name}/index`, `src/components/${name}/index.ts`])) };

export default {
  input: Object.fromEntries(Object.entries(entries).map(([name, entry]) => [name, path.join(core, entry)])),
  output: {
    dir: path.join(core, 'dist'),
    entryFileNames: '[name].d.ts',
    chunkFileNames: 'types/[name]-[hash].d.ts',
    format: 'es'
  },
  external: [/\.less(?:\?inline)?$/, /^lit(?:$|\/)/, /^@lit\//, /^@floating-ui\//, /^@aiyazone\//],
  plugins: [dts({ tsconfig: path.resolve(core, '../../tsconfig.types.json'), respectExternal: true })]
};
