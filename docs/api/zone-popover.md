# `<zone-popover>` · ZonePopover

> AIYAZONE 气泡卡片组件 点击 / 悬停触发浮层，支持自定义触发元素、箭头与定位方向

- **标签**：`<zone-popover>`
- **实现**：`ZonePopover`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/popover`
- **组件专属测试**：2 个用例；跨组件契约测试另计
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
<zone-popover>内容</zone-popover>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `placement` | `placement` | `Placement` | `"bottom"` |  |
| `fitSize` | `fitsize` | `Boolean` | `false` |  |
| `offset` | `offset` | `Number` | `8` |  |
| `arrowPadding` | `arrow-padding` | `Number` | `8` |  |
| `target` | `target` | `string \| HTMLElement` | — |  |
| `manual` | `manual` | `Boolean` | `false` | 由 Tooltip 等上层组件管理触发，不自动绑定点击或菜单语义。 |

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

## 方法

| 方法 | 参数 | 说明 |
|---|---|---|
| `show()` |  |  |
| `hide()` |  |  |
| `setPopover()` |  |  |

## 插槽

| 插槽 | 说明 |
|------|------|
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-index-popover` | `100` | 浮层层级 |

另有 16 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
