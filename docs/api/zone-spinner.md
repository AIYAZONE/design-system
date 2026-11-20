# `<zone-spinner>` · ZoneSpinner

> AIYAZONE 加载指示器组件

- **标签**：`<zone-spinner>`
- **实现**：`ZoneSpinner`（Lit · Shadow DOM）
- **来源**：`packages/core/src/components/spinner`
- **组件专属测试**：0 个用例；跨组件契约测试另计
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
<zone-spinner>内容</zone-spinner>
```

## 属性（Attributes / Properties）

| 属性 | Attribute | 类型 | 默认值 | 说明 |
|------|-----------|------|--------|------|
| `size` | `size` | `string` | `"var(--zone-spinner-size, 14px)"` | 设置加载指示器的大小 |
| `disabled` | `disabled` | `boolean \| undefined` | `false` | 设置加载指示器的禁用状态 |
| `overlay` | `overlay` | `boolean \| undefined` | `false` | 设置加载指示器的覆盖层状态 |
| `color` | `color` | `string` | `"var(--zone-color-primary)"` | 设置加载指示器的颜色 |
| `label` | `label` | `string` | `""` | 独立加载区的可访问名称；按钮内保持空值避免重复播报。 |

## 可覆盖的 CSS 变量

```css
:root {
  --zone-spinner-overlay-bg: /* 你的值 */;
  --zone-spinner-overlay-index: /* 你的值 */;
}
```

共消费 2 个 `--zone-*` 令牌，令牌值定义见 [packages/tokens/tokens.json](../../packages/tokens/tokens.json)。

## 接入建议

- 优先使用文档列出的公开属性与 CSS 变量；shadow DOM 内部类名不属于稳定的定制接口；
- 优先选择当前主题中已有的颜色、间距和字号令牌；
- 页面仍需自行检查语义结构、键盘操作与 ARIA 名称，不能仅凭组件存在就视为通过无障碍检查。
