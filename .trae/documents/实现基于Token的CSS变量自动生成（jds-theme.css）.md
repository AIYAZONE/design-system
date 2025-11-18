## 目录规划
- 在 `src/styles/themes/` 下为每个版本建立独立文件夹：
  - `src/styles/themes/v1/index.less`
  - `src/styles/themes/v2/index.less`
- 公共样式与混入保留在公共文件夹（沿用现有 `src/styles/jds` 作为公共目录，或新建 `src/styles/common`）：
  - 公共文件：`font.css`、`reset.less`、`public.less`、`rte.less`
  - Token基座与版本：`jds/tokens.base.less`、`jds/tokens.v1.less`、`jds/tokens.v2.less`
- 默认入口：
  - `src/styles/index.less` 默认指向 v1（或新建 `src/styles/themes/default/index.less` 并在 `index.less` 中导入）。

## 文件关系
- `themes/v1/index.less`：
  - 引用：`../jds/font.css`、`../content/normalize.css`、`../jds/reset.less`、`../jds/public.less`、`../jds/rte.less`、`../animate/index.css`
  - Token：`../jds/tokens.v1.less`
- `themes/v2/index.less`：同上，Token 指向 `../jds/tokens.v2.less`
- `jds/tokens.base.less`：从现有 `jds/tokens.less` 抽取 `.generate-*` 混入与通用定义（颜色常量等）；版本文件在其基础上输出 :root 变量。

## 构建输出
- 默认样式：`dist/index.css`（来自 `src/styles/index.less`，默认指向 v1）。
- 版本样式：
  - `dist/index.v1.css`（来自 `themes/v1/index.less`）
  - `dist/index.v2.css`（来自 `themes/v2/index.less`）
- （对应待办）变量集自动生成：
  - `dist/jds-theme.v1.css`、`dist/jds-theme.v2.css`（仅 :root CSS 变量，便于按需加载），源于 `jds/tokens.v1.less`、`jds/tokens.v2.less`。

## 构建配置与脚本
- 新增构建模式 `--mode themes`：
  - 使用 `rollupOptions.input` 指定：`src/styles/index.less`、`src/styles/themes/v1/index.less`、`src/styles/themes/v2/index.less`。
  - 构建后重命名：生成 `index.css`、`index.v1.css`、`index.v2.css`。
- 变量集生成（可加入同一模式或独立命令）：
  - 编译 `jds/tokens.v1.less`、`jds/tokens.v2.less` → `jds-theme.v1.css`、`jds-theme.v2.css`。
- 保持库构建（`design:build:lib`/`design:build:single`）现状；主题版本文件通过 `design:build:themes` 产出。

## 使用指南
- 默认：`import '@jackery/design-system/dist/index.css'`。
- 使用 v2：`import '@jackery/design-system/dist/index.v2.css'`。
- 仅变量（可选）：按需加载 `jds-theme.v2.css` 以切换变量，结构样式默认不变。
- （可选属性版）在版本样式包裹 `:root[data-jds-theme-version="v2"]`，允许同页共存并通过 `document.documentElement.dataset.jdsThemeVersion = 'v2'` 切换。

## 验证与风险
- 验证：构建后核对三个 CSS 产物与示例页展示。
- 风险：版本间差异集中在 Token 层，公共模块一致；通过 `tokens.base.less` 降低重复与维护成本。

## 文档与待办
- 更新样式规范文档（04）：增加“版本化主题”章节与消费示例。
- 待办（11）“CSS 变量自动生成”：在版本构建中产出 `jds-theme.v*.css`，并记录脚本用法。