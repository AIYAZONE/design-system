# `<zone-button>` · ZoneButton

> ZONE Button 组件 支持变体、种类、尺寸、加载、禁用、链接等配置

- **标签**：`<zone-button>`
- **实现**：`ZoneButton`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/button`
- **测试**：33 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-button variant="primary">内容</zone-button>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `variant` | `variant` | `"primary" \| "secondary" \| "text"` | `"primary"` | ZONE Button 组件 支持变体、种类、尺寸、加载、禁用、链接等配置 / export class ZoneButton extends LitElement { static styles = [unsafeCSS(styles)] as CSSResultGroup; protected firstUpdated(): void { if (this.shadowRoot) adoptInternalStyles(this.shadowRoot); } /** 按钮变体 |
| `kind` | `kind` | `"default" \| "neutral" \| "success" \| "danger" \| "custom"` | `"default"` | 按钮种类 |
| `size` | `size` | `"extra" \| "large" \| "medium" \| "small"` | `"large"` | 按钮尺寸 |
| `interaction` | `interaction` | `"default" \| "shine"` | `"default"` | 按钮交互风格 |
| `label` | `label` | `string` | — | 按钮标签（无障碍访问） |
| `href` | `href` | `string` | — | 是否加载中 |
| `icon` | `icon` | `string` | — | 图标名称 |
| `iconPosition` | `icon-position` | `"prev" \| "next"` | `"next"` | 图标位置：prev（文本前）/ next（文本后） |
| `iconMode` | `icon-mode` | `"inline" \| "capsule"` | `"inline"` | 图标呈现模式：inline（常规图标）/ capsule（胶囊尾缀） |
| `target` | `target` | `string` | — | 链接目标 |
| `type` | `type` | `"button" \| "submit" \| "reset"` | `"button"` | 按钮类型 |
| `form` | `form` | `string \| HTMLFormElement` | — | 是否自动聚焦 |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-click` |  |

```js
document.querySelector('zone-button').addEventListener('zone-click', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `（默认）` | 默认插槽 |
| `icon` | 具名插槽 icon |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-animate-only-icon-bg: /* 你的值 */;
  --zone-btn-active-color: /* 你的值 */;
  --zone-btn-bg-color: /* 你的值 */;
  --zone-btn-bg-hover-color: /* 你的值 */;
  --zone-btn-border-color: /* 你的值 */;
  --zone-btn-border-hover-color: /* 你的值 */;
  --zone-btn-border-radius: /* 你的值 */;
  --zone-btn-capsule-end-inset: /* 你的值 */;
  --zone-btn-capsule-gap: /* 你的值 */;
  --zone-btn-capsule-icon-size: /* 你的值 */;
  --zone-btn-capsule-shift: /* 你的值 */;
  --zone-btn-capsule-size: /* 你的值 */;
}
```

共消费 110 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
