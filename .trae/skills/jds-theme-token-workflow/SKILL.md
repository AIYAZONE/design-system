---
name: "jds-theme-token-workflow"
description: "维护 JDS tokens 与主题版本（v1/v2/v3）并同步文档。用户说新增 token、调整主题或生成 CSS 变量时触发。"
---

# JDS Token 与主题版本工作流

## 目标
- 将设计变更落到“可复用 tokens（CSS 变量）”而非组件硬编码
- 保持主题版本（v1/v2/v3）一致的构建与消费方式

## 关键位置
- 基础 tokens 与 mixin：`src/styles/jds/tokens.base.less`
- 主题版本入口：`src/styles/themes/v1/index.less`、`v2/index.less`、`v3/index.less`
- 组件 token 文件：`src/styles/themes/v*/tokens/<component>.less`
- 组件样式：`packages/core/src/components/*/index.less`
- 文档：`docs/tokens/*.mdx` 与 `.trae/documents/*`（如需补规范说明）

## 规则
- 新 token 必须以 `--jds-` 前缀命名，保持语义化（不要用“红/蓝”直译，优先用 role）
- 尽量在 tokens 层完成“主题差异”，组件样式只消费变量
- 如果 token 需要在多主题共享：优先加在 `tokens.base.less` 的 mixin/常量体系里

## 响应式断点
- Desktop：`@media screen and (min-width: 1024px)`
- Mobile：`@media screen and (max-width: 1023.98px)`（语义等价于 `<1024px`，边界用 1023.98 避免临界抖动）

## 移动端设计稿基准与换算
- 移动端口径统一按 750px 设计稿基准输出（对应 `@rem: (1rem / 32)` 的体系）
- v1：设计稿基准就是 750，按设计稿数值直接映射
- v2/v3：设计稿来源是 375，落到 tokens 时先把设计稿数值 `×2` 再输出
- 映射原则：
  - 优先映射到 `--jds-size-*` / `--jds-font-size-*`（组件只消费 `var(--jds-...)`）
  - 只能写 px 的少量场景（如 max-width 等）也必须先 `×2` 再写
- 换算例子：
  - v2/v3 设计稿 padding=18 → 输出使用 `var(--jds-size-36)`
  - v2/v3 设计稿 max-width=343px → 输出写 `686px`
  - v2/v3 设计稿 font-size=16 → 输出使用 `var(--jds-font-size-32)`

## 步骤
1. 明确变更类型：新增 token / 调整 token 值 / 新增主题版本差异
2. 明确本次修改的设计稿口径：v1=750；v2/v3=375（输出前需 `×2`）
3. 在对应主题版本的 tokens 文件中落地变量（确保移动端变量放进 `<1024px` media query）
4. 更新组件 `index.less` 使用 `var(--jds-...)`
5. 如果影响对外消费（dist css 入口或版本切换）：同步到构建/文档说明
6. 运行样式预览（examples 或 storybook）验证 v1/v2/v3 差异符合预期

## 校验要点
- 断点一致：移动端变量都在 `max-width: 1023.98px` 内，桌面端变量都在 `min-width: 1024px` 内
- 口径一致：v2/v3 移动端从 375 设计稿来的数值已按 `×2` 输出（抽查至少 1 处 raw px 与 1 处 size/font 映射）

## 示例触发语句
- “新增按钮 hover 背景 token，并分别给 v2/v3 不同值”
- “把 Dialog 的圆角改为 token 化，不允许硬编码像素”
- “v3 按钮移动端 padding 设计稿是 18，按规则输出到 tokens（v2/v3 375→×2）”
- “统一说明移动端断点就是 <1024px（max-width: 1023.98px）”
