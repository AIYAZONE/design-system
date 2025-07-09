import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

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

  return {
    base: './', // 使用相对路径
    server: {
      host: '0.0.0.0', // 允许外部访问
      port: 5173, // 指定端口
      open: true, // 自动打开浏览器
    },
    build: {
      sourcemap: isDev ? 'inline' : true,
      minify: isProd ? 'esbuild' : false, // 仅在生产环境下启用 esbuild
      emptyOutDir: true, // 构建前清空输出目录
      outDir: "dist", // 输出目录
      cssCodeSplit: true,  // 启用 CSS 代码分割
      rollupOptions: {
        input: {
          index: "./src/index.ts", // 主入口文件
          "internal": "./src/styles/internal.css", // 仅自定义组件内部使用通用样式文件
          ...getEntriesInDir("src/styles", ".less"),
          ...getEntriesInDir("src/components", ".ts", true),
        },
        output: {
          manualChunks: {
            // 框架核心
            'lit-core': ['lit'],
            // 公共工具
            'utils': ['./src/utils/common.ts', './src/utils/elements.ts'],
            // 国际化相关
            'i18n': ['./src/i18n/index.ts'],
          },
          entryFileNames: (chunkInfo) => {
            return chunkInfo.facadeModuleId?.startsWith('components/')
              ? `components/${chunkInfo.name}.js`
              : `${chunkInfo.name}.js`;
          },
          chunkFileNames: (chunkInfo) => `chunks/${chunkInfo.name}.js`,
          assetFileNames: (assetInfo) => {
            // 检查fileName是否为undefined，如果是则使用空字符串作为默认值
            const fileName = assetInfo.name || '';
            const ext = path.extname(fileName);
            switch (ext) {
              case ".woff":
              case ".woff2":
                // 字体文件输出到fonts目录
                return "fonts/[name][ext]";
              case ".svg":
              case ".png":
              case ".jpg":
              case ".gif":
                return "assets/[name][ext]";
              default:
                return "[name].[ext]";
            }
          },
        },
      },
    },
    plugins: [
      // 生产环境插件
      ...(isProd ? [viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024, // 降低阈值到1KB，确保小文件也能被压缩
        algorithm: 'gzip',
        ext: '.gz',
        filter: /\.(js|mjs|json|css|html)$/i, // 明确指定要压缩的文件类型
        compressionOptions: {
          level: 6, // 平衡压缩率和速度
        },
      })] : []),
      visualizer({
        open: isDev,     // 仅在开发环境下自动打开报告
        filename: "dist/stats.html", // 输出文件名
        gzipSize: true, // 显示 gzip 压缩大小
        brotliSize: true, // 显示 brotli 压缩大小
        template: "treemap", // 视图类型（可选 treemap/sunburst/network/list 等）
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          charset: false, // 禁用Less自动添加@charset，避免编码冲突
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 配置路径别名
      },
    },
  };
});
