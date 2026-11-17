# @aiyazone/core

基础 Web Components，提供总入口、十个组件子路径及公共主题样式。

```ts
import '@aiyazone/core/button';
import '@aiyazone/core/dropdown';
import '@aiyazone/core/styles';
```

总入口 `import '@aiyazone/core'` 会注册全部基础组件。子路径仅加载该组件及其必要依赖；例如弹窗会使用按钮。组件内部样式随 JavaScript 加载，公共主题样式需要显式导入。

包提供 ESM、CommonJS 和 TypeScript 声明。Lit 及其子路径在基础包中使用外部依赖，版本范围统一为 `^3.3.1`。包管理器会安装多语言和工具包；组件注册、样式与多语言初始化不得在生产构建中被移除。

同一页面混用当前版本的总包与基础包时，会复用第一个注册的组件构造器。应用应统一设计系统版本；这一处理不保证不同版本的组件兼容。总包与图标的现有自包含产物仍保留内置 Lit，混用时不应把“没有重复注册”理解为“只有一个运行副本”。

组件需要浏览器 DOM；本次 CommonJS 消费者检查使用 Node 24 和 DOM 测试环境，不能据此宣称组件支持直接在 Node 18 中运行或提供服务端渲染。

仓库内的验证命令：

```sh
pnpm run build
pnpm run design:build
pnpm run packages:check
pnpm run packages:test
```

最后一个命令将六个包打成 tarball，安装到独立临时项目，验证包内文件、导入方式、组件注册、多语言初始化、严格类型检查和生产样式输出。
