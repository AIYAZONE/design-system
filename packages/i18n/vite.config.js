import { defineConfig } from 'vite';
import { resolve } from 'path';

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
      name: '@aiyazone/i18n',
      fileName: (format) => format === 'cjs' ? 'index.cjs' : 'index.es.js',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      input: 'src/index.ts',
      external: id => /^(?:lit|@lit\/[^/]+|@aiyazone\/utils)(?:$|\/)/.test(id),
      output: {
        chunkFileNames: 'chunks/[name].[format].js'
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    emptyOutDir: true
  }
});
