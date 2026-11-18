# ZDS 开发与发布

## 开发环境

使用 Node.js 22.13+ 和仓库声明的 pnpm 10.28.0；CI 使用 Node 22。

```bash
corepack enable
pnpm install
```

在仓库根目录按需启动：

```bash
pnpm --filter @aiyazone/portal dev
pnpm storybook
pnpm --filter @aiyazone/examples dev
```

工作区已配置 Vite 源码别名。内部组件通过 `packages/core/src/components/<name>` 维护，包含实现、Less、Storybook 示例与测试；全局主题统一维护在 `src/styles`。

## 构建与检查

完整包构建先生成工作区产物，再生成总包：

```bash
pnpm build
pnpm design:build
```

| 命令 | 用途 |
| --- | --- |
| `pnpm design:build:lib` | npm ESM/CJS 与类型声明 |
| `pnpm design:build:cdn` | 自包含 CDN 入口；仅清空 `dist/cdn` |
| `pnpm design:build:themes` | 全局样式、主题与字体资产 |
| `pnpm design:watch:lib` | 持续构建 npm JS |
| `pnpm design:watch:themes` | 持续构建主题 |
| `pnpm portal:build:all` | 组装完整文档站 |
| `pnpm docs:gen` | 生成令牌、组件及 AI 文档 |

`design:build` 依次执行 npm、CDN、主题构建。`design:build:single` 是 CDN 构建的兼容别名。

提交前按变更范围执行检查；发布准备执行完整检查：

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm tokens:check
pnpm tokens:lint
pnpm docs:check
pnpm packages:check
pnpm packages:check:lit
pnpm packages:test
```

消费者浏览器检查复用 Storybook 的 Playwright，首次使用需安装 Chromium：

```bash
pnpm --filter @aiyazone/storybook exec playwright-core install chromium
pnpm packages:test:browser
pnpm build:storybook
pnpm storybook:a11y
```

`packages:test` 在隔离目录中安装公开 tarball 与 Lit，检查 ESM/CJS、类型、主题及生产构建；`packages:test:browser` 增加桌面、平板、手机三尺寸交互检查。`packages:test:internal` 用于内部六包接口及混用验证。

## 发布产物

| 产物 | 用途 |
| --- | --- |
| `dist/index.esm.js`、`dist/index.cjs` | npm 入口，外部引用 Lit |
| `dist/cdn/index.js` | 浏览器入口，包含 Lit 与内部模块 |
| `dist/index.css`、`dist/index-v2.css`、`dist/index-v3.css` | 主题 |
| `dist/internal.css` | 内部基础样式 |
| `dist/zone.d.ts`、`dist/**/*.d.ts` | 类型声明 |
| `dist/chunks/**`、`dist/fonts/**`、`dist/assets/**` | 动态模块、字体与资源 |

总包不包含 `public`、Storybook 或站点预览文件。

## 版本与 npm 发布

仅发布 `@aiyazone/design-system` 与 `@aiyazone/tokens`，两包独立采用语义版本。core、icons、i18n、utils 及工具配置保持 `private: true`。

- 组件、图标、翻译与工具改动写总包 Changeset。
- 令牌改动写 tokens Changeset；若影响总包生成的主题，同时写总包 Changeset。
- 私有包不单独升版或打标签，总包不依赖私有包的 registry 版本。

准备版本：

```bash
pnpm changeset
pnpm release:check
pnpm changeset:status
pnpm version-packages
pnpm docs:gen
pnpm build
pnpm design:build
pnpm packages:test
pnpm packages:test:browser
```

确认同一提交的完整质量检查通过后，使用与总包版本一致的 `v*` 标签触发 [release.yml](../.github/workflows/release.yml)。工作流先执行复用的质量检查，再以 npm Trusted Publishing 发布已验证的 tarball。

两个 npm 包的 Trusted Publisher 都需指向该仓库的 `release.yml`，并具有 `npm publish` 权限。Actions 保存提交、版本、文件清单、依赖、SHA256 与 tarball；已存在版本跳过发布。`publish:design-system` 仅构建，不执行发布。

npm 返回 202 表示已受理，仍需等待扫描完成，并核对 registry 安装与 jsDelivr/unpkg 可用性。门户只升级到实际验证过的固定版本；升级及回退方式见 [接入说明](./usage.md#版本与回退)。

## 文档站部署

[vercel.json](../vercel.json) 配置安装命令 `pnpm install`、构建命令 `pnpm --filter @aiyazone/portal run build:all`，输出为 `apps/portal/dist`。

| 路径 | 内容 |
| --- | --- |
| `/` | 文档门户 |
| `/storybook/` | 组件文档 |
| `/examples/` | 示例站 |
| `/icons/` | 图标文档 |

Vercel 项目关联 `AIYAZONE/design-system`，生产域名为 `design.aiyazone.com`。Git 集成的生产分支与预览规则以项目设置为准。
