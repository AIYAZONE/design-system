import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  publicDir: path.resolve(__dirname, '../../public'),
  server: {
    host: '0.0.0.0',
    port: 5174,
    open: true,
    fs: {
      strict: false,
      allow: [path.resolve(__dirname, '../../')]
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        charset: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '@jackery/core': path.resolve(__dirname, '../../packages/core/src'),
      '@jackery/core/*': path.resolve(__dirname, '../../packages/core/src/*'),
      '@jackery/icons': path.resolve(__dirname, '../../packages/icons/src'),
      '@jackery/icons/*': path.resolve(__dirname, '../../packages/icons/src/*'),
      '@jackery/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
      '@jackery/i18n/*': path.resolve(__dirname, '../../packages/i18n/src/*'),
      '@jackery/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@jackery/utils/*': path.resolve(__dirname, '../../packages/utils/src/*')
    }
  },
  build: {
    sourcemap: true,
    minify: 'esbuild',
    emptyOutDir: true,
    outDir: 'dist'
  }
});