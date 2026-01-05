# JDS Checkbox 核心组件方案（架构·主题·实现·测试）

## 1. 总览
- 定位：用于选择/多选的规范化复选框组件
- 目标：最小 API、主题一致性、专业的可访问性与状态表现

## 2. 设计目标与原则
- 主题提供“值”（颜色/尺寸/造型/高亮），组件负责“消费与状态”
- 保持跨主题一致的视觉与行为；减少变量层级与重复覆盖
- API 精简，支持选中/禁用与表单集成

## 3. 组件 API（最小）
- 属性
  - checked?: boolean（选中状态）
  - disabled?: boolean（禁用状态）
  - name?: string（表单字段名）
  - value?: string（表单提交值，默认 "on"）
  - label?: string（无障碍与可读文本，亦用于视觉标签）
  - autofocus?: boolean（自动聚焦）
  - form?: string | HTMLFormElement（关联表单）
- 事件
  - change：状态变更触发（携带 { checked, value }）
- 插槽
  - 默认插槽：标签文本（若未提供，则依据 label 属性）

## 4. 架构与主题
### 4.1 主题 Tokens
- 颜色与语义
  - --jds-checkbox-border-color（边框）
  - --jds-checkbox-bg-checked（选中背景）
  - --jds-checkbox-icon-color（对勾图标颜色）
  - --jds-checkbox-hover-color、--jds-checkbox-active-color
  - --jds-checkbox-disabled-color（禁用边框/文本）
- 尺寸与造型
  - --jds-checkbox-size（方框尺寸，默认 24px）
  - --jds-checkbox-radius（圆角，v1 Pill/v2 直角按主题）
  - --jds-checkbox-gap（图标与文本间距，默认 8px）
  - 字体由场景文本继承，组件不强行指定
- 参考
  - v1/v2 tokens（建议在 themes/v1|v2/tokens/checkbox.less 维护）

### 4.2 组件消费策略
- 渲染结构：容器 + 隐藏原生 input + 视觉指示器（SVG） + 文本
- 状态驱动：checked/disabled 通过 CSS 类与变量控制颜色与图标
- 表单集成：name/value 随 input 参与提交；form 或最近祖先 form 为目标

## 5. 样式系统
### 5.1 视觉指示
- 未选中：边框（border-color），背景透明
- 选中：背景填充（bg-checked），绘制对勾（icon-color）
- 禁用：整体降低对比度（disabled-color），禁用交互

### 5.2 尺寸与造型
- 方框：--jds-checkbox-size（推荐 24px）
- 间距：--jds-checkbox-gap（推荐 8px）
- 圆角：--jds-checkbox-radius 由主题控制（v1 更圆、v2 可直角）

### 5.3 状态与可访问性
- 键盘：Space/Enter 切换状态；autofocus 可选
- ARIA：role="checkbox"；aria-checked（true/false）与 aria-disabled
- 标签关联：label 属性与默认插槽文本确保屏幕阅读器可读

## 6. 代码参考
- 样式实现：[index.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/checkbox/index.less)
- 逻辑实现：[index.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/checkbox/index.ts)
- Storybook：[jds-checkbox.stories.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/checkbox/jds-checkbox.stories.ts)

## 7. 示例与 Storybook
- 基础参数：checked/disabled/label/name/value/autofocus
- 用例：默认、选中、禁用、带标签、表单提交
- Docs 顶部提供中文概述与用途说明；Args 添加默认值说明与中文描述

## 8. 单元测试
- 交互：Space/Enter 切换；change 事件正确触发
- 渲染：checked/disabled 的图标与类名切换；label 文本显示
- 表单：name/value 随 form 提交，form 关联查找逻辑

## 9. 使用边界与最佳实践
- 复选框用于多选或状态开关；复杂标签交互建议使用 Chip/Tag 等专用组件
- 文本应简洁明确；如需“半选”视觉，请由父级聚合组件控制（例如树节点，aria-checked="mixed"）

## 10. 命名规范与治理
- Token 前缀统一（--jds-checkbox-*），语义清晰
- 新主题或状态变更仅改 Tokens；组件避免新增局部变量层

## 11. 迁移路径
1. 在 v1/v2 主题补齐 checkbox 的颜色与尺寸 Tokens（含 hover/active/disabled）
2. 组件统一消费 Tokens，移除冗余本地映射
3. 验证 examples：默认/选中/禁用在 v1/v2 下表现一致

## 12. 收益与风险
- 收益：主题治理一致、组件更易维护、最小 API 降低使用复杂度
- 风险与缓解：Tokens 不齐（组件合理回退与 CI 检查）；“半选”误用（在文档与示例中明确使用场景）

