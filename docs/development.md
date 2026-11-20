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

## 组件状态与边界验证

运行 `node scripts/check-component-refinement.mjs` 前先执行 `pnpm portal:build:all`。该浏览器检查覆盖 V1/V2/V3、站点明暗主题、1440/768/414/375/320px：长文本、复选框半选、方向键跳过禁用项、多选焦点行、浮层内部滚动、提示宽度、弹窗关闭区域、关闭后焦点恢复和通知重放。另验证 420px 高度窗口。

在 `/examples/pages/components/refinement.html` 可实际操作这些场景。全部既有 Examples 与场景保留，原按钮设计维持不变；图标继续复用现有图标包。库中没有独立 Input 组件，本轮不添加新的输入框 API。

| 组件 | 本轮精修 |
| --- | --- |
| Button | 保留现有外观与全部状态，回归加载、禁用和键盘操作 |
| Checkbox | 增加半选；长标签换行、首行对齐，维持整行点击区域 |
| Badge | 长文本不溢出；图标不压缩；空图标插槽不占额外间距；链接焦点保留 |
| Dropdown | 补充触发器悬停反馈、选中项字重及触屏选项点击区域 |
| FilterSelect | 键盘焦点行可见；选项只在列表内部滚动；面板受可用高度约束；避免延迟滚动误关闭 |
| Dialog | 关闭区域至少 44px；长标题留出关闭区域；长正文独立滚动；短窗口和底部安全区适配 |
| Popover | 长文本换行、正文对比度、视口边距与内部滚动 |
| Tooltip | 默认最大宽度 320px；窄屏收缩和长标识符换行 |
| Spinner | 行内居中；暂停态停止旋转；尊重减少动效设置 |
| Toast | 父容器约束、长文本和操作按钮换行、标题层级、图标及关闭按钮对齐 |

导航层级使用独立的 `--portal-header-index`，低于组件浮层和对话框。Examples 的锚点偏移由共享 Header 统一处理，侧栏使用 Header 实际高度，不重复叠加固定偏移。

## 响应式与 Examples 文档验证

- `node scripts/check-responsive-scale.mjs`：检查三套主题在 320/375/414/600/768/820/900/1023/1024/1280/1440px 的字号、控件高度和溢出，以及 1024px 断点两侧的跳变。
- `node scripts/check-examples-docs.mjs`：先构建站点和总包（`pnpm portal:build:all`、`pnpm design:build`），再检查全部 20 个页面的文档与复制反馈，独立构建 60 份复制示例并分别在手机和平板宽度运行。

逐页文案和代码放在 `apps/examples/usage-content.ts`，共享渲染与复制逻辑位于 `usage-docs.ts`。文档使用独立的站点样式，不覆盖演示组件；仅向现有页面添加指南、快速接入和注意事项，原示例区域及三套主题保留。新增页面应同步添加对应指导内容，并通过独立示例构建验证。
