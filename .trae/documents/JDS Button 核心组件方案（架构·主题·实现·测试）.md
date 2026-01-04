# JDS Button 核心组件方案（架构·主题·实现·测试）

## 1. 总览

* 定位：用于交互与导航的规范化按钮组件

* 目标：最小 API、主题一致性、专业的可访问性与状态表现

## 2. 设计目标与原则

* 主题提供“值”（颜色/尺寸/造型/高亮），组件负责“消费与状态”

* 保持跨主题一致的视觉与行为；减少变量层级与重复覆盖

* API 精简，所有非必要能力通过主题或页面样式实现

## 3. 组件 API（最小）

* 属性

  * variant: primary | secondary | text（默认 primary）

  * kind: default | neutral | success | danger | custom（默认 default）

  * size: extra | large | medium | small（默认 large）

  * icon?: 图标名称（统一前置，可被 icon 插槽覆盖）

  * iconPosition?: start | end（默认 end）

  * loading?: boolean（加载态）

  * disabled?: boolean（禁用态）

  * href?: string（渲染为 a，role=button，rel="noopener noreferrer"）

  * type?: button | submit | reset（默认 button）

  * form?: string | HTMLFormElement（提交目标）

  * label?: string（无障碍可读文本）

* 插槽

  * 默认插槽：文本

  * icon 插槽：覆盖 icon 属性（前/后由 iconPosition 控制）

* 高级配置（建议在主题或页面样式中）

  * \--jds-btn-custom-color（自定义主色）

  * target（遵循安全策略；\_blank → rel=noopener）

  * autofocus（谨慎使用）

## 4. 架构与主题

### 4.1 主题 Tokens

* 颜色与语义状态

  * \--jds-btn-main-color、--jds-btn-hover-color、--jds-btn-active-color

  * \--jds-btn-text-underline-color、--jds-btn-custom-highlight-mix

* 造型差异（圆角/直角）

  * v1：--jds-btn-border-radius: var(--jds-rounded-pill)

  * v2：--jds-btn-border-radius: 0

* 参考

  * v1 tokens [button.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/src/styles/themes/v1/tokens/button.less)

  * v2 tokens [button.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/src/styles/themes/v2/tokens/button.less)

### 4.2 组件消费策略

* 根域语义变量与 Kind 赋值统一驱动状态

  * [index.less:6-16](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L6-L16) | Kind 赋值 [index.less:77-116](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L77-L116)

* 变体基础显示

  * Secondary/Text 默认不填充背景，仅设置边框或文字

  * [index.less:135-176](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L135-L176)

* 文本下划线统一

  * 悬浮时一次性设定 --jds-btn-text-underline-color

  * [index.less:284-294](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L284-L294) | [index.less:436-440](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L436-L440)

## 5. 样式系统

### 5.1 变体

* primary：填充主色背景 + 白色/语义前景

* secondary：描边；hover/active 按主色填充

* text：透明背景；hover 绘制下划线与高亮文字

### 5.2 语义（kind）

* default/neutral/success/danger/custom

* custom 高亮使用 color-mix（iOS <16.2 回退主色）

### 5.3 尺寸与造型

* extra/large/medium/small：高度/内边距/gap 与字体；icon-only 提供宽度与图标尺寸

* 圆角由主题控制；组件不硬编码

### 5.4 状态行为

* Hover：仅可悬浮设备触发；Text 只影响文字/下划线；Secondary 保持透明背景

  * [index.less:426-505](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L426-L505)

* Active：primary/secondary 使用语义高亮或主色；支持隐式 primary

  * [index.less:521-569](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L521-L569)

* Disabled：不透明度 30%；文本按钮下划线颜色与主色一致

  * [index.less:507-519](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L507-L519)

* Loading：隐藏文本居中 spinner；hover 不改变

  * 样式 [index.less:341-386](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L341-L386)

  * 逻辑 [index.ts:244-251](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts#L244-L251)

### 5.5 可访问性与兼容

* 键盘：Space/Enter；href 场景 role=button；aria-disabled

* 强制色（如需要 outline）可使用 currentColor

* iOS 低版本 color-mix 回退

## 6. 代码参考

* 样式实现：[index.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less)

  * 变体：[index.less:64-76](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L64-L76)

  * 语义与高亮：[index.less:77-116](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L77-L116)

  * 尺寸与 icon-only：[index.less:178-258](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L178-L258)

  * 状态：Disabled/Loading/Hover/Active [index.less:260-569](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.less#L260-L569)

* 逻辑实现：[index.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts)

  * 属性与默认值：[index.ts:29-90](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts#L29-L90)

  * 点击与键盘：[index.ts:164-199](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts#L164-L199)

  * 表单提交：[index.ts:176-192](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts#L176-L192)

  * anchor 渲染：[index.ts:277-291](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/index.ts#L277-L291)

## 7. 示例与 Storybook

* 基础参数：variant/kind/size/icon/iconPosition/content/loading/disabled/href/type/form/label

* 高级参数：customColor（--jds-btn-custom-color）、target、style（建议在主题或页面样式中使用）

* 文档页顶部提供中文概述与用途说明

* 位置：[jds-button.stories.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/jds-button.stories.ts)

## 8. 单元测试

* 交互：disabled/loading 阻止；Space/Enter 行为；submit 与 form

* 渲染：href → anchor 的 role/aria/rel；icon-only；iconPosition（start/end）

* 主题：custom 高亮回退（iOS <16.2）可选样式断言/截图

* 位置：[button.test.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/button/__tests__/button.test.ts)

## 9. 使用边界与最佳实践

* 导航用 href；非导航交互用 button；避免将 Button 用作纯展示（Badge）

* custom 颜色优先在主题中设置；页面按需覆盖 --jds-btn-custom-color

## 10. 命名规范与治理

* Token 前缀统一（--jds-btn-\*）；语义清晰

* 新主题或状态变更仅改 Tokens；组件避免新增局部变量层

## 11. 迁移路径

1. 在 v1/v2 主题补齐语义状态变量（hover/active/underline/custom-highlight-mix）
2. 组件收敛旧变量引用，统一消费语义变量（不改视觉）
3. 验证 examples：Variants × Kinds × States 在 v1/v2 下一致

## 12. 收益与风险

* 收益：减少重复覆盖与隐式品牌色回退；主题治理一致；组件可维护性提升

* 风险与缓解：Tokens 不齐（组件合合理回退与 CI 检查）；移动端 hover（媒体查询控制）

