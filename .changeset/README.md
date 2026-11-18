# Changesets

本仓库仅公开发布 `@aiyazone/design-system` 和 `@aiyazone/tokens`。根目录通过 `package.json` 的 `workspaces: [".", …]` 纳入 Changesets；其他工作区包为私有，不升版、不打标签。

组件、图标、多语言和工具变化写总包 Changeset。令牌变化写 tokens；影响总包生成主题时，同时写总包。两包保持独立版本，不设置固定或联动组。

升版前运行 `pnpm run release:check` 和 `pnpm run changeset:status`，再运行 `pnpm run version-packages` 与 `pnpm run docs:gen`。Changesets 会将记录写入对应 `CHANGELOG.md` 并消费变更集。升版后没有待处理 Changeset 属于正常状态。

正式发布使用授权的 `v*` 标签及 Release 工作流，流程与产物验收见 [README](../README.md#8-发布到-npm-公网)。
