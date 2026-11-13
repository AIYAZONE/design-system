# `<zone-dialog>` · ZoneDialog

> AIYAZONE 对话框组件

- **标签**：`<zone-dialog>`
- **实现**：`ZoneDialog`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/dialog`
- **测试**：8 个用例
- **包**：`@aiyazone/core@0.1.9`

## 快速使用

```html
<!-- 1. 注册组件 -->
<script type="module">import '@aiyazone/core';</script>

<!-- 2. 主题令牌（仅令牌用 tokens.css；完整主题用 index-v3.css） -->
<link rel="stylesheet" href="@aiyazone/tokens/dist/tokens.css">

<!-- 3. 使用 -->
<zone-dialog size="extra">内容</zone-dialog>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `size` | `size` | `"extra" \| "large"` | `"large"` | / export class ZoneDialog extends LitElement { static styles =  [unsafeCSS(styles)] as CSSResultGroup; private static _bodyScrollLockCount = 0; private static _rootStyleSnapshot: { overflow: string; paddingRight: string } \| null = null; protected firstUpdated(): void { if (this.shadowRoot) adoptInternalStyles(this.shadowRoot); this.appendToTarget(); } disconnectedCallback(): void { super.disconnectedCallback(); window?.removeEventListener("keydown", this.onKeydown); if (this._isBodyScrollLockedByThisDialog) { this.unlockBodyScroll(); } } /** 对话框尺寸 |
| `caption` | `caption` | `string` | — | 设置对话框的打开/关闭状态 |
| `ariaLabelText` | `aria-label-text` | `string` | — | 关键对话框：屏蔽 ESC 与遮罩点击关闭，仅允许显式按钮或编程方式关闭 |
| `initialFocus` | `initial-focus` | `string` | — | 初始聚焦选择器（打开后首先聚焦的元素），支持匹配插槽内容或 Shadow 内部元素 |
| `appendTo` | `append-to` | `string` | — | 关闭图标 |

## 插槽

| 插槽 | 说明 |
|------|------|
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-dialog-width` | `640px` | 设置对话框内容的宽度 |
| `--zone-dialog-title-align` | `left` | 设置对话框标题的对齐方式 |
| `--zone-dialog-index` | `500` | 设置对话框的z-index值 |

另有 32 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
