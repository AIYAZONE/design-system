/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import { viteStaticCopy } from "vite-plugin-static-copy";

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

// 通用函数：获取目录中的文件
const getEntries = (dir, extension, isDirectory = false) => {
  const fullDir = path.resolve(__dirname, dir);
  const entries = {};

  fs.readdirSync(fullDir).forEach((file) => {
    const fullPath = path.join(fullDir, file);
    if (isDirectory && fs.statSync(fullPath).isDirectory()) {
      const tsFile = path.join(fullPath, `${file}.ts`);
      if (fs.existsSync(tsFile)) {
        entries[`components/${file}`] = tsFile;
      }
    } else if (file.endsWith(extension)) {
      const name = file.replace(extension, "");
      entries[`${dir.split("/").pop()}/${name}`] = fullPath;
    }
  });

  return entries;
};

// 获取组件和样式文件的入口
const getComponentEntries = (dir) => getEntries(dir, ".ts", true);
const getStyleEntries = (dir) => getEntries(dir, ".less");

// 检查是否存在 SVG 文件
const svgExists =
  fs.existsSync(path.resolve(__dirname, "src/assets")) &&
  fs
    .readdirSync(path.resolve(__dirname, "src/assets"))
    .some((file) => file.endsWith(".svg"));

export default defineConfig(({ mode }) => {
  return {
    build: {
      ...baseBuildConfig,
      outDir: "dist",
      cssCodeSplit: true, // 保持 CSS 拆分
      rollupOptions: {
        input: {
          index: "./index.html", // 确保 HTML 作为入口
          ...getStyleEntries("src/styles"),
          ...getComponentEntries("src/components"),
        },
        output: {
          entryFileNames: (chunk) => `${chunk.name}.js`,
          chunkFileNames: (chunkInfo) => `${chunkInfo.name || "chunk"}.js`,
          assetFileNames: (assetInfo) => {
            const ext = path.extname(assetInfo.name);
            if (ext === ".css") {
              return "[name].[ext]"; // 输出到 css 文件夹
            }
            if ([".svg", ".png", ".jpg", ".gif"].includes(ext)) {
              return "assets/[name][ext]"; // 确保图片输出到 assets 文件夹
            }
            return "[name].[ext]";
          },
        },
      },
    },
    plugins: [
      // 仅在存在 SVG 文件时复制
      svgExists &&
        viteStaticCopy({
          targets: [
            {
              src: "src/assets/*.svg", // 源文件路径
              dest: "assets", // 目标文件夹
            },
          ],
        }),
    ].filter(Boolean), // 过滤掉 false 值
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
