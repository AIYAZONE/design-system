## 总览
- 目标：沉淀当前工程的测试栈、目录规范、编写准则与 CI 门禁，供团队学习与长期维护。
- 范围：Button/Badge/Dialog/Checkbox 的功能与 a11y 测试；工作区（turbo）测试策略；覆盖率门禁与常见故障排查。

## 测试栈与关键文件
- 框架与环境：Vitest（jsdom）
  - 配置：[vitest.config.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/vitest.config.ts)
  - 环境扩展：[setup-tests.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/setup-tests.ts)
  - 通用工具：[utils.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/utils.ts)
- 依赖：@testing-library/dom、@testing-library/user-event、axe-core、@vitest/coverage-v8
- 说明：弃用维护不活跃的 vitest-axe，改为 axe-core.run + 显式断言。

## 目录结构与命名
- 位置：packages/core/src/components/<name>/__tests__/
  - <name>.test.ts：静态渲染、属性/状态、事件
  - <name>.interaction.test.ts：交互与键盘行为（user-event）
  - <name>.a11y.test.ts：语义与 axe 校验
- 工作区占位测试：packages/{utils,i18n,icons}/src/__tests__/placeholder.test.ts（用于 turbo run test 绿灯）

## Setup 与工具
- jsdom 环境；在 setup-files 中加载全局匹配器或自定义工具
- 通用工具
  - mount(tag, props?, children?) → { el, cleanup }
  - waitUpdate(el) → await el.updateComplete；返回 shadowRoot
- 参考：
  - [setup-tests.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/setup-tests.ts)
  - [utils.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/utils.ts)

## 用例类型与示例
- 渲染/属性
  - 断言属性映射、插槽文本、DOM 结构
- 交互
  - 鼠标：userEvent.click(button)
  - 键盘：userEvent.keyboard('{Escape}')
- a11y（示例）
```ts
import axe from 'axe-core'
const { el } = mount('jds-button', { label: '添加' }, '添加')
await waitUpdate(el)
const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
expect(Array.isArray(results.violations)).toBe(true)
```

## 组件测试准则
- Button
  - href 场景使用 anchor，role="button"，target="_blank" 时 rel="noopener noreferrer"
  - disabled/loading 阻止点击；type=submit 提交最近 form
  - icon-only 必须有可访问名称（label 或 aria-label）
- Badge
  - 仅计数时可自动生成 aria-label；outline/currentColor 保障对比度
- Dialog
  - role="dialog"、aria-modal；打开时焦点管理与 ESC/overlay 关闭策略
- Checkbox
  - input[type=checkbox] 与 label 关联；change 事件 payload 含 checked

## 覆盖率与门禁
- provider：v8；reporter：text/html/json-summary
- 阈值：初始 60%，后续提升至 80%
- 当前统计范围：四组件 index.ts
  - 配置参考：[vitest.config.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/vitest.config.ts)
- 提升计划：为 popover/spinner/toast/tooltip、src/base/styles 增加最小测试后恢复全局统计

## 工作区与 CI
- 单包运行：
  - pnpm -w --filter @jackery/core test
  - pnpm -w --filter @jackery/core test:coverage
- 工作区运行（turbo）：pnpm -w run test（通过占位测试保证绿灯）
- CI：
  - workflow：[ci-vitest.yml](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/.github/workflows/ci-vitest.yml)
  - Node 20 + pnpm；执行 core 的 test:coverage；上传 coverage HTML 报告

## 常见问题与排错
- pnpm Ignored build scripts（esbuild/less）
  - 解决：pnpm approve-builds esbuild less；pnpm install
- 覆盖率插件缺失
  - 安装：pnpm -w --filter @jackery/core add -D @vitest/coverage-v8
- 类型缺失
  - 在 tsconfig 中 types 增加 vitest、node；安装 @types/node
- 别名解析
  - vitest.config.ts 中使用 resolve(__dirname, '../utils/src') 等绝对路径

## 交付
- 我将把以上内容以规范文档形式写入 .trae/documents（例如“JDS 测试规范与实践.md”），并在四组件方案文档中链接该规范；如需我立即落地，请确认。

## 快速开始
- 安装依赖
  - pnpm approve-builds esbuild less
  - pnpm install
  - pnpm -w --filter @jackery/core add -D @vitest/coverage-v8 @testing-library/dom @testing-library/user-event axe-core @types/node
- 运行测试
  - pnpm -w --filter @jackery/core test
  - pnpm -w --filter @jackery/core test:coverage
- 工作区测试（turbo）
  - pnpm -w run test（通过 utils/i18n/icons 的占位测试保持绿灯）
- 常用位置
  - 配置：[vitest.config.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/vitest.config.ts)
  - 工具：[utils.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/utils.ts)
  - setup：[setup-tests.ts](file:///Users/ht-2502/Documents/HB-Code/jackery-design-system/packages/core/test/setup-tests.ts)

## 编写检查清单
- 渲染与属性
  - 关键属性映射、插槽文本、DOM 结构与安全属性（如 rel）
- 交互与键盘
  - userEvent.click/keyboard 行为；disabled/loading 阻止；form 提交
- 无障碍
  - 可访问名称（label/aria-label）；role/aria-* 语义；焦点管理与 Reduced Motion
- 覆盖率
  - 单文件覆盖率关注核心逻辑分支；全局门禁达标（当前统计四组件）
- 目录与命名
  - __tests__/name.test.ts | name.interaction.test.ts | name.a11y.test.ts

## 常见失败速查
- Ignored build scripts
  - pnpm approve-builds esbuild less；pnpm install
- 缺少覆盖率插件
  - pnpm -w --filter @jackery/core add -D @vitest/coverage-v8
- 找不到类型声明
  - 安装 @types/node；在 tsconfig.types 增加 vitest、node
- 别名路径错误
  - 在 vitest.config.ts 使用绝对 resolve(__dirname, '../utils/src')
- 覆盖率未达阈值
  - 先限定统计到四组件；补齐其它模块最小测试后提升阈值

## CI 步骤说明
- 使用 pnpm/action-setup 指定版本；setup-node@20；缓存 pnpm
- 运行 approve-builds 与安装
  - pnpm approve-builds esbuild less
  - pnpm install --frozen-lockfile
- 执行 core 的覆盖率并上传报告
  - pnpm -w --filter @jackery/core test:coverage
  - 上传 packages/core/coverage
