# `<zone-checkbox>` · ZoneCheckbox

> ZONE Checkbox 组件

- **标签**：`<zone-checkbox>`
- **实现**：`ZoneCheckbox`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/checkbox`
- **测试**：5 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-checkbox>内容</zone-checkbox>
```

## 事件

| 事件名 | 说明 |
|--------|------|
| `change` |  |

```js
document.querySelector('zone-checkbox').addEventListener('change', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-color-primary: /* 你的值 */;
  --zone-color-text-primary: /* 你的值 */;
  --zone-font-family: /* 你的值 */;
  --zone-font-size-16: /* 你的值 */;
  --zone-size-8: /* 你的值 */;
}
```

共消费 5 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
