# @aiyazone/tokens

## 0.2.0

### Minor Changes

- 3b9339d: 修复加载按钮的可访问名称与忙碌状态，提供可见键盘焦点和可操作的弹窗关闭按钮。弹窗支持穿过插槽与嵌套 Shadow DOM 的 Tab 循环，并恢复触发控件的内部焦点；下拉树通过明确的标签与拥有关系区分父子名称。

  默认语义色、悬浮色、V1 辅助文字与 Toast 文字加深以满足小字号对比度，因此主题视觉有变化。自定义颜色仍需要使用方核查实际前景与背景。CI 增加真实 tarball 消费者交互与 Storybook 三尺寸无障碍扫描。

## 0.1.1

### Patch Changes

- 4e53d21: Resolve base color aliases in the exported CSS so white surface tokens contain concrete color values.
