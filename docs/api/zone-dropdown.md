# `<zone-dropdown>` · ZoneDropdown

> 单选下拉框；数据包含子节点时自动启用树形列表。

- **标签**：`<zone-dropdown>`
- **实现**：`ZoneDropdown`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/dropdown`
- **测试**：29 个用例
- **包**：`@aiyazone/core@0.1.9`

## 快速使用

```html
<!-- 1. 注册组件 -->
<script type="module">import '@aiyazone/core';</script>

<!-- 2. 主题令牌（仅令牌用 tokens.css；完整主题用 index-v3.css） -->
<link rel="stylesheet" href="@aiyazone/tokens/dist/tokens.css">

<!-- 3. 使用 -->
<zone-dropdown>内容</zone-dropdown>
```

## 仅 JS 属性（无对应 attribute）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | `DropdownOption[]` | `[]` | / export class ZoneDropdown extends LitElement { static styles = unsafeCSS(styles); static formAssociated = true; /** 通过 JavaScript 属性赋值，例如 element.options = [...]。 |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-color-bg-200: /* 你的值 */;
  --zone-color-danger: /* 你的值 */;
  --zone-color-grey: /* 你的值 */;
  --zone-color-hr: /* 你的值 */;
  --zone-color-primary: /* 你的值 */;
  --zone-color-text-invalid: /* 你的值 */;
  --zone-color-text-l1: /* 你的值 */;
  --zone-color-text-l2: /* 你的值 */;
  --zone-color-text-l3: /* 你的值 */;
  --zone-color-white: /* 你的值 */;
  --zone-dropdown-border-color: /* 你的值 */;
  --zone-dropdown-child-font-size: /* 你的值 */;
}
```

共消费 25 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
