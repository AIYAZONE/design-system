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
      external: ['lit', '@zone/utils', '@zone/i18n'],
      output: {
        globals: {
          'lit': 'Lit',
          '@zone/utils': 'AIYAZONEUtils',
          '@zone/i18n': 'AIYAZONEI18n'
        }
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@zone/utils': resolve(__dirname, '../utils/src'),
      '@zone/i18n': resolve(__dirname, '../i18n/src')
    }
  }
});