# `<zone-checkbox>` · ZoneCheckbox

> ZONE Checkbox 组件

- **标签**：`<zone-checkbox>`
- **实现**：`ZoneCheckbox`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/checkbox`
- **测试**：5 个用例
- **包**：`@aiyazone/design-system@0.4.0`（组件源码：`@aiyazone/core@0.1.9`）

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
<zone-checkbox>内容</zone-checkbox>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `checked` | `checked` | `Boolean` | `false` | 是否选中 |
| `disabled` | `disabled` | `Boolean` | `false` | 是否禁用 |
| `value` | `value` | `string` | `"on"` | 表单值 |
| `name` | `name` | `string` | `""` | 表单名称 |
| `label` | `label` | `string` | `""` | 标签文本 |

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

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
