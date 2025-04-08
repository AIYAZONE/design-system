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
    formats: ["cjs", "es"],
  },
  sourcemap: true,
  emptyOutDir: true,
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
    build: {
      ...baseBuildConfig,
      outDir: "dist",
      cssCodeSplit: true,
      rollupOptions: {
        input: {
          index: "./src/index.ts",
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
            const ext = path.extname(assetInfo.name);
            switch (ext) {
              case ".css":
                // 输出到 styles 目录
                return "styles/[name].[ext]";
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
    base: "./", // 添加此行以使用相对路径
    plugins: [
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteStaticCopy({
        targets: [
          {
            src: ["src/assets/**/*"], // 源目录
            dest: "assets", // 目标目录
          },
        ],
        structured: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
