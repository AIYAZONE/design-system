import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JackeryCore',
      fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['lit', '@jackery/utils', '@jackery/i18n'],
      output: {
        globals: {
          'lit': 'Lit',
          '@jackery/utils': 'JackeryUtils',
          '@jackery/i18n': 'JackeryI18n'
        }
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@jackery/utils': resolve(__dirname, '../utils/src'),
      '@jackery/i18n': resolve(__dirname, '../i18n/src')
    }
  }
});