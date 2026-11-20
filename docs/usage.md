# ZDS 接入说明

基础安装与可运行 HTML 示例见 [README](../README.md#快速接入)。

## 包与运行环境

对外发布两个包：

| 包 | 用途 | 依赖 |
| --- | --- | --- |
| `@aiyazone/design-system` | 组件、图标、多语言与主题 | npm 项目需安装 Lit 3 |
| `@aiyazone/tokens` | 令牌 JSON、CSS 与 TypeScript 生成物 | 无需组件包或 Lit |

core、icons、i18n、utils 是私有工作区模块。外部应用导入总包，不使用 `@aiyazone/core/button` 等内部路径。

npm 的 `dist/index.esm.js` 和 `dist/index.cjs` 不内嵌 Lit；浏览器直连使用自包含的 `dist/cdn/index.js`。不要将 npm ESM 文件直接放进 `<script>`，也不要在同一页面混用 npm 与 CDN。

Lit 是 ESM 依赖。直接在 Node 中 `require()` CJS 入口需要支持加载 ESM 的 Node（推荐 22.13+），并提供组件所需 DOM。Node 18 请使用 ESM 或能解析 Lit ESM 的打包器。

## 主题与样式

npm 项目在应用入口选择一种主题：

```ts
import '@aiyazone/design-system';
import '@aiyazone/design-system/index-v3.css';
```

| 主题 | 包内路径 |
| --- | --- |
| v1 | `@aiyazone/design-system/index.css` |
| v2 | `@aiyazone/design-system/index-v2.css` |
| v3 | `@aiyazone/design-system/index-v3.css` |

主题包含字体、设计令牌、重置与公共样式；v1、v2、v3 是主题版本，不代表完整的明暗主题方案。CDN 页面单独加载对应主题 CSS，并与 JS 锁定同一包版本。

通过组件文档列出的 CSS 变量定制外观；变量是否可用以当前主题和 [组件 API](./api/README.md) 为准。组件的 Shadow DOM 内部类名不作为稳定接口。

仓库内部开发使用 `src/styles/index.less` 作为全局样式来源。组件仅以内联 `index.less?inline` 注入自身结构样式，避免重复导入全局样式。现有 Vite 别名已配置，外部应用无需复制工作区源码别名。

## 多语言

总包会初始化多语言能力。可从公开入口使用翻译与语言切换 API：

```ts
import { t, setCurrLanguage } from '@aiyazone/design-system';

setCurrLanguage('ja');
const label = t('common.ok');
```

纯 HTML 可使用声明式翻译：

```html
<span data-i18n-key="common.yes"></span>
<p data-i18n-key="common.welcome" data-i18n-params='{"name":"World"}'></p>
```

CDN 页面在组件脚本加载后使用 `window.i18n.t()` 和 `window.i18n.setCurrLanguage()`；无需再次初始化。

## 版本与回退

截至 2026-11-18，已完成公开安装及在线验收的版本为总包 `0.5.0`、tokens `0.2.0`。源码版本与待发布改动可能领先于 npm；实际可安装版本以 [npm 总包](https://www.npmjs.com/package/@aiyazone/design-system) 和 [npm tokens](https://www.npmjs.com/package/@aiyazone/tokens) 为准。

生产页面固定版本。CDN 更新时同时替换 JS 与主题 CSS，并复验组件、图标、语言及弹窗交互。

如果新版接入出现问题，优先回退到项目上一份已验证的版本。`0.4.1` 的组合为：

```html
<link rel="stylesheet" crossorigin
  href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.4.1/dist/index-v3.css">
<script type="module" crossorigin
  src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.4.1/dist/cdn/index.js"></script>
```

从旧版迁移时注意：`0.3.2` 使用的是 `dist/index.esm.js`；自 `0.4.x` 起，浏览器入口改为 `dist/cdn/index.js`。若需要恢复旧版接入，使用完整的旧版组合：

```html
<link rel="stylesheet" crossorigin
  href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.3.2/dist/index-v3.css">
<script type="module" crossorigin
  src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.3.2/dist/index.esm.js"></script>
```

切换后重新加载页面，不在已加载页面中导入第二个版本。npm 项目固定上一可用版本后，重新安装并构建。

## AI 参考与页面验证

[llms.txt](https://design.aiyazone.com/llms.txt)、[llms-full.txt](https://design.aiyazone.com/llms-full.txt) 和 [AI 使用指南](./ai-usage.md) 提供组件、令牌和图标参考。

仓库检查器验证自己的 AI 示例，覆盖 API、图标与令牌使用；它不能代替下游页面的实际验证。接入项目应检查页面语义、键盘操作、标签、对比度与响应式布局，并把适合的规则接入自身 CI。

## 手机、平板与桌面尺寸

主题的 rem 设计稿换算保持不变，但根字号不再随平板宽度放大到 32px：小于 1024px 时使用 `clamp(16px, 4.266666vw, 18px)`，桌面使用 16px 参考值。375px 手机保留原比例，600–1023px 不再等比放大整套 UI，1023/1024px 两侧的默认控件尺寸保持接近。

布局使用 Grid/Flex、容器宽度和换行；触屏点击区域按输入方式独立适配，不通过放大全部文字实现。复选框、多选筛选的默认标签为 16px，独立加载图标默认 14px，可通过各组件专属变量覆盖。展示级标题仍可较大，不应被用作普通控件字号。

Examples 的每个页面提供使用场景、选择建议、HTML/JavaScript 代码与注意事项。复制完整 HTML 会包含当前所选 V1/V2/V3 主题和初始化；它面向 Vite 等支持 npm 模块导入的项目，不是无构建 CDN 页面。文档使用当前源码构建，安装已发布版本时请先核对功能版本。
