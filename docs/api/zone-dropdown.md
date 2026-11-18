# `<zone-dropdown>` · ZoneDropdown

> 单选下拉框；数据包含子节点时自动启用树形列表。

- **标签**：`<zone-dropdown>`
- **实现**：`ZoneDropdown`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/dropdown`
- **测试**：29 个用例
- **包**：`@aiyazone/design-system@0.4.1`（组件源码：`@aiyazone/core@0.1.9`）

## 快速使用

npm 项目先安装总包与 Lit 3，在打包器入口导入组件和主题：

```bash
pnpm add @aiyazone/design-system lit
```

```js
import '@aiyazone/design-system';
import '@aiyazone/design-system/index-v3.css';
```

静态 HTML 需要已发布版本的自包含 CDN 入口；npm 入口不能直接放进浏览器 script。发布状态与回退方法见仓库 README §5.2。

```html
<zone-dropdown>内容</zone-dropdown>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `value` | `value` | `string` | `""` |  |
| `name` | `name` | `string` | `""` |  |
| `label` | `label` | `string` | `""` |  |
| `disabled` | `disabled` | `Boolean` | `false` |  |
| `required` | `required` | `Boolean` | `false` |  |
| `open` | `open` | `Boolean` | `false` |  |
| `clearable` | `clearable` | `Boolean` | `false` |  |
| `showPath` | `show-path` | `Boolean` | `false` | 默认显示所选叶子节点的名称；开启后显示完整路径。 |
| `errorMessage` | `error-message` | `string` | `""` |  |

## 仅 JS 属性（无对应 attribute）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | `DropdownOption[]` | `[]` | 通过 JavaScript 属性赋值，例如 element.options = [...]。 |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-color-bg-200: /* 你的值 */;
  --zone-color-danger: /* 你的值 */;
  --zone-color-grey: /* 你的值 */;
  --zone-color-hr: /* 你的值 */;
  --zone-color-primary: /* 你的值 */;
  --zone-color-text-invalid: /* 你的值 */;
  --zone-color-text-l1: /* 你的值 */;
  --zone-color-text-l2: /* 你的值 */;
  --zone-color-text-l3: /* 你的值 */;
  --zone-color-white: /* 你的值 */;
  --zone-dropdown-border-color: /* 你的值 */;
  --zone-dropdown-child-font-size: /* 你的值 */;
}
```

共消费 25 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
