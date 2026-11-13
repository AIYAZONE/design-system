# `<zone-toast>` · ZoneToast

> AIYAZONE 轻提示组件

- **标签**：`<zone-toast>`
- **实现**：`ZoneToast`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/toast`
- **测试**：0 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-toast variant="info">内容</zone-toast>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `variant` | `variant` | `"info" \| "warning" \| "success" \| "danger"` | `"info"` | / export class ZoneToast extends LitElement { static styles = [unsafeCSS(styles)] as CSSResultGroup; /** 设置轻提示变体 |
| `description` | `description` | `string \| undefined` | — | 设置轻提示描述 |
| `icon` | `icon` | `boolean \| string \| undefined` | — | 允许自定义轻提示图标 |
| `closable` | `closable` | `boolean` | `false` | 显示关闭按钮 |
| `caption` | `caption` | `string \| undefined` | — | 设置轻提示标题 |
| `closed` | `closed` | `boolean` | `false` | 设置轻提示组件的显示状态 |
| `countdownTime` | `countdown-time` | `number` | `0` | 倒计时时间（以秒为单位） |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-close` |  |

```js
document.querySelector('zone-toast').addEventListener('zone-close', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `caption` | 具名插槽 caption |
| `（默认）` | 默认插槽 |
| `action` | 具名插槽 action |
| `action-secondary` | 具名插槽 action-secondary |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-color-danger: /* 你的值 */;
  --zone-color-danger-contrast: /* 你的值 */;
  --zone-color-info: /* 你的值 */;
  --zone-color-info-contrast: /* 你的值 */;
  --zone-color-neutral-400: /* 你的值 */;
  --zone-color-success: /* 你的值 */;
  --zone-color-success-contrast: /* 你的值 */;
  --zone-color-warning: /* 你的值 */;
  --zone-color-warning-contrast: /* 你的值 */;
  --zone-font-b2: /* 你的值 */;
  --zone-font-h3: /* 你的值 */;
  --zone-size-16: /* 你的值 */;
}
```

共消费 14 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
