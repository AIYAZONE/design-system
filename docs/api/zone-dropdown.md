# `<zone-dropdown>` · ZoneDropdown

> 单选下拉框；数据包含子节点时自动启用树形列表。

- **标签**：`<zone-dropdown>`
- **实现**：`ZoneDropdown`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/dropdown`
- **组件专属测试**：29 个用例；跨组件契约测试另计
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
<zone-dropdown id="delivery" label="配送方式" name="delivery"></zone-dropdown>
<script>
  document.querySelector("#delivery").options = [
    { value: "standard", label: "标准配送" },
    { value: "express", label: "加急配送" }
  ];
</script>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `value` | `value` | `string` | `""` |  |
| `name` | `name` | `string` | `""` |  |
| `label` | `label` | `string` | `""` |  |
| `placeholder` | `placeholder` | `string` | — | 未指定文案时使用当前语言；传入空字符串时保留空字符串。 |
| `disabled` | `disabled` | `Boolean` | `false` |  |
| `required` | `required` | `Boolean` | `false` |  |
| `open` | `open` | `Boolean` | `false` |  |
| `clearable` | `clearable` | `Boolean` | `false` |  |
| `showPath` | `show-path` | `Boolean` | `false` | 默认显示所选叶子节点的名称；开启后显示完整路径。 |
| `emptyText` | `empty-text` | `string` | — |  |
| `requiredMessage` | `required-message` | `string` | — |  |
| `clearLabel` | `clear-label` | `string` | — |  |
| `errorMessage` | `error-message` | `string` | `""` |  |

## 仅 JS 属性（无对应 attribute）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | `DropdownOption[]` | `[]` | 通过 JavaScript 属性赋值，例如 element.options = [...]。 |

## 事件

| 事件名 | 说明 |
|--------|------|
| `change` | 用户选择或清空时触发，详情类型为 DropdownChangeDetail；支持冒泡并穿透 Shadow DOM。 |
| `zone-dropdown-show` | 下拉面板已打开。 |
| `zone-dropdown-hide` | 下拉面板已关闭。 |

```js
document.querySelector('zone-dropdown').addEventListener('change', (e) => {
  console.log(e.detail);
});
```

## 方法

| 方法 | 参数 | 说明 |
|---|---|---|
| `checkValidity()` |  |  |
| `reportValidity()` |  |  |
| `setCustomValidity()` | message: string |  |
| `show()` |  |  |
| `hide()` |  |  |
| `focus()` | options?: FocusOptions |  |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-dropdown-width` | `100%` | 组件宽度。 |
| `--zone-dropdown-height` | — | 触发器高度，默认桌面36px、触屏44px。 |
| `--zone-dropdown-font-size` | `16px` | 触发器文字字号。 |
| `--zone-dropdown-label-font-size` | `14px` | 字段标签字号。 |
| `--zone-dropdown-child-font-size` | `14px` | 选项文字字号，根级与子级保持一致。 |
| `--zone-dropdown-indent` | `16px` | 树形层级缩进。 |
| `--zone-dropdown-max-height` | `360px` | 选项面板最大高度。 |
| `--zone-dropdown-border-color` | — | 触发器边框颜色。 |
| `--zone-dropdown-panel-border-color` | — | 面板边框颜色。 |
| `--zone-dropdown-radius` | `0px` | 触发器与面板圆角。 |
| `--zone-dropdown-shadow` | — | 浮层阴影。 |
| `--zone-dropdown-focus-color` | — | 键盘焦点标记颜色。 |
| `--zone-dropdown-option-background` | — | 选中、激活和悬停行底色。 |
| `--zone-dropdown-index` | — | 浮层层级。 |

另有 11 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
