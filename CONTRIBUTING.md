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
pnpm run packages:test:browser # tarball 独立安装、生产浏览器交互与三主题
pnpm run storybook:a11y # 构建 Storybook 后扫描 1440 / 768 / 390 三尺寸
```

jsdom 中的 axe 断言检查语义结构，不检查需要布局的 `color-contrast`。实际对比度由 Chromium 消费者与 Storybook 三尺寸扫描检查；保留 addon 默认关闭的文档画布 `region` 规则，其余规则不关闭。`incomplete` 结果保存到扫描报告，仍需人工核查，不能视为自动通过的完整无障碍证明。

消费者默认清理安装目录、浏览器与 HTTP 服务。诊断写入 `output/consumer-browser`，失败包含 `failure.json` 与截图；可用 `--diagnostics <目录>` 指定输出，人工排查用 `--keep` 保留安装目录。原 `--pack-dir`、`--record` 继续可用。CI 失败上传两类浏览器报告；required check 名称保持不变。

2026-11-18 的无障碍修复调整了默认主题语义色和悬浮色：主色、成功、危险、警告、信息色使用可读的深色值；V1 辅助文字、Toast 文字同步调整。`tokens.json` 是数据真源，生成文件由脚本更新；手写编译基线同步维护，用来检查生成器等价性。自定义主题和动态图层仍须检查实际前景／背景，建议普通正文至少 4.5:1。

## 视觉回归（Chromatic）启用步骤

1. 在 [chromatic.com](https://www.chromatic.com) 创建项目并获取 token；
2. GitHub 仓库 → Settings → Secrets and variables → Actions → 新增 `CHROMATIC_PROJECT_TOKEN`；
3. 之后 PR 自动产出视觉 diff 与基线审批；未配置时该步骤自动跳过，不阻塞 CI。

## 分支保护（2026-11-15 配置记录）

已通过 GitHub Rulesets（Settings → Rules → Rulesets）为 `master` 与 `develop` 配置：

- Require a pull request before merging；
- Required status check：`Build · Type · Test · Tokens · Docs`；
- Require branches to be up to date before merging；
- 禁止 force push / delete。

CI job 名称（`ci.yml` 中 `quality` 的 `name:`）保持稳定；发布范围、Lit 产物和 tarball 消费者检查也在该任务内执行，新增步骤不更名。如确需更名，需同步更新 ruleset 中的 required check，并核对 PR 实际产生的检查。

2026-11-18 已恢复上述稳定检查名，并通过 GitHub API 核对 master / develop 的 active Rulesets：检查名一致、来源为 GitHub Actions、要求分支更新且禁止强推与删除。传统分支保护接口返回 404，实际保护由 Rulesets 生效。PR 同一提交的 CI 结果在 [ZDS-03](docs/ROADMAP.md#zds-03-ci-名称兼容与远端核查2026-11-18) 中跟踪。

## 本地提交前自检

只公开发布总包 `@aiyazone/design-system` 和 `@aiyazone/tokens`。组件、图标、翻译和工具改动写总包 Changeset；令牌改动写 tokens，影响总包主题时也写总包。私有工作区包不升版、不打发布标签。版本准备后运行 `docs:gen`，更新文档中的版本。

```bash
pnpm run release:check && pnpm run build && pnpm run design:build && pnpm run packages:test
pnpm run type-check && pnpm run lint && pnpm run test && pnpm run tokens:check && pnpm run docs:check
```
