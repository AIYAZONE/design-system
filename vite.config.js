import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import viteCompression from 'vite-plugin-compression';


// 基础构建配置
const baseBuildConfig = {
  lib: {
    entry: "./src/index.ts", // 主入口文件
    name: "@jackery/design-system",
    fileName: (format) => `index.${format}.js`,
    formats: ["cjs", "es"], // 支持 CommonJS 和 ES 模块
  },
  sourcemap: true, // 生成 sourcemap
  emptyOutDir: true, // 构建前清空输出目录
};

// 获取指定目录下的文件入口
const getEntriesInDir = (dirPath, fileExtension, isDirectory = false) => {
  const absolutePath = path.resolve(__dirname, dirPath);
  return fs.readdirSync(absolutePath).reduce((entries, file) => {
    const fullPath = path.join(absolutePath, file);
    const isDir = fs.statSync(fullPath).isDirectory();
    if (
      (isDirectory && isDir) ||
      (!isDirectory && file.endsWith(fileExtension))
    ) {
      const entryKey = isDirectory ? `components/${file}` : file;
      const entryValue = isDirectory
        ? path.join(fullPath, "index.ts")
        : fullPath;
      entries[entryKey] = entryValue;
    }
    return entries;
  }, {});
};

export default defineConfig(({ mode }) => {
  return {
    base: './', // 使用相对路径
    build: {
      ...baseBuildConfig,
      outDir: "dist", // 输出目录
      cssCodeSplit: true,  // 启用 CSS 代码分割
      rollupOptions: {
        input: {
          index: "./src/index.ts", // 主入口文件
          ...getEntriesInDir("src/styles", ".less"),
          ...getEntriesInDir("src/components", ".ts", true),
        },
        output: {
          entryFileNames: "[name].js", // 入口文件命名规则
          chunkFileNames: "chunks/[name].js", // chunk 文件命名规则
          assetFileNames: (assetInfo) => {
            const ext = path.extname(assetInfo.name);
            if (ext === ".css") {
              return "styles/index.css"; // 将所有 CSS 文件汇总为 index.css
            }
            if (ext === ".woff" || ext === ".woff2") {
              return "fonts/[name][ext]"; // 字体文件输出到 fonts 目录
            }
            return "assets/[name][ext]"; // 其他静态资源输出到 assets 目录
          },
        },
      },
    },
    plugins: [
      // 压缩构建输出
      viteCompression({
        algorithm: 'gzip', // 使用 gzip 压缩
        ext: '.gz', // 压缩文件后缀
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
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