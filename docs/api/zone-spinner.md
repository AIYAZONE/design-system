# `<zone-spinner>` · ZoneSpinner

> AIYAZONE 加载指示器组件

- **标签**：`<zone-spinner>`
- **实现**：`ZoneSpinner`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/spinner`
- **测试**：0 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-spinner>内容</zone-spinner>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `size` | `size` | `string` | `"var(--zone-spinner-size, var(--zone-size-14))"` | / export class ZoneSpinner extends LitElement { // 定义组件的CSS样式 static styles = [unsafeCSS(styles)] as CSSResultGroup; protected firstUpdated(): void { if (this.shadowRoot) adoptInternalStyles(this.shadowRoot); } /** 设置加载指示器的大小 |
| `disabled` | `disabled` | `boolean \| undefined` | `false` | 设置加载指示器的禁用状态 |
| `overlay` | `overlay` | `boolean \| undefined` | `false` | 设置加载指示器的覆盖层状态 |
| `color` | `color` | `string` | `"var(--zone-color-primary)"` | 设置加载指示器的颜色 |

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
