# JDS Badge 组件规范（设计·实现·测试）

## 概述与目标

* 精简 API，Badge 专注“展示与导航”，不承担按钮/删除等交互

* 与 v1/v2 主题一致：主题给值（颜色/尺寸/造型），组件消费状态

* 保持可访问性与视觉一致性，降低维护成本

## 最小 API

* 属性

  * size: small | medium | large

  * variant: soft | solid | outline（默认 soft）

  * kind: default | neutral | success | warning | danger | info | custom（默认 default）

  * icon?: 图标名称（统一前置）

  * count?: 计数（优先显示）；maxCount?: 上限（默认 99）

  * href?: 导航链接（渲染为 a）

* 插槽

  * 默认插槽：文本

  * icon 插槽：可覆盖 icon 属性（统一前置）

* 已移除

  * clickable、closable、iconPosition、ariaLabelText、target、dot

## 行为与可访问性

* 文本或计数渲染；count > maxCount 显示“maxCount+”

* href → 渲染为 a.badge，设置 rel="noopener noreferrer"

* 仅计数且无文本时，自动生成 aria-label（如“计数：99+”）

* 统一前置图标；不提供按钮或关闭交互

## 样式与主题

* 变体

  * soft：背景浅色（--jds-badge-soft-bg）+ 主色前景（--jds-badge-soft-fg）

  * solid：主色背景（--jds-badge-solid-bg）+ 白色前景（--jds-badge-solid-fg）

  * outline：透明背景 + 主色描边（--jds-badge-outline-border）+ 主色前景（--jds-badge-outline-fg）

* 语义与自定义

  * default/neutral/success/warning/danger/info/custom

  * custom + soft：支持可调参数

    * \--jds-badge-soft-mix（默认 65%）：白色混合比例，控制背景浅度

    * \--jds-badge-soft-fg-darken（默认 20%）：前景加深比例，提升对比度

    * \--jds-badge-custom-color：自定义主色（在页面或主题中设置）

* 尺寸与造型

  * v1 圆角 Pill；v2 直角 0（--jds-badge-border-radius）

  * s/m/l 高度驱动；横向 padding：6/8/10；gap=4；icon-size：12/14/16

* 强制色模式

  * outline 使用 currentColor，保证高对比

## 代码结构

* 组件样式：[index.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/badge/index.less)

* 组件逻辑：[index.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/badge/index.ts)

* 主题 Tokens：

  * v1：[badge.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/src/styles/themes/v1/tokens/badge.less)

  * v2：[badge.less](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/src/styles/themes/v2/tokens/badge.less)

## 示例与 Storybook

* 控件：size、variant、kind、icon、content、count、maxCount

* 高级参数（仅 custom+soft 生效）：customColor、customSoftBgMix、customSoftFgDarken

* 位置：[jds-badge.stories.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/badge/jds-badge.stories.ts)

## 单元测试

* 框架：Vitest

* 用例覆盖：

  * 计数上限显示“99+”与文本更新

  * href 渲染为 anchor

* 位置：[badge.test.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/src/components/badge/__tests__/badge.test.ts)

## 使用建议与边界

* 导航用 href；Badge 不承担按钮/删除等交互

* 需要可点击/可关闭的标签，建议使用 Chip/Tag 组件

* 自定义品牌色优先通过主题设置；页面按需覆盖 --jds-badge-custom-color

## 迁移说明

* 移除属性：clickable、closable、iconPosition、ariaLabelText、target、dot

* 图标位置统一前置；仅计数自动 aria-label 替代手动设置

* 原有交互请迁移到 Chip/Tag 或页面行为

