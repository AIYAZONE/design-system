# `<zone-button>` · ZoneButton

> ZONE Button 组件 支持变体、种类、尺寸、加载、禁用、链接等配置

- **标签**：`<zone-button>`
- **实现**：`ZoneButton`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/button`
- **测试**：34 个用例
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
<zone-button variant="primary">内容</zone-button>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `variant` | `variant` | `"primary" \| "secondary" \| "text"` | `"primary"` | 按钮变体 |
| `kind` | `kind` | `"default" \| "neutral" \| "success" \| "danger" \| "custom"` | `"default"` | 按钮种类 |
| `size` | `size` | `"extra" \| "large" \| "medium" \| "small"` | `"large"` | 按钮尺寸 |
| `interaction` | `interaction` | `"default" \| "shine"` | `"default"` | 按钮交互风格 |
| `label` | `label` | `string` | — | 按钮标签（无障碍访问） |
| `loading` | `loading` | `Boolean` | `false` | 是否加载中 |
| `disabled` | `disabled` | `Boolean` | `false` | 是否禁用 |
| `href` | `href` | `string` | — | 链接地址，设置后渲染为 <a> |
| `icon` | `icon` | `string` | — | 图标名称 |
| `iconPosition` | `icon-position` | `"prev" \| "next"` | `"next"` | 图标位置：prev（文本前）/ next（文本后） |
| `iconMode` | `icon-mode` | `"inline" \| "capsule"` | `"inline"` | 图标呈现模式：inline（常规图标）/ capsule（胶囊尾缀） |
| `target` | `target` | `string` | — | 链接目标 |
| `type` | `type` | `"button" \| "submit" \| "reset"` | `"button"` | 按钮类型 |
| `autofocus` | `autofocus` | `Boolean` | `false` | 是否自动聚焦 |
| `form` | `form` | `string \| HTMLFormElement` | — | 关联的表单 |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-click` |  |

```js
document.querySelector('zone-button').addEventListener('zone-click', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `（默认）` | 默认插槽 |
| `icon` | 具名插槽 icon |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-animate-only-icon-bg: /* 你的值 */;
  --zone-btn-active-color: /* 你的值 */;
  --zone-btn-bg-color: /* 你的值 */;
  --zone-btn-bg-hover-color: /* 你的值 */;
  --zone-btn-border-color: /* 你的值 */;
  --zone-btn-border-hover-color: /* 你的值 */;
  --zone-btn-border-radius: /* 你的值 */;
  --zone-btn-capsule-end-inset: /* 你的值 */;
  --zone-btn-capsule-gap: /* 你的值 */;
  --zone-btn-capsule-icon-size: /* 你的值 */;
  --zone-btn-capsule-shift: /* 你的值 */;
  --zone-btn-capsule-size: /* 你的值 */;
}
```

共消费 111 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
