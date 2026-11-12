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
      name: '@aiyazone/utils',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['@open-wc/form-control'],
      input: 'src/index.ts',
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