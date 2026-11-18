import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'node:fs';
import { isLitImport, litBuildContract } from '../../scripts/lit-build-contract.mjs';

const componentEntries = Object.fromEntries(
  readdirSync(resolve(__dirname, 'src/components'))
    .filter(name => existsSync(resolve(__dirname, 'src/components', name, 'index.ts')))
    .map(name => [`${name}/index`, resolve(__dirname, 'src/components', name, 'index.ts')])
);

export default defineConfig({
  plugins: [litBuildContract()],
  build: {
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts'), ...componentEntries },
      name: 'AIYAZONECore',
      fileName: (format, name) => `${name}.${format === 'cjs' ? 'cjs' : 'js'}`,
      cssFileName: 'styles/index',
    },
    rollupOptions: {
      external: id => isLitImport(id) || /^@aiyazone\/(?:utils|i18n)(?:$|\/)/.test(id),
      output: ['es', 'cjs'].map(format => ({
        format,
        exports: 'named',
        chunkFileNames: `chunks/[name]-[hash].${format === 'cjs' ? 'cjs' : 'js'}`
      }))
    },
    cssCodeSplit: false
  }
});
