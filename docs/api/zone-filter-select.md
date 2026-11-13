# `<zone-filter-select>` · ZoneFilterSelect

> ZONE FilterSelect 组件 下拉筛选多选：触发器 + 浮层面板（已选计数 / 清空 / 多选列表 / 确认按钮） 默认采用「草稿 + 确认」语义：面板内的勾选只更新草

- **标签**：`<zone-filter-select>`
- **实现**：`ZoneFilterSelect`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/filter-select`
- **测试**：52 个用例
- **包**：`@aiyazone/design-system@0.3.1`（组件源码：`@aiyazone/core@0.1.9`）

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
| `label` | `label` | `string` | — | 下拉筛选项 / export interface FilterSelectOption { /** 选项值 */ value: string; /** 选项文案 */ label: string; /** 是否禁用 */ disabled?: boolean; } let uid = 0; /** 宽松布尔属性转换器 HTML 布尔属性按规范是「存在即为真」，但本组件中 show-confirm / show-clear / show-counter / close-on-scroll 默认值为 true，若沿用标准语义， 纯 HTML 环境下将永远无法关闭（省略属性即取默认 true）。 因此这里额外支持 `attr="false"` / `attr="0"` 表示关闭： - `<zone-filter-select>`                → true（默认） - `<zone-filter-select show-confirm>`   → true - `<zone-filter-select show-confirm="false">` → false / const looseBooleanConverter = { fromAttribute: (value: string \| null): boolean => value !== null && value !== "false" && value !== "0", toAttribute: (value: boolean): string \| null => (value ? "" : "false"), }; /** ZONE FilterSelect 组件 下拉筛选多选：触发器 + 浮层面板（已选计数 / 清空 / 多选列表 / 确认按钮） 默认采用「草稿 + 确认」语义：面板内的勾选只更新草稿，点击确认后才提交到 `value`。 当 `show-confirm` 为 false 时切换为「即时生效」模式。 / export class ZoneFilterSelect extends LitElement { static styles = [unsafeCSS(styles)] as CSSResultGroup; protected firstUpdated(): void { if (this.shadowRoot) adoptInternalStyles(this.shadowRoot); } /** 触发器文案。未设置时取内置多语言 `components.filterSelect.label`。 |
| `language` | `language` | `string` | — | 自定义语言。设置后优先于页面 `<html lang>` 与全局语言（`setCurrLanguage`）。 未设置时自动读取 `document.documentElement.lang`， 若仍为空则回退到全局当前语言。 支持任意 HTML lang 写法（如 `en-US` / `zh-Hans` / `jp`），内部会自动归一化。 |
| `options` | `options` | `FilterSelectOption[]` | `[]` | 可选项列表 |
| `value` | `value` | `string[]` | `[]` | 已提交的选中值 |
| `placement` | `placement` | `Placement` | `"bottom-start"` | 面板是否展开 |
| `selectedSummary` | `selected-summary` | `string` | — | 浮层与触发器的间距 |
| `selectedText` | `selected-text` | `string` | — | 「已选 n/总数」中的「已选」文案。 未设置时取内置多语言 `components.filterSelect.counter`。 |
| `clearText` | `clear-text` | `string` | — | 「清空」文案。未设置时取内置多语言 `components.filterSelect.clear`。 |
| `confirmText` | `confirm-text` | `string` | — | 底部确认按钮文案。未设置时取内置多语言 `components.filterSelect.confirm`。 |
| `emptyText` | `empty-text` | `string` | — | 无选项时的占位文案。未设置时取内置多语言 `components.filterSelect.empty`。 |

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
