# @aiyazone/design-system

## 0.5.0

### Minor Changes

- 3b9339d: 修复加载按钮的可访问名称与忙碌状态，提供可见键盘焦点和可操作的弹窗关闭按钮。弹窗支持穿过插槽与嵌套 Shadow DOM 的 Tab 循环，并恢复触发控件的内部焦点；下拉树通过明确的标签与拥有关系区分父子名称。

  默认语义色、悬浮色、V1 辅助文字与 Toast 文字加深以满足小字号对比度，因此主题视觉有变化。自定义颜色仍需要使用方核查实际前景与背景。CI 增加真实 tarball 消费者交互与 Storybook 三尺寸无障碍扫描。

## 0.4.1

### Patch Changes

- Recover the release after the original v0.4.0 attempt failed. Require matching GitHub repository metadata for both public packages before OIDC publication, and add the tokens repository metadata required by npm provenance. Preserve the original v0.4.0 tag.

## 0.4.0

### Minor Changes

- Split npm and CDN entry points: npm shares the application's Lit 3 runtime, while `dist/cdn/index.js` includes the browser runtime, components, dynamic icons and translations. Load theme CSS separately at the same version. Existing browser URLs pointing at `dist/index.esm.js` must migrate to the CDN entry.

  Publish only the design-system bundle and tokens. Core, icons, i18n and utils remain private workspace modules. Include component subpath/type fixes, shared registration and language state fixes, and the CommonJS dynamic icon fix in the public bundle.
