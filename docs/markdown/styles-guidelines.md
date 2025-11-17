# JDS 样式使用规范（最新版）

## 全局样式唯一来源
- 统一在项目入口引入 `src/styles/index.less`，集中加载字体、设计令牌（tokens）、重置（normalize/reset）、公共样式、富文本与动效。
- 示例入口：`apps/examples/main.ts`
  - `import '../../src/styles/index.less'`

## 组件样式模型
- 组件样式以 `index.less?inline` 注入到 `static styles`，由组件自身携带结构与状态样式。
- 主题与品牌通过 `:root` 的 CSS 变量驱动，组件内使用 `var(--jds-...)` 引用，不在组件样式中再 `@import` 全局文件。
- 避免硬编码色值和尺寸，统一使用变量：如 `var(--jds-color-primary)`、`var(--jds-size-16)`、`var(--jds-font-b1-medium)`。

## 核心包样式策略调整
- 不再在 `@jackery/core` 入口自动注入 `packages/core/src/styles/index.css`，防止与 `src/styles` 的重复与冲突。
- 移除 `packages/core/src/styles/index.css` 与 `packages/core/src/styles/internal.less`，样式令牌以 `src/styles` 为唯一来源。

## 路径别名与入口示例
- 在 Vite 中添加 `@styles` 指向 `src/styles`，统一引用：

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

入口代码示例：

```ts
// 统一加载全局样式
import '@styles/index.less';
// 加载组件与图标
import '@jackery/core';
import '@jackery/icons';
```

## 组件开发指引
- 新增组件在 `packages/core/src/components/` 下创建 `index.ts` 与 `index.less`；样式通过 `index.less?inline` 注入。
- 仅使用 `:root` 变量，不引入全局 Less 文件；如需新变量，请在 `src/styles/jds/tokens.less` 定义并通过 `src/styles/index.less` 注入。
- 不在组件内定义全局作用的变量，避免污染与冲突。

## 迁移要点（从旧结构）
- 删除核心包样式目录内的全局样式与内部令牌文件（`index.css`、`internal.less`）。
- 将项目统一指向并引入 `src/styles/index.less`。
- 检查组件样式，移除对内部令牌的依赖，改为 `var(--jds-...)`。
- 在 Vite 中添加 `@styles` 别名，统一入口引入与引用路径。

## 验证
- 开发服务器：示例站 `pnpm -w --filter @jackery/examples dev`。
- 页面验证：`http://localhost:5175/pages/atoms/button.html`、`http://localhost:5175/pages/atoms/dialog.html`。
- 检查 `:root` 变量是否来自 `src/styles/jds/tokens.less`，组件是否仅依赖变量且表现正确。