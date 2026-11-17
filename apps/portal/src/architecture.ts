import './style.css';
import { currentArchitecture, currentChecks, futureWork } from './architecture-data';

declare const __ZONE_VERSION__: string;

const renderSiteHeaderSlot = () => '<div data-site-header data-app="portal"></div>';
const renderFooter = () => '<div data-site-footer></div>';

const renderArchitectureFlow = () => currentArchitecture.map((layer) => `
  <article class="architecture-layer">
    <p class="architecture-layer__number">${layer.number}</p>
    <div class="architecture-layer__body">
      <h3>${layer.title}</h3>
      <p class="architecture-layer__implementation">${layer.implementation}</p>
      <p>${layer.detail}</p>
      <p class="architecture-layer__output"><span>产物</span> ${layer.output}</p>
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
  <main class="architecture-main">
    <header class="architecture-intro">
      <p class="home-eyebrow">ZDS · v${__ZONE_VERSION__} · 当前实现</p>
      <h1>系统边界，按代码说。</h1>
      <p>这里展示当前仓库已经交付的资产、生成物与检查项。Atlas、业务运行治理等构想单独列在页面末尾，不混入现状图。</p>
    </header>

    <section class="architecture-section">
      <div class="architecture-section__heading">
        <p class="home-eyebrow">01 / CURRENT SYSTEM</p>
        <h2>从源码到可使用组件</h2>
      </div>
      <div class="architecture-map">
        ${renderArchitectureFlow()}
      </div>
    </section>

    <section class="architecture-section architecture-checks">
      <div class="architecture-section__heading">
        <p class="home-eyebrow">02 / QUALITY LOOP</p>
        <h2>哪些环节现在会被检查</h2>
      </div>
      <ul class="architecture-check-list">
        ${renderChecks()}
      </ul>
      <p class="architecture-caveat">AI 文档为生成过程提供上下文，不会限制模型输出。CI 当前检查本仓库的页面样例和组件包；下游项目需要把适用的检查接入自己的流程。</p>
    </section>

    <section class="architecture-section">
      <div class="architecture-section__heading">
        <p class="home-eyebrow">03 / OUT OF SCOPE TODAY</p>
        <h2>未来事项，明确标为未来</h2>
      </div>
      <div class="architecture-future-list">
        ${renderFutureWork()}
      </div>
    </section>
  </main>
  ${renderFooter()}
`;
