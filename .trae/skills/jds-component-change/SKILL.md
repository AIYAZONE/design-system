---
name: "jds-component-change"
description: "按 JDS 规范修改现有组件并补齐 tests/stories。用户说修复组件、增加属性或调整交互时触发。"
---

# JDS 组件修改与验收

## 适用场景
- 增加/调整组件属性（reflect、类型、默认值）
- 修复组件交互（click/keyboard/focus/slot）
- 变更渲染结构或样式策略（仍需保持 tokens 约束）
- 需要同步补齐测试与 Storybook 示例

## 执行准则
- 先定位组件入口：`packages/core/src/components/<name>/index.ts`
- 变更必须同步更新：
  - `__tests__/*`（覆盖新逻辑分支与回归场景）
  - `jds-<name>.stories.ts`（演示新增能力与最佳实践）
  - 如涉及 tokens：同步到主题/令牌入口并避免硬编码
- 保持对外兼容：避免破坏属性名与事件名；如需破坏性变更，提供迁移说明

## 无障碍与安全检查
- 可访问名称：icon-only 或无文本必须有 `label/aria-label`
- 链接安全：`target="_blank"` 必须带 `rel="noopener noreferrer"`
- Dialog 类组件：关注 `role/aria-modal`、焦点管理、ESC 行为

## 测试要求
- 单元：渲染与属性映射、事件 payload、边界值
- 交互：`@testing-library/user-event` 模拟 click/keyboard
- a11y：`axe-core.run`，默认禁用 `color-contrast` 规则再逐步打开
- 优先复用 [utils.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/utils.ts) 的 `mount` / `waitUpdate`

## 产出清单
- 修改后的组件代码
- 覆盖新增逻辑的测试（至少 1 条回归 + 1 条新增行为）
- 更新 Storybook 示例（包含推荐用法）

## 示例触发语句
- “给 Dialog 增加 ESC 关闭，并补交互与 a11y 测试”
- “修复 Checkbox disabled 仍可触发 change 的问题，补回归用例”

