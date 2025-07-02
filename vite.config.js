import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteCompression from "vite-plugin-compression";

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
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
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
