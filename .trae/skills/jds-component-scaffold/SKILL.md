---
name: "jds-component-scaffold"
description: "按 JDS 规范创建新组件骨架（Lit+Less+Stories+Tests）。当用户请求新增组件或生成组件模板时触发。"
---

# JDS 组件脚手架

## 目标
- 在 `packages/core/src/components/<name>/` 按 JDS 规范生成一个可用的组件骨架
- 同步生成样式、测试（unit/interaction/a11y）与 Storybook 示例

## 输出
- 目录：`packages/core/src/components/<name>/`
- 文件：
  - `index.ts`：Lit 组件实现（`index.less?inline` + `unsafeCSS`，`adoptInternalStyles`）
  - `index.less`：仅使用 `:root` 变量 `var(--jds-...)`，不引入全局样式
  - `__tests__/<name>.test.ts`：渲染与属性、事件
  - `__tests__/<name>.interaction.test.ts`：交互与键盘（`@testing-library/user-event`）
  - `__tests__/<name>.a11y.test.ts`：axe-core 无障碍校验
  - `jds-<name>.stories.ts`：Storybook 示例
- 导出：在 [index.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/index.ts) 中添加导出

## 组件约束
- 样式：`import styles from './index.less?inline'`，`static styles = unsafeCSS(styles)`
- 仅依赖 `:root` 变量；禁止在组件内 `@import` 全局
- 无障碍：提供可访问名称（`label` 或 `aria-label`），链接模式需 `role="button"` 与 `rel="noopener noreferrer"`
- 事件：组件内派发自定义事件需 `bubbles: true, composed: true`
- 主题：遵循 `src/styles/themes/v1|v2|v3` 的版本化策略

## 测试约束
- 框架：Vitest（jsdom），依赖 `@testing-library/dom`、`@testing-library/user-event`、`axe-core`
- 结构：
  - `<name>.test.ts`：静态渲染、属性映射、事件
  - `<name>.interaction.test.ts`：点击/键盘、禁用/加载阻止
  - `<name>.a11y.test.ts`：axe 校验、语义属性
- 工具：使用 [utils.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/utils.ts) 的 `mount` 与 `waitUpdate`

## Storybook 约束
- `title` 采用“03 基础组件/jds-<name>”风格
- 展示 variant/kind/size 等基础属性，并给出 icon-only 的可访问名称示例
- 使用 `unsafeHTML` 渲染演示文本时确保来源受控

## 步骤
1. 创建目录与文件骨架（按上文输出）
2. 在 `index.ts` 写入最小属性与交互（参照 [button/index.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts)）
3. 在 `index.less` 引用 `var(--jds-...)` 变量并使用 tokens
4. 编写三类测试并保证通过
5. 添加 Storybook 示例并本地预览
6. 在 `packages/core/src/index.ts` 导出新组件

## 示例触发语句
- “新增 Input 组件，按 JDS 模板生成，带 tests + stories”
- “为 Tooltip 创建规范骨架，包含 a11y 与交互测试”

