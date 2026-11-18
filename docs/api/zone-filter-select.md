# `<zone-filter-select>` · ZoneFilterSelect

> ZONE FilterSelect 组件 下拉筛选多选：触发器 + 浮层面板（已选计数 / 清空 / 多选列表 / 确认按钮） 默认采用「草稿 + 确认」语义：面板内的勾选只更新草

- **标签**：`<zone-filter-select>`
- **实现**：`ZoneFilterSelect`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/filter-select`
- **测试**：52 个用例
- **包**：`@aiyazone/design-system@0.5.0`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

npm 项目先安装总包与 Lit 3，在打包器入口导入组件和主题：

```bash
pnpm add @aiyazone/design-system lit
```

```js
import '@aiyazone/design-system';
import '@aiyazone/design-system/index-v3.css';
```

静态 HTML 需要已发布版本的自包含 CDN 入口；npm 入口不能直接放进浏览器 script。示例见 [README](https://github.com/AIYAZONE/design-system#cdn-静态页面)，升级与回退见 [接入说明](https://github.com/AIYAZONE/design-system/blob/master/docs/usage.md#版本与回退)。

```html
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

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
