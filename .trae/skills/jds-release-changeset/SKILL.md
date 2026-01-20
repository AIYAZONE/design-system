---
name: "jds-release-changeset"
description: "按 Changesets 工作流生成变更集并给出发布检查清单。用户说发版/发布/生成 changeset/升级版本时触发。"
---

# JDS 发布与 Changesets 工作流

## 适用场景
- 新增组件、修复 bug、变更 tokens 或 API，需要准备版本发布
- 想快速判断应该 bump patch/minor/major

## 关键入口
- Changesets 配置：`.changeset/config.json`
- 工作区脚本：根目录 `package.json`（`changeset:*`、`release`、`design:build`）
- CI 测试：`.github/workflows/ci-vitest.yml`

## 工作流
1. 判断变更类型与版本号策略（patch/minor/major）
2. 生成 changeset（描述必须包含：影响范围、迁移点、验证方式）
3. 在本地跑测试与类型检查（至少覆盖 core 包）
4. 检查产物与导出：组件导出是否补齐、CSS 入口是否正确
5. 版本发布前复核：breaking change 是否有 MIGRATION 说明

## 发布检查清单
- turbo test 全绿（或最少 core 包 test 全绿）
- 样式入口不破坏：`dist/index.css`、`dist/index-v2.css`、`dist/index-v3.css`
- 新组件已导出（`packages/core/src/index.ts`）
- Storybook 示例可渲染（如涉及 UI 变更）
- 若涉及 a11y：新增规则不引入明显 violations（至少保持现状）

## 示例触发语句
- “我要发布一个修复版，帮我生成 changeset 并写清楚验证步骤”
- “新增组件 Input，应该用 minor 还是 patch？顺便准备发布清单”

