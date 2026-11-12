import { defineConfig } from 'vite';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import { viteStaticCopy } from "vite-plugin-static-copy";
import dts from 'vite-plugin-dts';

const isStorybookBuild = process.env.npm_lifecycle_event?.includes('storybook') || 
                          process.argv.some(arg => arg.includes('storybook'));

export default defineConfig({
  // 基础公共路径，设置为相对路径
  base: './',

  // 路径解析配置
  resolve: {
    // 路径别名配置，将 @ 映射到 src 目录
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },

  // 构建配置
  build: {
    // 禁用资源内联，确保SVG文件保持原始格式
    assetsInlineLimit: 0,
    // 库模式配置
    lib: {
      // 入口文件路径
      entry: resolve(__dirname, 'src/index.ts'),
      // 库的全局变量名
      name: '@zone/icons',
      // 输出文件名格式
      fileName: (format) => `index.${format}.js`,
      // 输出格式：ES Module 和 UMD
      formats: ['es', 'umd'],
    },

    rollupOptions: {
      input: 'src/index.ts',
      output: {
        entryFileNames: 'index.[format].js',
        chunkFileNames: 'chunks/[name].[format].js',
      }
    },

    // 生成 sourcemap 文件，便于调试
    sourcemap: true,
    // 使用 esbuild 进行代码压缩
    minify: 'esbuild',
    // 构建前清空输出目录
    emptyOutDir: true
  },
  // 插件配置
  plugins: [
    // Storybook 构建时跳过 dts 插件，避免解析 Storybook 内部模块报错
    ...(isStorybookBuild ? [] : [
      // 生成TypeScript声明文件
      dts({
        outDir: 'dist',
        rollupTypes: true,
        insertTypesEntry: true
      }),
      viteStaticCopy({
        targets: [
          {
            src: ["src/icons/**/*.svg"],
            dest: "icons",
          },
        ],
      }),
      // Gzip 压缩插件配置
      viteCompression({
        // 是否在控制台输出压缩结果
        verbose: true,
        // 是否禁用压缩
        disable: false,
        // 触发压缩的文件大小阈值（字节）
        threshold: 10240,
        // 压缩算法
        algorithm: 'gzip',
        // 生成的压缩包后缀
        ext: '.gz',
      })
    ])
  ]
});
