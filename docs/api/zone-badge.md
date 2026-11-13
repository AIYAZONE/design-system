# `<zone-badge>` · ZoneBadge

> AIYAZONE 徽章组件

- **标签**：`<zone-badge>`
- **实现**：`ZoneBadge`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/badge`
- **测试**：7 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-badge size="small">内容</zone-badge>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `size` | `size` | `"small" \| "medium" \| "large"` | `"medium"` | / export class ZoneBadge extends LitElement { // 组件的样式 static styles = [unsafeCSS(styles)] as CSSResultGroup; /** 设置徽章的大小（影响高度/内边距/图标大小） |
| `variant` | `variant` | `"soft" \| "solid" \| "outline"` | `"soft"` | 徽章的风格变体：soft（浅色）、solid（实色）、outline（描边） |
| `kind` | `kind` | `"default" \| "neutral" \| "success" \| "warning" \| "danger" \| "info" \| "custom"` | `"default"` | 徽章的语义种类（default/neutral/success/warning/danger/info/custom） |
| `icon` | `icon` | `string \| undefined` | — | 设置图标的名称（亦可通过 icon 插槽覆盖） |
| `iconPosition` | `icon-position` | `"prev" \| "next" \| "start" \| "end"` | `"next"` | 图标位置：prev（文本前）/ next（文本后） |
| `count` | `count` | `number` | — | 点式徽章（仅显示圆点） / // 移除点式徽章支持 /** 计数值（优先显示，超过 maxCount 显示为 "maxCount+"） |
| `href` | `href` | `string` | — | 计数显示上限（默认 99） |

## 插槽

| 插槽 | 说明 |
|------|------|
| `icon` | 具名插槽 icon |
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-badge-bg-color` | `var(--zone-color-primary-contrast)` | 设置徽章的背景颜色 |
| `--zone-badge-color` | `var(--zone-color-primary)` | 设置徽章语义主色（outline 边框默认跟随该值，solid 默认背景也会使用该值） |
| `--zone-badge-text-color` | `var(--zone-badge-color)` | 设置徽章的文字颜色（所有变体通用） |

另有 35 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
