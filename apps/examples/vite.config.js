import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

const getHtmlInputs = () => {
  const inputs = {
    index: path.resolve(__dirname, './index.html')
  };
  const pagesDir = path.resolve(__dirname, './pages');
  if (fs.existsSync(pagesDir)) {
    const walk = (dir) => {
      fs.readdirSync(dir).forEach((name) => {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (name.toLowerCase().endsWith('.html')) {
          const rel = path.relative(pagesDir, full).replace(/\\/g, '/');
          const key = `pages/${rel.replace(/\.html$/,'')}`;
          inputs[key] = full;
        }
      });
    };
    walk(pagesDir);
  }
  return inputs;
};

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/' : './',
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
      '@styles': path.resolve(__dirname, '../../src/styles'),
      '@jackery/design-system': path.resolve(__dirname, '../../src/index.ts'),
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
    outDir: 'dist',
    rollupOptions: {
      input: {
        ...getHtmlInputs(),
        'examples-theme-v1': path.resolve(__dirname, '../../src/styles/themes/v1/index.less'),
        'examples-theme-v2': path.resolve(__dirname, '../../src/styles/themes/v2/index.less'),
        'examples-theme-v3': path.resolve(__dirname, '../../src/styles/themes/v3/index.less')
      },
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) {
            // 保持主题样式稳定文件名，其他沿用默认
            if (name.includes('examples-theme-v1')) return 'assets/examples-theme-v1.css';
            if (name.includes('examples-theme-v2')) return 'assets/examples-theme-v2.css';
            if (name.includes('examples-theme-v3')) return 'assets/examples-theme-v3.css';
          }
          return 'assets/[name][ext]';
        }
      }
    }
  }
})) ;
