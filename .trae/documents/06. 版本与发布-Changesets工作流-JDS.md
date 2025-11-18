# 版本与发布：Changesets 工作流（JDS）

## 1. 目标
- 以 Changesets 管理多包版本与发布，生成变更日志，保持语义化版本与可追溯性。

## 2. 基本概念
- changeset 文件：描述包的变更类型（patch/minor/major）与备注。
- version：根据所有 changeset 更新包版本与 `CHANGELOG`。
- publish：将更新后的包发布到 NPM/私服；支持多包一次性发布。

## 3. 配置示例
```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "jackery/design-system" }],
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["apps/*", "tooling/*"]
}
```

## 4. 使用流程
1) 创建变更：
```bash
pnpm changeset
# 选择变更包：core/icons/i18n/utils
# 选择变更类型：patch/minor/major
# 填写变更说明：中文/英文均可，建议简明扼要
```
2) 合入 PR：将 changeset 文件随改动一同合入 `main`。
3) 版本更新：
```bash
pnpm changeset version
# 自动更新各包版本与生成 CHANGELOG
```
4) 发布：
```bash
pnpm changeset publish
# 读取 .npmrc/NPM_TOKEN，发布到 registry
```

## 5. CI 集成（GitHub Actions 示例）
```yaml
name: release
on:
  push:
    branches: [main]
jobs:
  version-and-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm changeset version
      - run: pnpm changeset publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 6. 规范与准则
- 一次改动对应一个 changeset；跨包变更在一条 changeset 中勾选多个包。
- 变更类型：bugfix 用 `patch`；新增特性用 `minor`；破坏性变更用 `major`。
- 变更说明：包含影响范围、升级指引与潜在风险。

## 7. 常见问题
- 忘记创建 changeset：在后续 PR 补充；发布前必须包含。
- 私服发布：将 `registry-url` 指向 Nexus，并在 CI 中注入私服 token。
- 回滚：删除错误 changeset，或以新 changeset 进行修正发布。

## 8. 成功指标
- 每次发布均有完整变更日志；版本一致性无遗漏。
- 发布失败率 < 2%；变更追踪可审计。
