import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

const renameCssPlugin = (fileName = 'index.css') => ({
  name: 'rename-css-asset',
  apply: 'build',
  writeBundle(options) {
    const outDir = options.dir || (options.file ? path.dirname(options.file) : 'dist');
    const src = path.join(outDir, 'style.css');
    const srcMap = path.join(outDir, 'style.css.map');
    const dest = path.join(outDir, fileName);
    const destMap = path.join(outDir, `${fileName}.map`);
    try {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src);
      }
      if (fs.existsSync(srcMap)) {
        fs.copyFileSync(srcMap, destMap);
        fs.unlinkSync(srcMap);
      }
    } catch {}
  }
  ,
  closeBundle() {
    const outDir = 'dist';
    const src = path.join(outDir, 'style.css');
    const srcMap = path.join(outDir, 'style.css.map');
    try {
      if (fs.existsSync(src)) fs.unlinkSync(src);
      if (fs.existsSync(srcMap)) fs.unlinkSync(srcMap);
    } catch {}
  }
});

// 获取指定目录下的文件入口
const getEntriesInDir = (dirPath, fileExtension, isDirectory = false) => {
  try {
    const absolutePath = path.resolve(__dirname, dirPath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`Directory not found: ${absolutePath}`);
      return {};
    }

    const entries = {};
    fs.readdirSync(absolutePath).forEach(file => {
      const fullPath = path.join(absolutePath, file);
      const isDir = fs.statSync(fullPath).isDirectory();

      if ((isDirectory && isDir) || (!isDirectory && file.endsWith(fileExtension))) {
        const entryKey = isDirectory ? `components/${file}` : file;
        entries[entryKey] = isDirectory ? path.join(fullPath, "index.ts") : fullPath;
      }
    });

    return entries;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return {};
  }
};

export default defineConfig((configEnv) => {
  const isDev = configEnv.mode === 'development';
  const isProd = configEnv.mode === 'production';
  const isLibrary = configEnv.mode === 'library';
  const isLibrarySingle = configEnv.mode === 'library-single';
  const isThemes = configEnv.mode === 'themes';

  if (isLibrary) {
    return {
      base: './',
      publicDir: false,
      build: {
        sourcemap: true,
        minify: 'esbuild',
        emptyOutDir: true,
        outDir: 'dist',
        lib: {
          entry: './src/index.ts',
          fileName: (format) => (format === 'es' ? 'index.esm.js' : 'index.cjs'),
          formats: ['es', 'cjs'],
          name: 'JackeryDesignSystem'
        },
        rollupOptions: {
          external: [],
          output: {
            chunkFileNames: (chunkInfo) => {
              return 'chunks/[name]-[hash].js';
            },
            assetFileNames: (assetInfo) => {
              const fileName = assetInfo.name || '';
              const ext = path.extname(fileName);
              switch (ext) {
                case '.woff':
                case '.woff2':
                  return 'fonts/[name][ext]';
                case '.svg':
                case '.png':
                case '.jpg':
                case '.gif':
                  return 'assets/[name][ext]';
                default:
                  return '[name].[ext]';
              }
            }
          },
          treeshake: {
            preset: 'recommended',
            moduleSideEffects: (id) => /(\.(css|less))$/.test(id) || /[\\\/]packages[\\\/]core[\\\/]src[\\\/]/.test(id) || /[\\\/]packages[\\\/]icons[\\\/]src[\\\/]/.test(id) || /[\\\/]packages[\\\/]i18n[\\\/]src[\\\/]/.test(id)
          }
        }
      },
      plugins: [
        renameCssPlugin('index.css'),
        visualizer({
          open: false,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
          template: 'treemap'
        })
      ],
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
          '@': path.resolve(__dirname, 'src'),
          '@styles': path.resolve(__dirname, 'src/styles'),
          '@jackery/design-system': path.resolve(__dirname, 'src/index.ts'),
          '@jackery/core': path.resolve(__dirname, 'packages/core/src'),
          '@jackery/core/*': path.resolve(__dirname, 'packages/core/src/*'),
          '@jackery/icons': path.resolve(__dirname, 'packages/icons/src'),
          '@jackery/icons/*': path.resolve(__dirname, 'packages/icons/src/*'),
          '@jackery/i18n': path.resolve(__dirname, 'packages/i18n/src'),
          '@jackery/i18n/*': path.resolve(__dirname, 'packages/i18n/src/*'),
          '@jackery/utils': path.resolve(__dirname, 'packages/utils/src'),
          '@jackery/utils/*': path.resolve(__dirname, 'packages/utils/src/*')
        }
      }
    };
  }

  if (isLibrarySingle) {
    return {
      base: './',
      publicDir: false,
      build: {
        sourcemap: true,
        minify: 'esbuild',
        emptyOutDir: true,
        outDir: 'dist',
        lib: {
          entry: './src/index.ts',
          fileName: (format) => (format === 'es' ? 'index.single.js' : 'index.single.cjs'),
          formats: ['es', 'cjs'],
          name: 'JackeryDesignSystem'
        },
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
            assetFileNames: (assetInfo) => {
              const fileName = assetInfo.name || '';
              const ext = path.extname(fileName);
              switch (ext) {
                case '.woff':
                case '.woff2':
                  return 'fonts/[name][ext]';
                case '.svg':
                case '.png':
                case '.jpg':
                case '.gif':
                  return 'assets/[name][ext]';
                default:
                  return '[name].[ext]';
              }
            }
          },
          treeshake: {
            preset: 'recommended',
            moduleSideEffects: (id) => /(\.(css|less))$/.test(id) || /[\\\/]packages[\\\/]core[\\\/]src[\\\/]/.test(id) || /[\\\/]packages[\\\/]icons[\\\/]src[\\\/]/.test(id) || /[\\\/]packages[\\\/]i18n[\\\/]src[\\\/]/.test(id)
          }
        }
      },
      plugins: [
        renameCssPlugin('index.single.css'),
        visualizer({
          open: false,
          filename: 'dist/stats.single.html',
          gzipSize: true,
          brotliSize: true,
          template: 'treemap'
        })
      ],
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
          '@': path.resolve(__dirname, 'src'),
          '@styles': path.resolve(__dirname, 'src/styles'),
          '@jackery/core': path.resolve(__dirname, 'packages/core/src'),
          '@jackery/core/*': path.resolve(__dirname, 'packages/core/src/*'),
          '@jackery/icons': path.resolve(__dirname, 'packages/icons/src'),
          '@jackery/icons/*': path.resolve(__dirname, 'packages/icons/src/*'),
          '@jackery/i18n': path.resolve(__dirname, 'packages/i18n/src'),
          '@jackery/i18n/*': path.resolve(__dirname, 'packages/i18n/src/*'),
          '@jackery/utils': path.resolve(__dirname, 'packages/utils/src'),
          '@jackery/utils/*': path.resolve(__dirname, 'packages/utils/src/*')
        }
      }
    };
  }

  if (isThemes) {
    return {
      base: './',
      publicDir: true,
      build: {
        sourcemap: true,
        minify: 'esbuild',
        emptyOutDir: false,
        outDir: 'dist',
        rollupOptions: {
          input: {
            'index': path.resolve(__dirname, 'src/styles/index.less'),
            'internal': path.resolve(__dirname, 'src/styles/internal.less'),
            'index-v1': path.resolve(__dirname, 'src/styles/themes/v1/index.less'),
            'index-v2': path.resolve(__dirname, 'src/styles/themes/v2/index.less'),
            'index-v3': path.resolve(__dirname, 'src/styles/themes/v3/index.less')
          },
          output: {
            entryFileNames: (chunkInfo) => `${chunkInfo.name}.js`,
            assetFileNames: (assetInfo) => {
              const name = assetInfo.name || '';
              if (name.endsWith('.css')) return `${name}`;
              const ext = path.extname(name);
              switch (ext) {
                case '.woff':
                case '.woff2':
                  return 'fonts/[name][ext]';
                case '.svg':
                case '.png':
                case '.jpg':
                case '.gif':
                  return 'assets/[name][ext]';
                default:
                  return '[name].[ext]';
              }
            }
          }
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
          '@': path.resolve(__dirname, 'src'),
          '@styles': path.resolve(__dirname, 'src/styles'),
          '@jackery/core': path.resolve(__dirname, 'packages/core/src'),
          '@jackery/icons': path.resolve(__dirname, 'packages/icons/src'),
          '@jackery/i18n': path.resolve(__dirname, 'packages/i18n/src'),
          '@jackery/utils': path.resolve(__dirname, 'packages/utils/src')
        }
      }
    };
  }

  return {
    base: './',
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true
    },
    build: {
      sourcemap: isDev ? 'inline' : true,
      minify: isProd ? 'esbuild' : false,
      emptyOutDir: true,
      outDir: 'dist',
      cssCodeSplit: true,
      rollupOptions: {
        input: {
          index: './src/index.ts',
          ...getEntriesInDir('src/styles', '.less'),
          'examples-index': './apps/examples/styles/index.less'
        },
        output: {
          manualChunks: {
            'lit-core': ['lit'],
            'utils': ['./src/utils/common.ts', './src/utils/elements.ts'],
            'icons': ['@jackery/icons'],
            'i18n': ['@jackery/i18n']
          },
          entryFileNames: (chunkInfo) => `${chunkInfo.name}.js`,
          chunkFileNames: (chunkInfo) => `chunks/${chunkInfo.name}.js`,
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.name || '';
            const ext = path.extname(fileName);
            switch (ext) {
              case '.woff':
              case '.woff2':
                return 'fonts/[name][ext]';
              case '.svg':
              case '.png':
              case '.jpg':
              case '.gif':
                return 'assets/[name][ext]';
              default:
                return '[name].[ext]';
            }
          }
        },
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: (id) => /(\.(css|less))$/.test(id) || /[\\\/]packages[\\\/]core[\\\/]src[\\\/]/.test(id) || /[\\\/]packages[\\\/]icons[\\\/]src[\\\/]/.test(id) || /[\\\/]packages[\\\/]i18n[\\\/]src[\\\/]/.test(id)
        }
      }
    },
    plugins: [
      ...(isProd ? [viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024,
        algorithm: 'gzip',
        ext: '.gz',
        filter: /\.(js|mjs|json|css|html)$/i,
        compressionOptions: {
          level: 6
        }
      })] : []),
      visualizer({
        open: isDev,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap'
      })
    ],
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
        '@': path.resolve(__dirname, 'src'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@jackery/design-system': path.resolve(__dirname, 'src/register.ts'),
        '@jackery/core': path.resolve(__dirname, 'packages/core/src'),
        '@jackery/core/*': path.resolve(__dirname, 'packages/core/src/*'),
        '@jackery/icons': path.resolve(__dirname, 'packages/icons/src'),
        '@jackery/icons/*': path.resolve(__dirname, 'packages/icons/src/*'),
        '@jackery/i18n': path.resolve(__dirname, 'packages/i18n/src'),
        '@jackery/i18n/*': path.resolve(__dirname, 'packages/i18n/src/*'),
        '@jackery/utils': path.resolve(__dirname, 'packages/utils/src'),
        '@jackery/utils/*': path.resolve(__dirname, 'packages/utils/src/*')
      }
    }
  };
});
