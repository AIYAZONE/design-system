import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { isLitImport, litBuildContract } from '../../scripts/lit-build-contract.mjs';

export default defineConfig({
  base: './',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  build: {
    lib: {
      entry: Object.fromEntries(['index', 'common', 'elements', 'event', 'form-control'].map(name => [name, resolve(__dirname, `src/${name}.ts`)])),
      name: '@aiyazone/utils',
      fileName: (format, name) => `${name}.${format === 'cjs' ? 'cjs' : 'js'}`,
    },
    rollupOptions: {
      external: isLitImport,
      output: ['es', 'cjs'].map(format => ({
        format,
        chunkFileNames: `chunks/[name]-[hash].${format === 'cjs' ? 'cjs' : 'js'}`
      }))
    },
    sourcemap: true,
    minify: 'esbuild',
    emptyOutDir: true
  },
  plugins: [
    litBuildContract(),
    dts({
      outDir: 'dist',
      entryRoot: 'src',
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      skipDiagnostics: true
    })
  ]
});
