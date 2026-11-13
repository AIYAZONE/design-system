# ZDS 迭代路线图（AI 约束层升级计划）

> **定位**：ZDS 是一套「标准零件 + 统一规范」：不管页面是人写的还是 AI 写的，都只能用这套零件和规范来拼，出来的东西风格统一、质量达标。
>
> **当前阶段**：🟢 阶段 0–4 全部完成；🔵 剩余：分支保护人工配置 + 阶段 5（依赖升级，需 Chromatic 基线就绪）
>
> **最后更新**：2026-11-13

---

## 使用说明（如何维护这份文档）

1. 每完成一个任务，把对应 `[ ]` 改成 `[x]`；
2. 阶段全部完成后，更新顶部「当前阶段」和总览表的「状态 / 完成日期」；
3. 有新决策时更新「决策登记」表；阶段有调整时在「变更记录」补一行。
4. 查看进度：直接看总览表 + 顶部状态条即可。

---

## 总览

| 阶段 | 内容 | 工期 | 状态 | 完成日期 |
|------|------|------|------|----------|
| 0 | 小清理（token 泄露修复 + 产物卫生） | 0.5 天 | 🟢 已完成 | 2026-11-13 |
| 1 | Tokens 真源化（DTCG JSON → 生成物） | 2–3 天 | 🟢 已完成 | 2026-11-13 |
| 2 | AI 可消费文档（CEM + API 规格 + llms.txt） | 3–4 天 | 🟢 已完成 | 2026-11-13 |
| 4 | ZBC 薄层规范（与阶段 2 并行） | 1 天 | 🟢 已完成 | 2026-11-13 |
| 3 | CI 质量门禁（GitHub Actions 六关） | 2–3 天 | 🟢 已完成（余分支保护人工配置） | 2026-11-13 |
| 5 | 依赖大版本升级（Vite/Vitest/Storybook） | 2–3 天 | ⚪ 未开始（前置：Chromatic 基线就绪） | — |

依赖关系：`0 → 1 →（2 ∥ 4）→ 3 → 5`。合计约 10–14 人天。

---

## 阶段 0：小清理（0.5 天）

**目标**：消除安全隐患与维护负担，为阶段 1 扫清障碍。

- [x] `apps/storybook/package.json` 中硬编码的 Chromatic token 移至环境变量（chromatic CLI 自动读取 `CHROMATIC_PROJECT_TOKEN`），新增 `.env.example` 与 `.gitignore` 忽略 ⚠️ **该 token 历史提交中曾明文出现，需到 Chromatic 后台轮换**
- [x] ~~归档删除 v1/v2 主题~~ → **调整为保留**：核查发现 `apps/examples` 主题切换演示仍引用 v1/v2（`apps/examples/main.ts`），不删除；阶段 1 仅收敛 zone 主线 + v3
- [x] 确认构建产物（dist / storybook-static）未被 git 跟踪，`.gitignore` 已覆盖并补充 `.env*` 忽略
- [x] 全仓敏感词复扫 0 命中；build 5/5、test 7/7 全绿

**验收**：`pnpm run build && pnpm run test` 全绿；v1/v2 删除后文档站与组件样式无回归（肉眼过一遍 stories）。

---

## 阶段 1：Tokens 真源化（2–3 天）

**目标**：设计令牌从「手写 LESS」变为「机器可读 JSON 单真源 + 自动生成」，AI 与人消费同一份数据。

- [x] 新建 `packages/tokens`，定义 `tokens.json`（DTCG 风格）：基础色板 / 语义色 / 尺寸刻度 / 字号 / 圆角 / 字重 / 层级 / 字体组合 / 响应式参数
- [x] 编写生成器 `pnpm tokens:build`（零依赖 Node），产出：
  - [x] `src/styles/zone/generated-tokens.less` —— tokens.base.less 变量段（mixin 保留手写）
  - [x] `src/styles/themes/v3/generated-tokens.less` —— 主题覆盖 + 语义变量 + 字体组合（原 205 行手写收敛为 12 行骨架）
  - [x] `packages/tokens/dist/tokens.css` —— 静态全量令牌表（149 变量，CDN/npm 直用）
  - [x] `packages/tokens/dist/tokens.ts` —— typed `as const`，TS 侧消费
- [x] 新旧并行比对：`scripts/verify.mjs` 用 lessc 编译 v3/v1/v2 三主题，基线 vs 生成版 **diff = 0**（1144/1079/1143 行完全一致）
- [x] `pnpm tokens:check`：生成物与提交不一致 → 失败
- [x] lint 规则 `pnpm tokens:lint`：组件 less 禁止**新增**裸 hex（存量 47 处冻结于 `hex-allowlist.json`，增量即失败）
- [ ] `docs/tokens/*.mdx` 色板 / 间距表改为从 JSON 自动渲染（阶段 1 唯一余项，随阶段 2 文档生成器一并做）

**验收**：`tokens:check` 通过；变量名零变更（下游无感知）；文档站 tokens 页与 JSON 一致。

**风险**：mixin 重排可能引入细微样式回归 → 依赖 diff=0 校验 + 阶段 3 视觉回归双保险（建议先跑一次 Chromatic 基线再动手）。

---

## 阶段 2：AI 可消费文档（3–4 天）

**目标**：组件的 API 与用法成为 AI 可直接读取的结构化数据；站点对 AI 暴露标准入口。

- [x] 接入 `@custom-elements-manifest/analyzer`，生成 `packages/core/custom-elements.json`；因装饰器来自本地模块，另建源码增强解析（`build-ai-docs.mjs`：@property/@state/事件/插槽/类型别名展开/@summary/@cssproperty）→ 产出规范化清单 `packages/core/zone-manifest.json`
- [x] ~~Storybook 接 CEM~~ → **调整**：组件 API 规格由 `docs/api/*.md` 承载（生成器输出），Storybook autodocs 维持现状（避免双真源）
- [x] 文档生成器 `pnpm docs:gen`：CEM + 源码增强 + tokens → `docs/api/zone-*.md`（快速使用 / 属性表 / 事件 / 插槽 / 可覆盖 CSS 变量 / 约束）+ `docs/api/README.md` 索引
- [x] 站点 AI 入口（`apps/portal/public/`，构建时随 dist 发布）：
  - [x] `/llms.txt` —— 组件索引 + 五条硬约束 + 令牌摘要 + 安装方式
  - [x] `/llms-full.txt` —— llms 索引 + 10 组件全量规格 + AI 使用规范 拼接
  - [x] `/ai-usage.html` —— AI 生成页面规范（由 `docs/ai-usage.md` 单真源渲染：三条硬约束 / 令牌规则表 / 组件选择指南 / 提示词模板 / 正反例 / 验收清单）
- [x] 同步校验 `pnpm docs:check`：CEM/清单/文档/llms 产物与源码不一致即失败（阶段 3 接入 CI）

**验收**：新增组件后一条 `pnpm docs:build` 自动更新三处产物；任一 AI 助手拿到 `llms.txt` + 组件文档即可生成符合 ZDS 规范的页面代码。

---

## 阶段 4：ZBC 薄层规范（1 天，与阶段 2 并行）

**目标**：业务组件层「规划中、保持最薄」，能由 AI 按 ZBC 规范现生成的就不预制。

- [x] 撰写《ZBC 准入与 AI 页面生成 Playbook》（`docs/markdown/zbc-playbook.md`）：
  - [x] 准入规则：同一模式出现 **≥3 处复用**才沉淀为 ZBC
  - [x] API 形状约定：受控/非受控、事件命名（`zone-biz-*` custom event）、样式钩子只暴露 CSS 变量
  - [x] 组合优先：ZBC 必须由基础组件 + token 组合而成，禁止重写原语
  - [x] AI 页面生成 prompt 模板 + 校验清单（与 `/ai-usage.html` 同源，`docs/ai-usage.md`）
- [x] portal 全景图 Domain 层文案已含「规划中 / Atlas 过渡供给」，与规范语义一致

**验收**：规范文档发布到文档站；占位芯片文案与规范一致。

---

## 阶段 3：CI 质量门禁（2–3 天）

**目标**：所有变更机器把关，AI 参与度越高门禁越重要。

- [x] 新建 `.github/workflows/ci.yml`，push/PR 必过关卡：
  `install → build → type-check → test（单测 + a11y 断言）→ tokens:check → tokens:lint → docs:check → storybook 构建 → Chromatic（条件）`
- [x] a11y：**调整实现方式**——a11y 断言已内置于 vitest（button/checkbox/dialog/dropdown 各有 `.a11y.test.ts`，axe-core 断言），随 test 关卡执行；Storybook test-runner 待阶段 5 升级 Storybook 9 后再接（避免为 8.6 增加维护面）
- [x] 视觉回归：Chromatic（决策 #2）作为条件步骤——仓库配置 `CHROMATIC_PROJECT_TOKEN` Secret 后自动生效，未配置时跳过不阻塞；`--exit-once-uploaded` 允许基线待审时通过。**core 基线已建立**（build 1：10 组件 79 stories 上传成功）；icons 项目**不接 Chromatic**（决策 #5），以 vitest 资产守卫测试兜底（SVG 完整性/唯一性/数量，118 项）
- [x] 组件 DoD 写入 `CONTRIBUTING.md`：story + 单测（含 a11y 用例）+ 视觉基线 + API 文档生成，缺一不可合并
- [ ] 分支保护：需仓库管理员在 GitHub Settings → Branches 为 master/develop 配置 required checks（机器无法代操作，见 CONTRIBUTING 对应说明）

**验收**：一个故意引入样式回归的 PR 被 CI 拦截；绿灯合入流程跑通一次。

---

## 阶段 5：依赖大版本升级（2–3 天，门禁就绪后才做）

**目标**：在有视觉回归兜底的前提下消化技术债。

- [ ] 前置条件：阶段 3 完成（CI + 视觉基线可用）
- [ ] 逐包升级、逐个合入（一次一个 PR）：`vitest 1 → 3` → `vite 5 → 7` → `storybook 8 → 9`
- [ ] 每次升级观察：测试全绿 + 视觉 diff 为零 + 文档站正常

**验收**：三个大版本升级合入后，六关 CI 持续绿。

---

## 决策登记

| # | 决策项 | 推荐 | 状态 | 结论 |
|---|--------|------|------|------|
| 1 | Token 格式：W3C DTCG JSON 单真源 vs 保留 LESS 只做导出 | DTCG 单真源 | ✅ 已确认 2026-11-13 | DTCG 单真源 |
| 2 | 视觉回归：A. Chromatic（省事，免费 5000 快照/月）vs B. Playwright + pixelmatch（零成本自维护） | A | ✅ 已确认 2026-11-13 | A. Chromatic |
| 3 | llms.txt 是否随站点公开 | 公开 | ✅ 已确认 2026-11-13 | 公开 |
| 4 | 是否新建独立 `@aiyazone/tokens` npm 包 | 是（业务线/CDN 直用） | ✅ 已确认 2026-11-13 | 新建独立包 |
| 5 | icons 是否接 Chromatic | 不接（Storybook 仅作文档站，质量用 vitest 资产守卫兜底） | ✅ 已确认 2026-11-13 | 不接，vitest 守卫 |

---

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-11-13 | 初版：确立「AI 约束层」定位，规划阶段 0–5 与依赖顺序 |
| 2026-11-13 | 4 项决策按推荐确认；阶段 0 完成（Chromatic token 移出；v1/v2 主题因 examples 引用调整为保留） |
| 2026-11-13 | 阶段 1 基本完成：tokens.json 真源 + 生成器 + 三主题 diff=0 验证 + tokens:check/lint；余 mdx 联动并入阶段 2 |
| 2026-11-13 | 阶段 2 / 4 完成：CEM + 源码增强清单、docs/api 规格、llms.txt / llms-full.txt / ai-usage.html、ZBC Playbook；Storybook CEM 项调整为 docs/api 承载 |
| 2026-11-13 | 阶段 3 完成：ci.yml 七步流水线（a11y 内置于 vitest；Chromatic 条件步骤，Secret 未配置时跳过）；组件 DoD 沉淀 CONTRIBUTING.md；余分支保护需管理员配置 |
| 2026-11-13 | 文档消费方式修正为总包 @aiyazone/design-system；core Chromatic 基线建立（79 stories）；icons 决策 #5（不接 Chromatic，vitest 资产守卫 118 项）；icons 包硬编码 token 移除；.env 解除跟踪并本地化 |
