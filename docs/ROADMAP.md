# ZDS 迭代路线图（AI 约束层升级计划）

> **定位**：ZDS 是一套「标准零件 + 统一规范」：不管页面是人写的还是 AI 写的，都只能用这套零件和规范来拼，出来的东西风格统一、质量达标。
>
> **当前阶段**：🟣 阶段 1（Tokens 真源化）——进行中
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
| 1 | Tokens 真源化（DTCG JSON → 生成物） | 2–3 天 | 🟣 进行中 | — |
| 2 | AI 可消费文档（CEM + API 规格 + llms.txt） | 3–4 天 | ⚪ 未开始 | — |
| 4 | ZBC 薄层规范（与阶段 2 并行） | 1 天 | ⚪ 未开始 | — |
| 3 | CI 质量门禁（GitHub Actions 六关） | 2–3 天 | ⚪ 未开始 | — |
| 5 | 依赖大版本升级（Vite/Vitest/Storybook） | 2–3 天 | ⚪ 未开始 | — |

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

- [ ] 新建 `packages/tokens`，定义 `tokens.json`（W3C DTCG 格式）：color / size / font / radius / shadow / z-index / 语义层（semantic aliases）
- [ ] 编写生成器 `pnpm tokens:build`，产出：
  - [ ] `src/styles/zone/generated.less` —— 替换 `tokens.base.less` 变量段（mixin 结构保留，`--zone-*` 命名零变更）
  - [ ] `src/styles/themes/v3/generated.less` —— 主题覆盖
  - [ ] `packages/tokens/dist/tokens.css` —— 可 CDN 引用
  - [ ] `packages/tokens/dist/tokens.ts` —— typed `as const`，TS 侧消费
- [ ] 新旧并行比对：生成物与现网 CSS 变量 **diff = 0** 后才切换真源（删除手写变量段）
- [ ] `pnpm tokens:check`：真源变更未重新生成 → CI 失败
- [ ] lint 规则：组件 `*.less` 禁止裸 hex / 魔法数值（白名单机制）
- [ ] `docs/tokens/*.mdx` 色板 / 间距表改为从 JSON 自动渲染

**验收**：`tokens:check` 通过；变量名零变更（下游无感知）；文档站 tokens 页与 JSON 一致。

**风险**：mixin 重排可能引入细微样式回归 → 依赖 diff=0 校验 + 阶段 3 视觉回归双保险（建议先跑一次 Chromatic 基线再动手）。

---

## 阶段 2：AI 可消费文档（3–4 天）

**目标**：组件的 API 与用法成为 AI 可直接读取的结构化数据；站点对 AI 暴露标准入口。

- [ ] 接入 `@custom-elements-manifest/analyzer`，从 Lit 源码生成 `custom-elements.json`（attributes / events / slots / CSS parts 自动提取）
- [ ] Storybook 接 CEM：API 表格与 autodocs 自动化
- [ ] 文档生成器 `pnpm docs:build`：CEM + stories 用法 → `docs/api/<component>.md`（用途 / API 表 / 示例代码 / 何时不用 / 可覆盖 CSS 变量）
- [ ] 站点新增 AI 入口（部署于 `design.aiyazone.com`）：
  - [ ] `/llms.txt` —— 精简索引：组件清单 + 硬约束 + token 摘要（约 100 行）
  - [ ] `/llms-full.txt` —— 全量文档拼接
  - [ ] `/ai-usage` 页面 —— **AI 生成页面规范**：只能用 token、只能用基础组件、禁止裸写颜色/尺寸、a11y 必备属性、响应式断点、验收 checklist
- [ ] CI 校验：CEM / api 文档 / llms.txt 与源码同步（不同步即失败）

**验收**：新增组件后一条 `pnpm docs:build` 自动更新三处产物；任一 AI 助手拿到 `llms.txt` + 组件文档即可生成符合 ZDS 规范的页面代码。

---

## 阶段 4：ZBC 薄层规范（1 天，与阶段 2 并行）

**目标**：业务组件层「规划中、保持最薄」，能由 AI 按 ZBC 规范现生成的就不预制。

- [ ] 撰写《ZBC 准入与 AI 页面生成 Playbook》（放 `docs/markdown/`）：
  - [ ] 准入规则：同一模式出现 **≥3 处复用**才沉淀为 ZBC
  - [ ] API 形状约定：受控/非受控、事件命名（`zone-*` custom event）、样式钩子只暴露 CSS 变量
  - [ ] 组合优先：ZBC 必须由基础组件 + token 组合而成，禁止重写原语
  - [ ] AI 页面生成 prompt 模板 + 校验清单（tokens-only / a11y / 响应式）
- [ ] portal 全景图 Domain 层文字与该规范对齐（「规划中 / 准入 ≥3 处复用」）

**验收**：规范文档发布到文档站；占位芯片文案与规范一致。

---

## 阶段 3：CI 质量门禁（2–3 天）

**目标**：所有变更机器把关，AI 参与度越高门禁越重要。

- [ ] 新建 `.github/workflows/ci.yml`，PR 必过六关：
  `install → build → type-check → test → a11y → visual → tokens:check`
- [ ] a11y：Storybook test-runner + axe 扫全部 stories，violations = 0
- [ ] 视觉回归：按「决策登记 #2」执行（Chromatic 或 Playwright），PR 自动 diff + 基线审批
- [ ] 组件 DoD 写入 README/CONTRIBUTING：story + 单测 + a11y + 视觉基线 + 文档块，缺一不可合并
- [ ] 分支保护：master / develop 开 required checks

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

---

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-11-13 | 初版：确立「AI 约束层」定位，规划阶段 0–5 与依赖顺序 |
| 2026-11-13 | 4 项决策按推荐确认；阶段 0 完成（Chromatic token 移出；v1/v2 主题因 examples 引用调整为保留） |
