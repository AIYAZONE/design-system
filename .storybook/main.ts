import type { UserConfig as ViteConfig } from "vite";
import { resolve } from "node:path";

const config = {
  stories: [
    "../docs/**/*.mdx",
    // 仅包含需要在主 Storybook 展示的包，排除 @jackery/icons 的 stories
    "../packages/core/src/**/*.stories.@(js|ts|mdx)",
    "../packages/i18n/src/**/*.stories.@(js|ts|mdx)",
    "../packages/utils/src/**/*.stories.@(js|ts|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  staticDirs: [
    // 将公共资源映射到根路径，避免 /logo.svg 等资源 404
    { from: "../public", to: "/" },
    // 将 portal 的 shared 目录映射，支持 site-header/footer
    { from: "../apps/portal/public/shared", to: "/shared" },
  ],
  docs: {
    autodocs: true,
    defaultName: "Document",
  },
  // 允许通过非 localhost 主机访问（如 10.1.92.33）
  viteFinal: async (config: ViteConfig) => {
    config.root = process.cwd();
    config.server = {
      ...(config.server ?? {}),
      host: "10.1.92.33",
      strictPort: true,
      // 允许任意主机访问（Storybook 跨主机预览更稳妥）
      allowedHosts: true,
      // 使用默认 HMR 与 origin 设置，由 Storybook/vite 管理端口与代理
      // 允许从 monorepo 根与 .storybook 目录读取配置与资源，避免 404
      fs: {
        ...(config.server?.fs ?? {}),
        allow: [
          // 允许读取 monorepo 根目录与关键子目录（apps/storybook 相对仓库根）
          resolve(process.cwd(), "../../"),
          resolve(process.cwd(), "../../.storybook"),
          resolve(process.cwd(), "../../packages"),
          resolve(process.cwd(), "../../src"),
        ],
      },
    };
    // 保留工作区包与样式别名，避免干扰 Storybook 的内部虚拟模块解析
    config.root = process.cwd();
    config.resolve = {
      ...(config.resolve ?? {}),
      alias: {
        ...(config.resolve?.alias ?? {}),
        // 将工作区包映射到源码，避免依赖 dist 构建
        '@jackery/i18n': resolve(process.cwd(), '../../packages/i18n/src/index.ts'),
        '@jackery/core': resolve(process.cwd(), '../../packages/core/src/index.ts'),
        '@jackery/icons': resolve(process.cwd(), '../../packages/icons/src/index.ts'),
        '@jackery/utils': resolve(process.cwd(), '../../packages/utils/src/index.ts'),
        // 全局样式别名，指向绝对路径以触发 /@fs 解析
        'jds:styles': resolve(process.cwd(), '../../src/styles/index.less'),
        // 修正 Storybook 在非仓库根作为 dev root 时对 preview.ts 的动态导入
        '/.storybook/preview.ts': resolve(process.cwd(), '../../.storybook/preview.ts'),
        '/.storybook/preview.js': resolve(process.cwd(), '../../.storybook/preview.ts'),
      },
    };
    // 避免工作区包被 Vite 预构建处理（使用源码）
    config.optimizeDeps = {
      ...(config.optimizeDeps ?? {}),
      exclude: [
        ...((config.optimizeDeps?.exclude ?? []) as string[]),
        '@jackery/i18n',
        '@jackery/core',
        '@jackery/icons',
        '@jackery/utils',
      ],
    } as ViteConfig['optimizeDeps'];
    // 移除压缩插件以避免在 Storybook 预览构建阶段的 ENOENT 报错
    config.plugins = (config.plugins ?? []).filter((p: any) => p?.name !== 'vite:compression');
    // 移除将 storybook/internal 标记为 external 的错误设置，避免无法解析虚拟模块
    return config;
  },
};

export default config;
