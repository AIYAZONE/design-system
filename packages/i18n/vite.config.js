import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: './',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@jackery/i18n',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      input: 'src/index.ts',
      external: ['lit', 'lit/decorators.js'],
      output: {
        entryFileNames: 'index.[format].js',
        chunkFileNames: 'chunks/[name].[format].js'
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    emptyOutDir: true
  },
  plugins: [
    dts({
      outDir: 'dist',
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      skipDiagnostics: true
    })
  ]
});