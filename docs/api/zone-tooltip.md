# `<zone-tooltip>` · ZoneTooltip

> AIYAZONE Tooltip 组件

- **标签**：`<zone-tooltip>`
- **实现**：`ZoneTooltip`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/tooltip`
- **测试**：5 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-tooltip>内容</zone-tooltip>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `placement` | `placement` | `Placement` | `"top"` | / export class ZoneTooltip extends LitElement { static styles = [unsafeCSS(styles)] as CSSResultGroup; private static _activeTouchTooltip: ZoneTooltip \| null = null; private readonly _popoverArrowPadding = 14; protected firstUpdated(): void { if (this.shadowRoot) adoptInternalStyles(this.shadowRoot); } /** 设置工具提示的位置 |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-tooltip-show` |  |
| `zone-tooltip-hide` |  |
| `zone-tooltip-hide` |  |

```js
document.querySelector('zone-tooltip').addEventListener('zone-tooltip-show', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `tooltip-trigger` | 具名插槽 tooltip-trigger |
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-tooltip-trigger-display` | `inline-flex` | 设置工具提示触发器的显示方式。 |

另有 2 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
