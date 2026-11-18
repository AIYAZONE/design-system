# `<zone-toast>` · ZoneToast

> AIYAZONE 轻提示组件

- **标签**：`<zone-toast>`
- **实现**：`ZoneToast`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/toast`
- **测试**：0 个用例
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
<zone-toast variant="info">内容</zone-toast>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `variant` | `variant` | `"info" \| "warning" \| "success" \| "danger"` | `"info"` | 设置轻提示变体 |
| `description` | `description` | `string \| undefined` | — | 设置轻提示描述 |
| `icon` | `icon` | `boolean \| string \| undefined` | — | 允许自定义轻提示图标 |
| `closable` | `closable` | `boolean` | `false` | 显示关闭按钮 |
| `caption` | `caption` | `string \| undefined` | — | 设置轻提示标题 |
| `closed` | `closed` | `boolean` | `false` | 设置轻提示组件的显示状态（默认 false＝显示；初始隐藏必须设置 closed 属性） |
| `countdownTime` | `countdown-time` | `number` | `0` | 倒计时时间（以秒为单位） |

## 事件

| 事件名 | 说明 |
|--------|------|
| `zone-close` |  |

```js
document.querySelector('zone-toast').addEventListener('zone-close', (e) => {
  console.log(e.detail);
});
```

## 插槽

| 插槽 | 说明 |
|------|------|
| `caption` | 具名插槽 caption |
| `（默认）` | 默认插槽 |
| `action` | 具名插槽 action |
| `action-secondary` | 具名插槽 action-secondary |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-color-danger: /* 你的值 */;
  --zone-color-danger-contrast: /* 你的值 */;
  --zone-color-info: /* 你的值 */;
  --zone-color-info-contrast: /* 你的值 */;
  --zone-color-neutral-400: /* 你的值 */;
  --zone-color-success: /* 你的值 */;
  --zone-color-success-contrast: /* 你的值 */;
  --zone-color-warning: /* 你的值 */;
  --zone-color-warning-contrast: /* 你的值 */;
  --zone-font-b2: /* 你的值 */;
  --zone-font-h3: /* 你的值 */;
  --zone-size-16: /* 你的值 */;
}
```

共消费 14 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
