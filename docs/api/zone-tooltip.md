# `<zone-tooltip>` · ZoneTooltip

> AIYAZONE Tooltip 组件

- **标签**：`<zone-tooltip>`
- **实现**：`ZoneTooltip`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/tooltip`
- **测试**：5 个用例
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
<zone-tooltip>内容</zone-tooltip>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `placement` | `placement` | `Placement` | `"top"` | 设置工具提示的位置 |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-tooltip-show` |  |
| `zone-tooltip-hide` |  |
| `zone-tooltip-hide` |  |

```js
document.querySelector('zone-tooltip').addEventListener('zone-tooltip-show', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `tooltip-trigger` | 具名插槽 tooltip-trigger |
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-tooltip-trigger-display` | `inline-flex` | 设置工具提示触发器的显示方式。 |

另有 2 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
