
![Logo](./public/logo.png)

## 1. 简介

- **全称：** Jackery Design System - Jackery设计系统
- **简写：** JDS
- **介绍：** 作为全球官网中心前端设计系统，按照前端规范，基于Web Components + Vite + Lit + Storybook设计实现跨技术栈的Web端基础库。采用 Monorepo 架构，包含核心组件、图标库、国际化和工具函数四个独立包。
- **目标：** Shoelace/Spectrum/Baklava
- **仓库：** [http://192.168.30.241/global-website/jackery-design-system](http://192.168.30.241/global-website/jackery-design-system)
- **设计：**
  - [Figma - 基础UED - v1.0](https://www.figma.com/design/LI5xCizwANfYUQC0kub9B6/%E5%9F%BA%E7%A1%80UED%E8%A7%84%E8%8C%83)
  - [Figma - 基础UED - v2.1](https://www.figma.com/design/LI5xCizwANfYUQC0kub9B6/%E5%9F%BA%E7%A1%80UED%E8%A7%84%E8%8C%83?node-id=1108-1702&t=ptn5VD9j0Cx3DvgW-0)
  - [蓝湖 - 基础UED - v1.0](https://lanhuapp.com/web/#/item/project/stage?pid=a94d0246-a761-4bb0-947a-0616453550db&image_id=ab01c062-3104-4e5f-978a-b7298e8adf75)
  - [Figma - UED控件库 - v1.0](https://www.figma.com/design/xRSdg9dwrFbNMQz1zQVaaE/UED%E6%8E%A7%E4%BB%B6%E5%BA%93)

- **文档：** [前端知识库 - Jackery Design System](https://alidocs.dingtalk.com/i/nodes/o14dA3GK8g5nRwgwHoanD4XgV9ekBD76)

## 2. 目标

- 兼容所有框架
- CDN部署
- 可通过CSS完全自定义
- 包含深浅两个主题
- 无障碍优先

## 3. 部署

- 公司内网 npm 仓库（作用域 `@jackery`）：
  - 生产：`https://nexus.hijackery.cn/repository/npm-private/`
  - UAT：`https://nexus.hijackery.cn/repository/npm-private-stage/`
  - 开发：`https://nexus.hijackery.cn/repository/npm-private-dev/`
  - 测试：`https://nexus.hijackery.cn/repository/npm-private-test/`
  - 包名：`@jackery/design-system`

## 4. 包结构

JDS 采用 Monorepo 架构，包含以下独立包：

### 📦 @jackery/core
- **用途**: 核心 Web Components 组件
- **包含**: Button, Badge, Dialog, Popover, Spinner, Toast, Tooltip
- **安装**: `npm install @jackery/core`
 - **样式策略**: 组件样式以内联方式注入（`index.less?inline`）；不再自动注入核心包的全局样式，项目需在入口显式引入设计系统样式（见下文）。

### 🎨 @jackery/icons
- **用途**: 图标库，提供 87+ 个 SVG 图标
- **特性**: 支持按需导入、Tree-shaking、多种尺寸和颜色
- **安装**: `npm install @jackery/icons`
- **使用**: `import { ArrowRight, AlertFill } from '@jackery/icons'`

### 🌍 @jackery/i18n
- **用途**: 国际化功能
- **包含**: 核心 i18n 功能、装饰器、语言包
- **安装**: `npm install @jackery/i18n`

### 🔧 @jackery/utils
- **用途**: 通用工具函数
- **包含**: DOM 操作、事件处理、表单控制、通用工具
- **安装**: `npm install @jackery/utils`

## 5. 使用

### 5.1 依赖引用

1. 系统目录`C:\Users\本机名\.npmrc` 或前端项目根目录新增 `.npmrc` 文件，内容如下：

  ```text
  # 默认使用npm公网仓库
  registry=https://registry.npmjs.com/

  # === @jackery前缀组件库，使用公司 npm 仓库 === #
  # PROD生产环境使用
  #@jackery:registry=https://nexus.hijackery.cn/repository/npm-private/

  # UAT验收环境使用
  #@jackery:registry=https://nexus.hijackery.cn/repository/npm-private-stage/

  # DEV开发环境使用
  @jackery:registry=https://nexus.hijackery.cn/repository/npm-private-dev/

  ```

2. 命令安装：

  ```cmd
  npm i @jackery/design-system --save
  ```

### 5.2 CDN引用

1. 最新版本：

  ```html
  <link rel="stylesheet" crossorigin href="https://f2e-cdn.jackery.com/@jackery/design-system/latest/dist/index.css">
  <script type="module" crossorigin src="https://f2e-cdn.jackery.com/@jackery/design-system/latest/dist/index.esm.js"></script>
  ```

2. 特定版本：

  ```html
  <link rel="stylesheet" crossorigin href="https://f2e-cdn.jackery.com/@jackery/design-system/0.1.0/dist/index.css">
  <script type="module" crossorigin src="https://f2e-cdn.jackery.com/@jackery/design-system/0.1.0/dist/index.esm.js"></script>
  ```

### 5.3 样式使用规范（最新）

- **全局样式唯一来源**: 在项目入口显式引入 `src/styles/index.less`，统一加载字体、设计令牌、重置、公共样式与动效。
  - 示例：`apps/examples/main.ts:3` `import '../../src/styles/index.less';`
- **组件样式**: 组件内仅以 `index.less?inline` 注入结构样式，使用 `:root` 的 CSS 变量（由全局样式注入）进行主题化，无需在组件内再 `@import` 全局文件。
- **核心包不再自动注入全局样式**: `@jackery/core` 的入口不再引入 `packages/core/src/styles/index.css`，避免与 `src/styles` 的重复与冲突。
- **路径别名**: 推荐在 Vite 配置中添加 `@styles -> src/styles`，统一引用全局样式。

### 5.5 国际化使用指南（HTML 与脚手架通用）

- 引入一次即可自动初始化并挂载到 `window.i18n`：

  ```ts
  import '@jackery/design-system';
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

说明：`@jackery/i18n` 在入口已自动执行 `initialize()` 与 `initI18nDom()`，无需手动初始化。

### 5.4 开发环境 Vite 别名

在根站点与示例站的 `vite.config` 中添加：

```js
// 根站点 vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@jackery/core': path.resolve(__dirname, 'packages/core/src'),
    '@jackery/icons': path.resolve(__dirname, 'packages/icons/src'),
    '@jackery/i18n': path.resolve(__dirname, 'packages/i18n/src'),
    '@jackery/utils': path.resolve(__dirname, 'packages/utils/src'),
  }
}
```

```js
// 示例站 apps/examples/vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, '../../src'),
    '@styles': path.resolve(__dirname, '../../src/styles'),
    '@jackery/core': path.resolve(__dirname, '../../packages/core/src'),
    '@jackery/icons': path.resolve(__dirname, '../../packages/icons/src'),
    '@jackery/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
    '@jackery/utils': path.resolve(__dirname, '../../packages/utils/src'),
  }
}
```

入口示例：

```ts
// 统一加载全局样式
import '@styles/index.less';
// 加载组件与图标
import '@jackery/core';
import '@jackery/icons';
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
- 类型声明：`dist/jds.d.ts`

### 发布产物（NPM 包内文件）

- JS：`dist/index.esm.js`、`dist/index.cjs`、`dist/chunks/**`
- CSS：`dist/index.css`、`dist/index-v2.css`
- 资产：`dist/fonts/**`、`dist/assets/**`
- 类型：`dist/jds.d.ts`、`dist/**/*.d.ts`
- 说明：不包含 `public/**`、Storybook 或站点预览文件。

### 按需引入组件
- 在应用中仅导入需要的组件入口（打包器会按需包含）：
  - `import '@jackery/core/components/button'`
  - `import '@jackery/core/components/dialog'`
  - 其它：`badge`、`popover`、`spinner`、`toast`、`tooltip`
- 图标库副作用注册：`import '@jackery/icons'`，图标按需通过懒加载 chunk 引入

## 8. 发布到私仓

### 作用域仓库配置
- 在用户级 `C:\Users\<你的用户名>\.npmrc` 维护作用域仓库：
  ```ini
  registry=https://registry.npmjs.com/
  @jackery:registry=https://nexus.hijackery.cn/repository/npm-private-test/
  //nexus.hijackery.cn/repository/npm-private-test/:_authToken=<你的token>
  always-auth=true
  ```
- 项目不固定仓库地址，发布时自动读取用户 `.npmrc` 的 `@jackery:registry` 映射。

### 发布根包 @jackery/design-system
 - 首次登录：`npm adduser --registry https://nexus.hijackery.cn/repository/npm-private-test/`
 - 发布：`npm publish --access public`
 - 版本已存在时：
   - `npm version patch --no-git-tag-version`
   - `npm publish --access public`

### 公开 NPM 发布（根包）
 - 确认使用公网仓库：在用户级 `.npmrc` 注释或移除 `@jackery:registry` 的私仓映射，确保 `registry=https://registry.npmjs.com/`
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
  - `npm publish --workspace @jackery/core --access restricted`
  - `npm publish --workspace @jackery/utils --access restricted`
  - `npm publish --workspace @jackery/i18n --access restricted`
  - `npm publish --workspace @jackery/icons --access public`

### 环境与发布命令清单

#### `.npmrc` 作用域与环境映射

```ini
registry=https://registry.npmjs.com/

# 生产
#@jackery:registry=https://nexus.hijackery.cn/repository/npm-private/

# UAT
#@jackery:registry=https://nexus.hijackery.cn/repository/npm-private-stage/

# 开发
@jackery:registry=https://nexus.hijackery.cn/repository/npm-private-dev/

# 测试
@jackery:registry=https://nexus.hijackery.cn/repository/npm-private-test/

# 可选：
#always-auth=true
#//nexus.hijackery.cn/repository/npm-private-test/:_authToken=<你的token>
```

说明：命令不带 `--registry`，按用户级 `.npmrc` 自动选择环境。

#### Test/Dev（支持同版本覆盖）
- 根包：
  - 登录：`npm adduser --registry https://nexus.hijackery.cn/repository/npm-private-test/` 或在 `.npmrc` 写入 token
  - 发布：`npm publish --access public`
- 子包逐个：
  - `npm publish --workspace @jackery/core --access restricted`
  - `npm publish --workspace @jackery/utils --access restricted`
  - `npm publish --workspace @jackery/i18n --access restricted`
  - `npm publish --workspace @jackery/icons --access public`
- 批量（Changesets）：
  - `pnpm run build` → `pnpm run changeset:status` → `pnpm run version-packages` → `pnpm run release`

#### 生产（建议升版发布）
- 切换 `.npmrc` 到生产地址
- 根包：
  - `npm adduser --registry https://nexus.hijackery.cn/repository/npm-private/`
  - `npm version patch --no-git-tag-version`
  - `npm publish --access public`
- 子包逐个：
  - `npm version patch --workspace @jackery/core --no-git-tag-version` → `npm publish --workspace @jackery/core --access restricted`
  - `npm version patch --workspace @jackery/utils --no-git-tag-version` → `npm publish --workspace @jackery/utils --access restricted`
  - `npm version patch --workspace @jackery/i18n --no-git-tag-version` → `npm publish --workspace @jackery/i18n --access restricted`
  - `npm version patch --workspace @jackery/icons --no-git-tag-version` → `npm publish --workspace @jackery/icons --access public`
- 批量（Changesets）：同上

#### 快速排查
- 当前作用域仓库：`npm config get @jackery:registry`
- 登录校验：`npm publish` 如报 `ENEEDAUTH` 则需登录或配置 token
- 冲突处理：`EPUBLISHCONFLICT` 时先升版再发布

#### 整包 vs 子包说明
- 依赖 `@jackery/design-system` 整包时通常不需要单独发布子包；子包仅在你直接按包名引入时需要发布。
