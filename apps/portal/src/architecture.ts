import './style.css';
import './panorama.css';
import { currentArchitecture, currentChecks, futureWork } from './architecture-data';
import { renderPanorama, setupPanorama } from './panorama';

declare const __ZONE_VERSION__: string;

const renderSiteHeaderSlot = () => '<div data-site-header data-app="portal"></div>';
const renderFooter = () => '<div data-site-footer></div>';

const renderArchitectureFlow = () => currentArchitecture.map((layer) => `
  <article class="architecture-layer">
    <p class="architecture-layer__number">${layer.number}</p>
    <div class="architecture-layer__body">
      <h3>${layer.title}</h3>
      <p>${layer.detail}</p>
      <details><summary>查看文件与使用接口</summary><p>${layer.implementation}</p><p>${layer.output}</p></details>
    </div>
  </article>
`).join('');

const renderChecks = () => currentChecks.map((check) => `
  <li><strong>${check.name}</strong><span>${check.detail}</span></li>
`).join('');

const renderFutureWork = () => futureWork.map((item) => `
  <article class="architecture-future">
    <p class="architecture-future__state">${item.state}</p>
    <h3>${item.title}</h3>
    <p>${item.detail}</p>
  </article>
`).join('');

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="architecture-main" id="content">
    <header class="architecture-intro">
      <p class="site-eyebrow">架构设计 · v${__ZONE_VERSION__}</p>
      <h1>从组件到页面，<br>看清系统如何组成。</h1>
      <p>先看当前已经实现的结构，再看多站点的完整规划，以及接下来最需要优化的地方。</p>
      <nav class="architecture-index" aria-label="本页内容">
        <a href="#current">当前架构</a><a href="#panorama">完整规划</a><a href="#improvements">优化建议</a>
      </nav>
    </header>

    <section class="architecture-section" id="current">
      <div class="architecture-section__heading">
        <p class="site-eyebrow">01 · 已实现</p>
        <h2>当前仓库如何工作</h2>
        <p class="architecture-caveat">这是代码与构建关系。组件包会被安装到页面项目中，不是独立运行的后端服务。</p>
      </div>
      <div class="repo-map" aria-label="当前仓库的代码与构建关系">
        <div class="repo-map__assets">
          <article><span>样式来源</span><strong>颜色、字号、间距</strong><code>packages/tokens</code></article>
          <article><span>组件来源</span><strong>基础交互组件</strong><code>packages/core</code></article>
          <article><span>配套能力</span><strong>图标、多语言、工具</strong><code>packages/icons · i18n · utils</code></article>
        </div>
        <div class="repo-map__arrow">↓ 构建、导出与文档提取</div>
        <div class="repo-map__outputs">
          <article><span>安装到项目</span><strong>总包与主题样式</strong><code>@aiyazone/design-system</code><p>组合组件、图标、多语言与 V1/V2/V3 样式。基础包也有各自构建配置。</p></article>
          <article><span>供人和 AI 查阅</span><strong>组件文档与使用说明</strong><code>Storybook · API · llms.txt</code><p>从组件源码提取清单与 API，再生成机器可读说明；交互示例由源码维护。</p></article>
        </div>
        <div class="repo-map__arrow">↓ 使用组件与说明完成页面</div>
        <div class="repo-map__consumer"><strong>业务页面 / 页面示例</strong><span>页面负责数据请求、业务状态和实际业务行为；ZDS 提供基础界面。</span></div>
      </div>
      <details class="architecture-files"><summary>查看源码位置和交付内容</summary><div class="architecture-map">
        ${renderArchitectureFlow()}
      </div></details>
    </section>

    <section class="architecture-section architecture-checks">
      <div class="architecture-section__heading">
        <h2>仓库已配置的检查</h2>
      </div>
      <ul class="architecture-check-list">
        ${renderChecks()}
      </ul>
      <p class="architecture-caveat">CI 配置包含构建、类型、测试、令牌、文档与 Storybook 检查。视觉对比需要配置截图服务。这里说明检查配置，不代表每次远端流水线的实时结果。</p>
    </section>

    <section class="architecture-section" id="panorama">
      <div class="architecture-section__heading">
        <p class="site-eyebrow">02 · 完整规划</p>
        <h2>多站点前端架构全景</h2>
        <p class="architecture-caveat">保留原来的七层能力规划和系统关系图。Atlas、业务组合组件、站点运行与监控是目标范围，本仓库尚未提供这些平台。外部系统的实际部署情况需要另行核实。</p>
      </div>
      ${renderPanorama()}
      <div class="architecture-section__heading">
        <h3>规划与当前实现的边界</h3>
      </div>
      <div class="architecture-future-list">
        ${renderFutureWork()}
      </div>
    </section>

    <section class="architecture-section" id="improvements">
      <div class="architecture-section__heading">
        <p class="site-eyebrow">03 · 优化进度</p>
        <h2>优先把接入和发布做可靠</h2>
        <p class="architecture-caveat">保留组件、样式、文档分开的结构。先收敛包接口、运行依赖与发布验证，再按真实需求建设业务组合组件和内容平台。</p>
      </div>
      <ol class="architecture-priorities">
        <li><span class="priority">本批完成</span><div><h3>让包声明与实际产物一致</h3><p>已补齐十个组件子路径、类型、公共样式和工具包产物。六个包打包后安装到独立项目，验证导入、组件渲染和生产样式。</p><details><summary>查看依据</summary><p>packages/core/vite.config.ts；scripts/build-core-types.rollup.config.mjs；scripts/check-package-exports.mjs；scripts/check-packed-consumer.mjs。</p></details></div></li>
        <li><span class="priority">部分完成</span><div><h3>统一 Lit 的加载方式</h3><p>已统一基础包依赖范围，修复重复注册和多语言重复初始化，验证总包与基础包的两种加载顺序。npm 与 CDN 产物彻底分开仍需下一批处理。</p><details><summary>查看依据</summary><p>基础包外置 Lit 及其子路径；总包与图标包仍保留内置运行依赖。混用验证通过不代表运行副本已经完全合并。</p></details></div></li>
        <li><span class="priority">配置完成</span><div><h3>把质量检查连到实际发布</h3><p>发布已配置为先执行同一提交的 CI，新增代码规范、包文件与独立安装检查。本地完成验证，远端流水线需提交后确认。</p><details><summary>查看依据</summary><p>.github/workflows/ci.yml；.github/workflows/release.yml。基础包独立发布策略与远端保护设置仍需明确。</p></details></div></li>
        <li><span class="priority">本批完成</span><div><h3>减少重复构建，明确组件依赖方向</h3><p>整站入口已去掉第二次门户构建，基础包依赖纳入构建顺序。页面可以直接使用 ZDS，真实重复的业务模式再进入组合层。</p><details><summary>查看依据</summary><p>apps/portal/scripts/build-all.mjs；基础包 package.json；docs/markdown/zbc-playbook.md。图与文字的单一数据来源仍待整理。</p></details></div></li>
        <li><span class="priority">按需推进</span><div><h3>先跑通一个内容页面，再扩展 Atlas</h3><p>先验证“内容数据 → 校验 → 组件映射 → 页面”，定义数据版本、未知组件和旧版本的处理方式。发布、监控和回滚分别由内容平台与业务站点负责。</p><details><summary>查看依据</summary><p>Atlas 与渲染核心当前只出现在规划资料中；packages 下没有相应平台实现。SSR、Edge 与多区域运行能力应由实际页面的性能和部署需求决定。</p></details></div></li>
      </ol>
    </section>
  </main>
  ${renderFooter()}
`;
setupPanorama();
