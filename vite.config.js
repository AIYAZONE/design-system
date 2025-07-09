import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import viteCompression from "vite-plugin-compression";

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

export default defineConfig(() => {
  return {
    base: './', // 使用相对路径
    server: {
      host: '0.0.0.0', // 允许外部访问
      port: 5173, // 指定端口
      open: true, // 自动打开浏览器
    },
    build: {
      sourcemap: true, // 生成 sourcemap
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
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.facadeModuleId.startsWith("components/")) {
              return `components/${chunkInfo.name}.js`;
            }
            return `${chunkInfo.name}.js`;
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
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024, // 降低阈值到1KB，确保小文件也能被压缩
        algorithm: 'gzip',
        ext: '.gz',
        filter: /\.(js|mjs|json|css|html)$/i, // 明确指定要压缩的文件类型
        compressionOptions: {
          level: 6, // 平衡压缩率和速度
        },
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
