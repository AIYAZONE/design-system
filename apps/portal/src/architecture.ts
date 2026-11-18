import './style.css';
import './panorama.css';
import './panorama-overview.css';
import { renderPanorama, setupPanorama } from './panorama';

declare const __ZONE_VERSION__: string;

const renderSiteHeaderSlot = () => '<div data-site-header data-app="portal"></div>';
const renderFooter = () => '<div data-site-footer></div>';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="architecture-main" id="content">
    <header class="architecture-intro">
      <div><p class="site-eyebrow">数字商业 · 能力与协作 <span> ZDS v${__ZONE_VERSION__}</span></p>
      <h1>数字商业平台架构全景</h1>
      <p>从业务入口到内容、组件、工程与运行，一张彩色全景看清主要能力和协作。</p></div>
    </header>

    <section id="panorama" aria-label="数字商业能力全景">
      ${renderPanorama()}
      <p class="architecture-more">仓库实现、检查配置和历史完整清单见 <a href="/architecture-reference.html">实现与演进资料</a>。</p>
    </section>
  </main>
  ${renderFooter()}
`;
setupPanorama();
