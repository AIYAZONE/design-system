# `<zone-popover>` · ZonePopover

> AIYAZONE 气泡卡片组件 点击 / 悬停触发浮层，支持自定义触发元素、箭头与定位方向

- **标签**：`<zone-popover>`
- **实现**：`ZonePopover`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/popover`
- **测试**：2 个用例
- **包**：`@aiyazone/core@0.1.9`

## 快速使用

```html
<!-- 1. 注册组件 -->
<script type="module">import '@aiyazone/core';</script>

<!-- 2. 主题令牌（仅令牌用 tokens.css；完整主题用 index-v3.css） -->
<link rel="stylesheet" href="@aiyazone/tokens/dist/tokens.css">

<!-- 3. 使用 -->
<zone-popover>内容</zone-popover>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `placement` | `placement` | `Placement` | `'bottom'` |  |
| `target` | `target` | `string` | — |  |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-popover-show` |  |
| `zone-popover-hide` |  |

```js
document.querySelector('zone-popover').addEventListener('zone-popover-show', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-index-popover` | `100` | 浮层层级 |

另有 16 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
