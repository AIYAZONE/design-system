import './style.css';
import './panorama.css';
import { currentArchitecture, currentChecks, futureWork } from './architecture-data';
import { renderInventory } from './panorama-archive';
import { renderPanorama as renderHistory, setupPanorama as setupHistory } from './panorama-history';

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
      <div><p class="site-eyebrow">架构补充资料 · 仓库、进度与清单 <span> ZDS v${__ZONE_VERSION__}</span></p>
      <h1>实现与演进资料</h1>
      <p>架构全景只讲整体结构；这一页放仓库构建关系、检查配置、平台边界、优化进度与完整功能清单。全景见 <a href="/architecture.html">架构设计</a>。</p></div>
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
        <p class="site-eyebrow">02 · 检查</p>
        <h2>仓库已配置的检查</h2>
      </div>
      <ul class="architecture-check-list">
        ${renderChecks()}
      </ul>
      <p class="architecture-caveat">CI 配置包含构建、类型、测试、令牌、文档与 Storybook 检查。视觉对比需要配置截图服务。这里说明检查配置，不代表每次远端流水线的实时结果。</p>
    </section>

    <section class="architecture-section">
      <div class="architecture-section__heading">
        <p class="site-eyebrow">平台与组件库边界</p>
        <h2>Atlas 已有实现，运行能力继续验证</h2>
        <p class="architecture-caveat">Atlas 是同级内容平台，已有管理、搭建、内容 API、预览、发布与渲染源码。ZDS 是体验层基础库。两者的源码存在均不能证明集团多区域、高可用或完整业务应用已投入运行。</p>
      </div>
      <div class="architecture-future-list">
        ${renderFutureWork()}
      </div>
    </section>

    <section class="architecture-section" id="improvements">
      <div class="architecture-section__heading">
        <p class="site-eyebrow">03 · 优化进度</p>
        <h2>优先把接入和发布做可靠</h2>
        <p class="architecture-caveat">组件库继续收敛包接口与发布门禁；平台先确认区域边界与契约，再补可靠发布，按实际负载拆分服务。</p>
      </div>
      <ol class="architecture-priorities">
        <li><span class="priority">本批完成</span><div><h3>让包声明与实际产物一致</h3><p>已补齐十个组件子路径、类型、公共样式和工具包产物。六个包打包后安装到独立项目，验证导入、组件渲染和生产样式。</p><details><summary>查看依据</summary><p>packages/core/vite.config.ts；scripts/build-core-types.rollup.config.mjs；scripts/check-package-exports.mjs；scripts/check-packed-consumer.mjs。</p></details></div></li>
        <li><span class="priority">部分完成</span><div><h3>统一 Lit 的加载方式</h3><p>已统一基础包依赖范围，修复重复注册和多语言重复初始化，验证总包与基础包的两种加载顺序。npm 与 CDN 产物彻底分开仍需下一批处理。</p><details><summary>查看依据</summary><p>基础包外置 Lit 及其子路径；总包与图标包仍保留内置运行依赖。混用验证通过不代表运行副本已经完全合并。</p></details></div></li>
        <li><span class="priority">配置完成</span><div><h3>把质量检查连到实际发布</h3><p>发布已配置为先执行同一提交的 CI，新增代码规范、包文件与独立安装检查。本地完成验证，远端流水线需提交后确认。</p><details><summary>查看依据</summary><p>.github/workflows/ci.yml；.github/workflows/release.yml。基础包独立发布策略与远端保护设置仍需明确。</p></details></div></li>
        <li><span class="priority">本批完成</span><div><h3>统一架构数据与分层职责</h3><p>全景、详情和关系来自同一数据源，代码依赖、运行调用、数据所有权与部署分别展示。页面可以直接使用 ZDS，稳定复用后再建组合层。</p><details><summary>查看依据</summary><p>architecture-data.ts；check-architecture.mjs；docs/markdown/zbc-playbook.md。</p></details></div></li>
        <li><span class="priority">平台待演进</span><div><h3>补区域隔离与可靠发布证据</h3><p>Atlas 当前先标记 LIVE 再写本地产物；目标固定内容、主题、Runtime 与配置版本，校验不可变产物后条件激活并确认 CDN。组织站点授权、区域写入与恢复需要实际验证。</p><details><summary>查看依据</summary><p>Atlas PagePublishService.java；publish-flow.mjs；区域与可靠性设计为候选，不在本次门户中实现。</p></details></div></li>
      </ol>
      <details class="architecture-legacy"><summary>历史架构资料 · 2026-02-26 · 未重新核实</summary><p class="architecture-caveat">以下保留旧层级、关系图、评分与升级设想供追溯。旧文案中的 Atlas“尚未建设”、多站点分类及成熟度百分比已被架构全景纠正，不作为当前事实。</p>${renderHistory()}</details>
    </section>

    <section class="architecture-section" id="inventory">
      <div class="architecture-section__heading">
        <p class="site-eyebrow">04 · 完整清单</p>
        <h2>完整功能清单</h2>
        <p class="architecture-caveat">与架构全景共用同一份数据，按七层列出模块职责、子能力与实现状态。</p>
      </div>
      <div class="ap-root">${renderInventory()}</div>
    </section>
  </main>
  ${renderFooter()}
`;
setupHistory();
