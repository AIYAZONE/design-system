# 按钮组件样式重构方案：简化变量层级

目前的问题在于 CSS 变量层级过深 (`Global -> Component Token -> Local Var -> Property`)，导致文件冗长且难以维护。

我的方案旨在**扁平化**这一结构，移除中间冗余层，同时保持多主题能力。

## 方案核心思路

1. **移除 "Local Variable" 层**：组件内部不再定义 `--main-color` 这种中间变量，直接使用 `--jds-btn-xxx` 或全局语义变量。
2. **精简 "Component Token" 层**：非必要的组件级变量（如 `border-radius` 若永远跟随全局 `pill`）直接使用全局变量，不再单独定义组件变量。
3. **保留必要的 "Component Token"**：仅保留那些真正需要在不同主题中独立变化的变量（如按钮的主色、Padding 等）。

## 具体实施步骤

### 第一步：清理组件内部的 Local Variables

在 `packages/core/src/components/button/index.less` 中：

1. **删除** `.button` 类中大量的 CSS 变量映射代码（第 14-30 行）。
2. **直接引用**：将属性值改为直接使用组件 Token 或全局 Token。

   * 修改前：`background-color: var(--bg-color);` (依赖 `--bg-color` -> `--jds-btn-bg-color`)

   * 修改后：`background-color: var(--jds-btn-bg-color, var(--jds-color-primary));`
3. **简化变体逻辑**：

   * 对于 `kind="danger"` 等变体，不再重定义局部变量 `--main-color`，而是直接覆盖属性：

     ```css
     :host([kind="danger"]) .button {
       --jds-btn-bg-color: var(--jds-color-danger);
       --jds-btn-border-color: var(--jds-color-danger);
     }
     ```

     或者（如果移除了 Local Var）：

     ```css
     :host([kind="danger"]) .button {
       background-color: var(--jds-color-danger);
       border-color: var(--jds-color-danger);
     }
     ```

### 第二步：精简 Theme Token 文件

在 `src/styles/themes/v1/tokens/button.less` 中：

1. **审计并移除冗余变量**：

   * 例如 `--jds-btn-border-radius` 如果在 v1/v2 中都是圆角，直接在组件里写 `var(--jds-rounded-pill)`，删除该 Token。

     * v1中是圆角，v2中是直角，不确定其他版本主题是否圆角，可保留此变量`--jds-btn-border-radius`

   * 仅保留\*\*"主题间确实会变化"\*\*的属性作为 Token。

### 第三步：(可选) 使用 CSS Shadow Parts

如果希望彻底解耦，可以将样式完全移出组件：

1. 组件内：`<div part="button">...</div>`
2. 主题文件内：`jds-button::part(button) { background: red; }`
   *注：这是一个较大的架构变更，建议先执行前两步。*

## 预期效果

* `index.less` 代码量减少 30% 以上。

* 阅读代码时不再需要跨 3 个层级查找变量定义。

* 新增主题时，只需关注核心 Token，无需复制大量映射代码。

请确认是否按照此方案进行重构（主要执行第一步和第二步），第三步不执行。
