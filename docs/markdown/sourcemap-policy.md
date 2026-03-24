# Sourcemap 策略（构建与发布）

## 背景

`*.map`（Source Map）用于把构建后的 JS/CSS 映射回源码（如 TS/Less），可以显著提升调试体验。但在包发布场景中，`*.map` 可能包含 `sourcesContent`，等同于把源码内容随包分发，扩大源码可见面。

因此本设计系统采用“默认不生成、不发布；需要排障时显式开启”的策略。

## 当前策略

### 1) 默认不生成 sourcemap

对 `vite build --mode library / library-single / themes`：

- 默认不生成 `.map`
- 仅当设置环境变量 `JDS_SOURCEMAP=true` 时才生成 `.map`

环境变量来源可以是 shell 环境，也可以在仓库根目录通过 `.env` / `.env.<mode>` 配置。

### 2) npm 包默认不包含任何 `.map`

- 发布白名单不包含根产物的 `index.*.map`
- `dist/chunks` 仅发布 `*.js`，不发布 `*.js.map`（包含 icon 相关 chunk）
- `.npmignore` 兜底排除 `dist/**/*.map`

## 影响说明

- 业务侧 DevTools 调试体验下降：安装包后，Sources 面板通常只能看到编译后的 JS，无法直接回溯到 TS 行号。
- 线上报错定位能力下降：若没有额外的错误追踪平台/源码映射能力，堆栈会更偏向编译后产物的调用栈。
- 源码暴露风险下降：避免在私有 npm 包内直接分发源码映射内容（尤其是包含 `sourcesContent` 的 map）。

## 使用指南

### 日常构建 / 发版（默认）

```bash
pnpm run design:build
```

- 产物目录 `dist/` 默认不包含 `.map`
- npm 发布包默认不包含 `.map`

### 临时排障（需要 map 时）

```bash
JDS_SOURCEMAP=true pnpm run design:build
```

适用场景：

- 需要用 `dist/` 产物复现问题并进行断点/映射定位
- 需要临时检查构建后 chunk 与源码的映射关系

注意：

- 排障结束后，不建议将带 `.map` 的 `dist/` 产物用于发布

### 避免“旧 map 残留”误判

由于部分构建场景可能不会自动清理历史文件，若你曾开启 `JDS_SOURCEMAP=true` 生成过 `.map`，之后关闭 sourcemap 再次构建时，历史 `.map` 可能残留在 `dist/` 中。

建议：

- 发版前清理 `dist/`，或至少清理 `dist/**/*.map`，再执行 `pnpm run design:build`

## 发布前检查清单

- 本地确认 `dist/` 是否包含 `.map`：
  - 检查 `dist/**/*.map` 应为空
- npm 包内容确认（推荐）：
  - 运行 `npm pack`
  - 确认输出清单中不存在 `dist/*.map` 与 `dist/chunks/*.map`

## 未来可扩展方案（可选）

如果后续引入错误追踪平台（例如 Sentry）并希望线上堆栈可回溯源码：

- 仍保持 npm 包不发布 `.map`
- 采用 “hidden sourcemap + 上传到监控平台” 的方式实现线上定位，同时避免公开分发 map
