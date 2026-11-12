import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AIYAZONECore',
      fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['lit', '@aiyazone/utils', '@aiyazone/i18n'],
      output: {
        globals: {
          'lit': 'Lit',
          '@aiyazone/utils': 'AIYAZONEUtils',
          '@aiyazone/i18n': 'AIYAZONEI18n'
        }
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@aiyazone/utils': resolve(__dirname, '../utils/src'),
      '@aiyazone/i18n': resolve(__dirname, '../i18n/src')
    }
  }
});