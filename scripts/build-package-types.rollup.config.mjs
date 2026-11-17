import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dts from 'rollup-plugin-dts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export default {
  input: path.resolve('src/index.ts'),
  output: { file: path.resolve('dist/index.d.ts'), format: 'es' },
  external: [/\.svg(?:\?raw)?$/, /^lit(?:$|\/)/, /^@lit\//, /^@aiyazone\//],
  plugins: [dts({ tsconfig: path.join(root, 'tsconfig.types.json'), respectExternal: true })]
};
