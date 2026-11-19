# `<zone-badge>` · ZoneBadge

> AIYAZONE 徽章组件

- **标签**：`<zone-badge>`
- **实现**：`ZoneBadge`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/badge`
- **组件专属测试**：7 个用例；跨组件契约测试另计
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
<zone-badge size="small">内容</zone-badge>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `ariaLabelText` | `aria-label-text` | `string` | — |  |
| `size` | `size` | `"small" \| "medium" \| "large"` | `"medium"` | 设置徽章的大小（影响高度/内边距/图标大小） |
| `variant` | `variant` | `"soft" \| "solid" \| "outline"` | `"soft"` | 徽章的风格变体：soft（浅色）、solid（实色）、outline（描边） |
| `kind` | `kind` | `"default" \| "neutral" \| "success" \| "warning" \| "danger" \| "info" \| "custom"` | `"default"` | 徽章的语义种类（default/neutral/success/warning/danger/info/custom） |
| `icon` | `icon` | `string \| undefined` | — | 设置图标的名称（亦可通过 icon 插槽覆盖） |
| `iconPosition` | `icon-position` | `"prev" \| "next" \| "start" \| "end"` | `"next"` | 图标位置：prev（文本前）/ next（文本后） |
| `count` | `count` | `number` | — | 计数值（优先显示，超过 maxCount 显示为 "maxCount+"） |
| `maxCount` | `max-count` | `Number` | `99` | 计数显示上限（默认 99） |
| `href` | `href` | `string` | — | 链接地址（设置后渲染为 <a>，自动添加 rel='noopener noreferrer'） |

## 插槽

| 插槽 | 说明 |
|------|------|
| `icon` | 具名插槽 icon |
| `（默认）` | 默认插槽 |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-badge-bg-color` | `var(--zone-color-primary-contrast)` | 设置徽章的背景颜色 |
| `--zone-badge-color` | `var(--zone-color-primary)` | 设置徽章语义主色（outline 边框默认跟随该值，solid 默认背景也会使用该值） |
| `--zone-badge-text-color` | `var(--zone-badge-color)` | 设置徽章的文字颜色（所有变体通用） |

另有 36 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
