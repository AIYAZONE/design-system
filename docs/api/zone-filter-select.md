# `<zone-filter-select>` · ZoneFilterSelect

> ZONE FilterSelect 组件 下拉筛选多选：触发器 + 浮层面板（已选计数 / 清空 / 多选列表 / 确认按钮） 默认采用「草稿 + 确认」语义：面板内的勾选只更新草

- **标签**：`<zone-filter-select>`
- **实现**：`ZoneFilterSelect`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/filter-select`
- **测试**：52 个用例
- **包**：`@aiyazone/design-system@0.3.2`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

```html
<!-- 1. 引入主题样式（完整主题；仅需令牌可用 @aiyazone/tokens/dist/tokens.css） -->
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css">

<!-- 2. 注册组件（总包一次注册全部 zone-*） -->
<script type="module">import '@aiyazone/design-system';</script>

<!-- 3. 使用 -->
<zone-filter-select>内容</zone-filter-select>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `label` | `label` | `string` | — | 触发器文案。未设置时取内置多语言 `components.filterSelect.label`。 |
| `language` | `language` | `string` | — | 自定义语言。设置后优先于页面 `<html lang>` 与全局语言（`setCurrLanguage`）。 未设置时自动读取 `document.documentElement.lang`， 若仍为空则回退到全局当前语言。 支持任意 HTML lang 写法（如 `en-US` / `zh-Hans` / `jp`），内部会自动归一化。 |
| `options` | `options` | `FilterSelectOption[]` | `[]` | 可选项列表 |
| `value` | `value` | `string[]` | `[]` | 已提交的选中值 |
| `open` | `open` | `Boolean` | `false` | 面板是否展开 |
| `disabled` | `disabled` | `Boolean` | `false` | 是否禁用 |
| `placement` | `placement` | `Placement` | `"bottom-start"` | 浮层位置 |
| `offset` | `offset` | `Number` | `4` | 浮层与触发器的间距 |
| `showConfirm` | `show-confirm` | `Boolean` | `true` | 是否展示底部确认按钮（false 时为即时生效模式） |
| `showClear` | `show-clear` | `Boolean` | `true` | 是否展示右上角清空按钮 |
| `showCounter` | `show-counter` | `Boolean` | `true` | 是否展示「已选 n/总数」计数 |
| `selectedSummary` | `selected-summary` | `string` | — | 有选中项时触发器展示的文案模板，支持 {count}（已选数量）与 {label}（label 属性）占位符。 未设置时取内置多语言 `components.filterSelect.selectedSummary`。 |
| `selectedText` | `selected-text` | `string` | — | 「已选 n/总数」中的「已选」文案。 未设置时取内置多语言 `components.filterSelect.counter`。 |
| `clearText` | `clear-text` | `string` | — | 「清空」文案。未设置时取内置多语言 `components.filterSelect.clear`。 |
| `confirmText` | `confirm-text` | `string` | — | 底部确认按钮文案。未设置时取内置多语言 `components.filterSelect.confirm`。 |
| `emptyText` | `empty-text` | `string` | — | 无选项时的占位文案。未设置时取内置多语言 `components.filterSelect.empty`。 |
| `closeOnScroll` | `close-on-scroll` | `Boolean` | `true` | 页面滚动时是否自动收起面板。 面板内部（选项列表）滚动不会收起。 |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-filter-select-open` |  |
| `zone-filter-select-close` |  |
| `zone-filter-select-confirm` |  |
| `zone-filter-select-clear` |  |
| `zone-filter-select-change` |  |

```js
document.querySelector('zone-filter-select').addEventListener('zone-filter-select-open', (e) => {
  console.log(e.detail);
});
```

## 可覆盖的 CSS 变量

```css
:root {
  --zone-color-primary: /* 你的值 */;
  --zone-color-white: /* 你的值 */;
  --zone-filter-select-action-color: /* 你的值 */;
  --zone-filter-select-checkbox-border-color: /* 你的值 */;
  --zone-filter-select-checkbox-checked-bg: /* 你的值 */;
  --zone-filter-select-checkbox-checked-color: /* 你的值 */;
  --zone-filter-select-checkbox-gap: /* 你的值 */;
  --zone-filter-select-checkbox-size: /* 你的值 */;
  --zone-filter-select-confirm-bg: /* 你的值 */;
  --zone-filter-select-confirm-color: /* 你的值 */;
  --zone-filter-select-confirm-height: /* 你的值 */;
  --zone-filter-select-confirm-radius: /* 你的值 */;
}
```

共消费 47 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 约束

- 只允许通过 `--zone-*` 令牌定制样式，禁止直接覆盖 shadow DOM 内部类名；
- 颜色 / 间距 / 字号必须来自设计令牌，不得硬编码；
- 交互元素自带键盘可达性与 ARIA 语义，请勿用 `div` 模拟。
