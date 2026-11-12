
![Logo](./public/logo.png)

## 1. 简介

- **全称：** AIYAZONE Design System - AIYAZONE 设计系统
- **简写：** ZDS
- **介绍：** 作为通用设计系统，按照前端规范，基于 Web Components + Vite + Lit + Storybook 设计实现跨技术栈的 Web 端基础库。采用 Monorepo 架构，包含核心组件、图标库、国际化和工具函数四个独立包。
- **目标：** Shoelace/Spectrum/Baklava
- **仓库：** [https://github.com/AIYAZONE/design-system](https://github.com/AIYAZONE/design-system)
- **文档站点：** [https://design.aiyazone.com](https://design.aiyazone.com)

## 1.1 项目定位

- 定位：设计语言与通用组件的唯一来源；业务逻辑不进入本设计系统
- 下游依赖：业务站点、前端渲染层

## 1.2 项目目录结构

```text
design-system/
├─ apps/                 示例与预览工程
│  ├─ examples/         组件演示与联调示例站
│  ├─ portal/           站点预览（文档/演示）
│  ├─ storybook/        Storybook 项目
│  ├─ styles/           示例站公共样式
│  └─ index.ts          示例入口聚合
├─ packages/            Monorepo 子包
│  ├─ core/             核心 Web Components 组件库
│  ├─ icons/            SVG 图标库与 Storybook
│  ├─ i18n/             国际化能力（window.i18n）
│  └─ utils/            通用工具函数
├─ src/                 设计系统根入口与样式
│  ├─ styles/           全局样式与主题
│  │  ├─ themes/v1,v2,v3  主题样式与 Tokens
│  │  ├─ zone/          公共样式、重置、RTE
│  │  └─ animate/      动效示例
│  ├─ index.ts         根入口，导出并注册
│  └─ register.ts      组件注册
├─ docs/                令牌与文档（MD/MDX）
├─ public/              预览页与静态资源
├─ scripts/             构建辅助脚本
├─ .storybook/          Storybook 配置
├─ .changeset/          版本变更集
├─ package.json         根包配置
├─ pnpm-workspace.yaml  工作区声明
└─ README.md            项目说明
```

- apps/examples：用于组件联调与预览，入口示例见 [main.ts](./apps/examples/main.ts) 与页面 [pages](./apps/examples/pages)。
- packages/core：核心组件按 `components/<name>` 组织，每个组件包含 `index.ts`、`index.less`、`stories` 与 `__tests__`，如 [button](./packages/core/src/components/button)。
- src/styles：全局样式唯一来源，入口为 [index.less](./src/styles/index.less)，主题分为 [themes/v1](./src/styles/themes/v1)、[themes/v2](./src/styles/themes/v2) 与 [themes/v3](./src/styles/themes/v3)。
- docs：包含设计令牌与规范说明（MD/MDX），如 [tokens](./docs/tokens)。

## 2. 目标

- 兼容所有框架
- CDN 部署
- 可通过 CSS 完全自定义
- 包含深浅两个主题
- 无障碍优先

## 3. 发布与部署

- 组件库：直接发布到 npm 公网仓库（作用域 `@zone`），包名 `@zone/design-system`；CDN 引用走 jsDelivr / unpkg（见 5.2）
- 文档站点：静态产物部署到 GitHub Pages，绑定自定义域名 `design.aiyazone.com`

## 4. 包结构

ZDS 采用 Monorepo 架构，包含以下独立包：

### 📦 @zone/core
- **用途**: 核心 Web Components 组件
- **包含**: Button, Badge, Dialog, Popover, Spinner, Toast, Tooltip
- **安装**: `npm install @zone/core`
- **样式策略**: 组件样式以内联方式注入（`index.less?inline`）；不再自动注入核心包的全局样式，项目需在入口显式引入设计系统样式（见下文）。

### 🎨 @zone/icons
- **用途**: 图标库，提供 87+ 个 SVG 图标
- **特性**: 支持按需导入、Tree-shaking、多种尺寸和颜色
- **安装**: `npm install @zone/icons`
- **使用**: `import { ArrowRight, AlertFill } from '@zone/icons'`

### 🌍 @zone/i18n
- **用途**: 国际化功能
- **包含**: 核心 i18n 功能、装饰器、语言包
- **安装**: `npm install @zone/i18n`

### 🔧 @zone/utils
- **用途**: 通用工具函数
- **包含**: DOM 操作、事件处理、表单控制、通用工具
- **安装**: `npm install @zone/utils`

## 5. 使用

### 5.1 依赖引用

1. 命令安装：

```cmd
npm i @zone/design-system --save
```

### 5.2 CDN 引用（基于 npm 公网包）

本项目不维护自有 CDN。包发布到 npm 公网仓库后，可直接使用 jsDelivr 或 unpkg 提供的免费 CDN 链接：

1. 最新版本（jsDelivr）：

```html
<link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/npm/@zone/design-system@latest/dist/index.css">
<script type="module" crossorigin src="https://cdn.jsdelivr.net/npm/@zone/design-system@latest/dist/index.esm.js"></script>
```

2. 锁定特定版本（unpkg）：

```html
<link rel="stylesheet" crossorigin href="https://unpkg.com/@zone/design-system@0.1.0/dist/index.css">
<script type="module" crossorigin src="https://unpkg.com/@zone/design-system@0.1.0/dist/index.esm.js"></script>
```

> 说明：版本号需与 npm 上实际发布的版本一致；生产环境建议锁定明确版本而非 `@latest`。

### 5.3 样式使用规范（最新）

- **全局样式唯一来源**: 在项目入口显式引入 `src/styles/index.less`，统一加载字体、设计令牌、重置、公共样式与动效。
  - 示例：`apps/examples/main.ts:3` `import '../../src/styles/index.less';`
- **组件样式**: 组件内仅以 `index.less?inline` 注入结构样式，使用 `:root` 的 CSS 变量（由全局样式注入）进行主题化，无需在组件内再 `@import` 全局文件。
- **核心包不再自动注入全局样式**: `@zone/core` 的入口不再引入 `packages/core/src/styles/index.css`，避免与 `src/styles` 的重复与冲突。
- **路径别名**: 推荐在 Vite 配置中添加 `@styles -> src/styles`，统一引用全局样式。

### 5.5 国际化使用指南（HTML 与脚手架通用）

- 引入一次即可自动初始化并挂载到 `window.i18n`：

```ts
import '@zone/design-system';
// 现在可直接使用 window.i18n
window.i18n.t('common.ok');
```

- 声明式翻译（纯 HTML）：

```html
<span data-i18n-key="common.yes"></span>
<p data-i18n-key="common.welcome" data-i18n-params='{"name":"World"}'></p>
```

- 模板字符串形式（纯文本节点内）：

```html
<p title="${window.i18n.t('common.ok')}">common.ok:${window.i18n.t('common.ok')}</p>
```

  - 初次加载会替换为对应语言；切换语言后会自动重新扫描并更新。

- 切换语言：

```js
window.i18n.setCurrLanguage('ja');
```

说明：`@zone/i18n` 在入口已自动执行 `initialize()` 与 `initI18nDom()`，无需手动初始化。

### 5.4 开发环境 Vite 别名

在根站点与示例站的 `vite.config` 中添加：

```js
// 根站点 vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@zone/core': path.resolve(__dirname, 'packages/core/src'),
    '@zone/icons': path.resolve(__dirname, 'packages/icons/src'),
    '@zone/i18n': path.resolve(__dirname, 'packages/i18n/src'),
    '@zone/utils': path.resolve(__dirname, 'packages/utils/src'),
  }
}
```

```js
// 示例站 apps/examples/vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, '../../src'),
    '@styles': path.resolve(__dirname, '../../src/styles'),
    '@zone/core': path.resolve(__dirname, '../../packages/core/src'),
    '@zone/icons': path.resolve(__dirname, '../../packages/icons/src'),
    '@zone/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
    '@zone/utils': path.resolve(__dirname, '../../packages/utils/src'),
  }
}
```

入口示例：

```ts
// 统一加载全局样式
import '@styles/index.less';
// 加载组件与图标
import '@zone/core';
import '@zone/icons';
```

## 6. 业界优秀实践

站在巨人的肩膀上看世界，业界优秀实践参考：

![优秀实践参考](./public/design-system.png)

## 7. 构建与预览

- 构建库产物：`pnpm run design:build:lib`
- 构建主题样式：`pnpm run design:build:themes`
- 本地联调 watch（持续产出 dist）：
  - JS：`pnpm run design:watch:lib`
  - CSS（主题/基础样式）：`pnpm run design:watch:themes`
- 预览构建目录：`pnpm run site:preview -- --port 5175`
- 验证页：`dist/index.html`，支持 `?theme=v1|v2` 切换，示例地址 `http://localhost:5175/index.html?theme=v2`

### 打包格式
- `dist/index.esm.js`：ES Modules，适合浏览器与现代打包器（推荐）
- `dist/index.cjs`：CommonJS，适合 Node/老旧打包器
- 类型声明：`dist/zone.d.ts`

### 发布产物（NPM 包内文件）

- JS：`dist/index.esm.js`、`dist/index.cjs`、`dist/chunks/**`
- CSS：`dist/index.css`、`dist/index-v2.css`
- 资产：`dist/fonts/**`、`dist/assets/**`
- 类型：`dist/zone.d.ts`、`dist/**/*.d.ts`
- 说明：不包含 `public/**`、Storybook 或站点预览文件。

### 按需引入组件
- 在应用中仅导入需要的组件入口（打包器会按需包含）：
  - `import '@zone/core/components/button'`
  - `import '@zone/core/components/dialog'`
  - 其它：`badge`、`popover`、`spinner`、`toast`、`tooltip`
- 图标库副作用注册：`import '@zone/icons'`，图标按需通过懒加载 chunk 引入

## 8. 发布到 npm 公网

### 发布根包 @zone/design-system
- 确认 `.npmrc` 使用公网仓库：`registry=https://registry.npmjs.com/`
- 登录：`npm login`
- 一键构建并发布：`pnpm run publish:design-system`
- 版本冲突（`EPUBLISHCONFLICT`）时：`npm version patch --no-git-tag-version` → `pnpm run publish:design-system`
- 说明：脚本等价于 `pnpm run design:build && npm publish --access public`

### 发布子包（两种方式）
- 变更集（推荐）：
  - `pnpm run build`
  - `pnpm run changeset:status`
  - `pnpm run version-packages`
  - `pnpm run release`
- 工作区逐个发布：
  - `npm publish --workspace @zone/core --access public`
  - `npm publish --workspace @zone/utils --access public`
  - `npm publish --workspace @zone/i18n --access public`
  - `npm publish --workspace @zone/icons --access public`

### 快速排查
- 当前仓库地址：`npm config get registry`
- 登录校验：`npm publish` 如报 `ENEEDAUTH` 则需先 `npm login`
- 冲突处理：`EPUBLISHCONFLICT` 时先升版再发布

### 整包 vs 子包说明
- 依赖 `@zone/design-system` 整包时通常不需要单独发布子包；子包仅在你直接按包名引入时需要发布。
