# `<zone-dialog>` · ZoneDialog

> AIYAZONE 对话框组件

- **标签**：`<zone-dialog>`
- **实现**：`ZoneDialog`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/dialog`
- **组件专属测试**：9 个用例；跨组件契约测试另计
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
<zone-dialog size="extra">内容</zone-dialog>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `closeLabel` | `close-label` | `string` | — | 关闭操作名称，默认跟随页面语言。 |
| `size` | `size` | `"extra" \| "large"` | `"large"` | 对话框尺寸 |
| `open` | `open` | `Boolean` | `false` | 设置对话框的打开/关闭状态 |
| `caption` | `caption` | `string` | — | 对话框标题文本；也可通过 header 插槽覆盖标题区域 |
| `critical` | `critical` | `Boolean` | `false` | 关键对话框：屏蔽 ESC 与遮罩点击关闭，仅允许显式按钮或编程方式关闭 |
| `noClose` | `no-close` | `Boolean` | `false` | 是否隐藏右上角关闭按钮（强制隐藏） |
| `showClose` | `show-close` | `Boolean` | `true` | 是否显示右上角关闭按钮（默认显示） |
| `disableBodyScroll` | `disable-body-scroll` | `Boolean` | `true` | 打开时是否禁用页面滚动（body overflow: hidden） |
| `ariaLabelText` | `aria-label-text` | `string` | — | 无标题时用于可访问性的 aria-label 文本 |
| `initialFocus` | `initial-focus` | `string` | — | 初始聚焦选择器（打开后首先聚焦的元素），支持匹配插槽内容或 Shadow 内部元素 |
| `closeIcon` | `close-icon` | `String` | `"close-fill"` | 关闭图标 |
| `appendTo` | `append-to` | `string` | — | Dialog 挂载目标 支持 CSS Selector，例如： - body - #app - .modal-root |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-dialog-open` |  |
| `zone-dialog-request-close` |  |
| `zone-dialog-close` |  |
| `closed` |  |

```js
document.querySelector('zone-dialog').addEventListener('zone-dialog-open', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `header` | 具名插槽 header |
| `（默认）` | 默认插槽 |
| `footer` | 具名插槽 footer |

## 可覆盖的 CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--zone-dialog-width` | `640px` | 设置对话框内容的宽度 |
| `--zone-dialog-title-align` | `left` | 设置对话框标题的对齐方式 |
| `--zone-dialog-index` | `500` | 设置对话框的z-index值 |
| `--zone-dialog-close-icon-size` | `24px` | 关闭图标大小，点击区域至少为 44px |

另有 34 个间接消费的 `--zone-*` 令牌；令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
