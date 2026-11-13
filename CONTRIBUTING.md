# 贡献指南

## 组件完成定义（DoD）

一个 `zone-*` 组件要合入 master，以下各项**缺一不可**（CI 六关把关）：

| 项 | 要求 | 机器校验 |
|----|------|----------|
| Story | `*.stories.ts` 覆盖主要状态（默认/禁用/加载等） | docs:check |
| 单测 | `__tests__/*.test.ts`，交互行为全覆盖 | test |
| a11y 用例 | `__tests__/*.a11y.test.ts`，axe-core 断言 0 violations | test |
| 视觉基线 | Chromatic 快照（PR 自动 diff，基线审批后合入） | Chromatic 步骤 |
| API 文档 | 类注释带 `@summary` + `@cssproperty`；`pnpm docs:gen` 生成 `docs/api/zone-*.md` | docs:check |
| 样式规范 | 组件 less 不得新增裸 hex（令牌来自 `--zone-*`） | tokens:lint |

命令速查：

```bash
pnpm run docs:gen      # 重新生成组件清单 / API 文档 / llms.txt
pnpm run docs:check    # 生成产物与源码同步校验
pnpm run tokens:build  # tokens.json → less/css/ts
pnpm run tokens:check  # 防漂移
pnpm run tokens:lint   # 禁止新增裸 hex（--update 冻结存量）
```

## 视觉回归（Chromatic）启用步骤

1. 在 [chromatic.com](https://www.chromatic.com) 创建项目并获取 token；
2. GitHub 仓库 → Settings → Secrets and variables → Actions → 新增 `CHROMATIC_PROJECT_TOKEN`；
3. 之后 PR 自动产出视觉 diff 与基线审批；未配置时该步骤自动跳过，不阻塞 CI。

## 分支保护（管理员一次性配置）

Settings → Branches → Add rule：

- `master` 与 `develop`：required checks 勾选 `Build · Type · Test · Tokens · Docs`；
- 勾选 "Require branches to be up to date before merging"；
- 禁止 force push。

## 本地提交前自检

```bash
pnpm run build && pnpm run type-check && pnpm run test && pnpm run tokens:check && pnpm run docs:check
```
