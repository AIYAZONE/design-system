<a href="https://design.aiyazone.com/">
  <img src="https://raw.githubusercontent.com/AIYAZONE/design-system/master/public/logo.svg" alt="AIYAZONE DESIGN SYSTEM" width="206" height="44">
</a>

# AIYAZONE Design System

[简体中文](./README.md) · [English](./README.en.md)

ZDS 是 AIYAZONE 的 Web 设计系统，提供设计令牌、基于 Lit 的 Web Components、图标和多语言能力。适用于原生 HTML 和框架项目，业务数据与页面流程由接入方管理。

[![CI](https://github.com/AIYAZONE/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/AIYAZONE/design-system/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@aiyazone/design-system?label=design-system)](https://www.npmjs.com/package/@aiyazone/design-system)
[![tokens](https://img.shields.io/npm/v/@aiyazone/tokens?label=tokens)](https://www.npmjs.com/package/@aiyazone/tokens)

[文档首页](https://design.aiyazone.com/) · [组件](https://design.aiyazone.com/storybook/) · [图标](https://design.aiyazone.com/icons/) · [页面示例](https://design.aiyazone.com/examples/) · [AI 使用指南](https://design.aiyazone.com/ai-usage.html) · [架构全景](https://design.aiyazone.com/architecture.html)

## 提供什么

| 能力 | 内容 |
| --- | --- |
| 组件 | 按钮、选择器、弹窗、提示等 `zone-*` 自定义元素；[完整 API](./docs/api/README.md) |
| 设计令牌与主题 | 颜色、字号、间距等令牌，以及 v1、v2、v3 主题 CSS |
| 图标 | 使用 `<zone-icon>` 加载 SVG 图标 |
| 多语言 | 翻译 API、声明式 DOM 翻译与语言切换 |
| AI 参考资料 | [llms.txt](https://design.aiyazone.com/llms.txt)、[llms-full.txt](https://design.aiyazone.com/llms-full.txt) 与组件 API |

## 快速接入

### npm 项目

```bash
npm install @aiyazone/design-system lit
```

在应用入口注册组件，并加载一个主题：

```ts
import '@aiyazone/design-system';
import '@aiyazone/design-system/index-v3.css';
```

在页面或框架模板中使用：

```html
<zone-button variant="primary" icon="arrow-right">开始使用</zone-button>
```

npm 入口共享应用安装的 Lit 3，需要打包器解析依赖。框架中的自定义元素配置、事件绑定与复杂属性赋值，应按框架规则处理。

### CDN 静态页面

无需构建工具，将以下内容保存为 HTML 即可使用。示例固定使用已发布并验证的 `0.4.1`；JS 与 CSS 保持同一版本。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ZDS 示例</title>
    <link rel="stylesheet" crossorigin
      href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.4.1/dist/index-v3.css">
    <script type="module" crossorigin
      src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.4.1/dist/cdn/index.js"></script>
  </head>
  <body>
    <zone-button variant="primary" icon="arrow-right">开始使用</zone-button>
  </body>
</html>
```

CDN 入口自带 Lit、组件、图标和翻译，无需 import map；unpkg 可使用相同的包版本及文件路径。同一页面选择 npm 或 CDN 一种方式。升级与回退见 [接入说明](./docs/usage.md#版本与回退)。

### 只使用设计令牌

```bash
npm install @aiyazone/tokens
```

```ts
import '@aiyazone/tokens/dist/tokens.css';
```

令牌包不依赖组件或 Lit；令牌名称与生成物见 [令牌文档](./docs/tokens)。

## 接入须知

- 对外只发布 `@aiyazone/design-system` 和 `@aiyazone/tokens`；core、icons、i18n、utils 为内部模块，外部应用使用总包入口。
- 组件外观通过公开属性和 CSS 变量调整；Shadow DOM 内部类名不属于稳定接口。
- v1、v2、v3 是主题版本，切换方式见 [主题与样式](./docs/usage.md#主题与样式)。
- AI 资料用于提供组件与令牌参考；生成页面仍需检查实际交互、响应式布局和无障碍。

## 本地开发

使用 Node.js 22.13+（CI 使用 Node 22）与 pnpm 10.28.0，在仓库根目录执行：

```bash
corepack enable
pnpm install
pnpm --filter @aiyazone/portal dev
```

| 命令 | 用途 |
| --- | --- |
| `pnpm storybook` | 启动组件文档 |
| `pnpm design:build` | 构建 npm、CDN、类型与主题产物 |
| `pnpm portal:build:all` | 构建完整文档站 |
| `pnpm lint && pnpm type-check && pnpm test` | 检查源码 |
| `pnpm packages:test:browser` | 检查已打包组件的独立安装与三尺寸浏览器行为；需先构建并安装 Chromium |

构建顺序、完整检查和发布方式见 [开发与发布](./docs/development.md)。

## 仓库结构

```text
apps/
  portal/       文档门户、架构全景与 AI 示例
  storybook/    组件文档
  examples/     页面与组件示例
packages/
  core/         Web Components
  icons/        SVG 图标
  i18n/         多语言
  utils/        内部工具
  tokens/       设计令牌源与生成物
src/            总包入口与全局主题样式
docs/           接入说明、API、令牌与路线
scripts/        构建、验证与发布辅助脚本
```

项目进度与后续计划见 [ROADMAP](./docs/ROADMAP.md)。
