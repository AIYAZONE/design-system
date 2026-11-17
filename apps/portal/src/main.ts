import '../../../src/styles/index.less';
import './style.css';
import '@aiyazone/core';
import '@aiyazone/icons';

declare const __ZONE_VERSION__: string;

const renderSiteHeaderSlot = () => '<div data-site-header data-app="portal"></div>';
const renderFooter = () => '<div data-site-footer></div>';

const renderCover = () => `
  <section class="home-cover" aria-labelledby="home-title">
    <div class="home-cover__meta">
      <span>AIYAZONE <i aria-hidden="true">/</i> DESIGN SYSTEM</span>
      <span>PUBLIC SPEC · v${__ZONE_VERSION__} · LIT</span>
    </div>
    <div class="home-cover__grid">
      <div class="home-cover__copy">
        <p class="home-eyebrow">组件 · TOKENS · API</p>
        <h1 id="home-title">人和 AI，<br><span>共用一套标准。</span></h1>
        <p class="home-cover__lede">令牌、Lit Web Components、图标与 API 说明来自同一仓库。AI 文档提供上下文，真实页面样例由代码检查。</p>
        <div class="home-actions">
          <a class="home-action home-action--primary" href="/storybook/">浏览组件 <span aria-hidden="true">↗</span></a>
          <a class="home-action home-action--text" href="/ai-demo.html">查看检查样例 <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <section class="home-specimen" aria-labelledby="specimen-title">
        <div class="home-specimen__meta">
          <span>LIVE SPECIMEN</span>
          <span>001 / CORE ELEMENTS</span>
        </div>
        <div class="home-specimen__display">
          <p class="home-specimen__element">&lt;zone-button&gt;</p>
          <h2 id="specimen-title">真实组件，<br>正在运行。</h2>
          <p>页面里的控件由 ZDS 注册与渲染，可直接进入文档查看 API。</p>
        </div>
        <div class="home-specimen__controls">
          <div class="home-specimen__control">
            <span class="home-specimen__label">BUTTON</span>
            <zone-button label="查看组件" variant="primary" size="medium" href="/storybook/">查看组件</zone-button>
          </div>
          <div class="home-specimen__control">
            <span class="home-specimen__label">BADGE</span>
            <zone-badge kind="success" variant="soft">API 已连接</zone-badge>
          </div>
          <div class="home-specimen__control home-specimen__control--check">
            <span class="home-specimen__label">CHECKBOX</span>
            <zone-checkbox checked name="specimen-check" aria-label="真实组件状态">真实组件状态</zone-checkbox>
          </div>
        </div>
        <div class="home-specimen__foot">
          <span>Lit custom elements</span>
          <span>可在原生 HTML 与主流框架中使用</span>
        </div>
      </section>
    </div>
  </section>
`;

const renderSystemPath = () => `
  <section class="home-system" id="system" aria-labelledby="system-title">
    <div class="home-section-head">
      <p class="home-section-head__index">01 <span>/</span> DELIVERY PATH</p>
      <div>
        <h2 id="system-title">从源码到页面，<br>每一步都能对应。</h2>
        <p>一套版本化的前端基础：源数据留在仓库，构建产出可接入的包和可查阅的说明。</p>
      </div>
    </div>
    <ol class="home-flow">
      <li class="home-flow__step">
        <span class="home-flow__number">01</span>
        <h3>定义来源</h3>
        <p>DTCG 风格令牌、Lit 组件与 SVG 图标，在同一仓库维护。</p>
        <code>tokens · core · icons</code>
      </li>
      <li class="home-flow__step">
        <span class="home-flow__number">02</span>
        <h3>生成接口</h3>
        <p>从组件 API 生成清单、文档和 AI 可读索引，版本随包发布。</p>
        <code>manifest · docs · llms.txt</code>
      </li>
      <li class="home-flow__step">
        <span class="home-flow__number">03</span>
        <h3>接入页面</h3>
        <p>通过 npm 或 CDN 使用组件；同一套自定义元素可进入不同框架。</p>
        <code>npm · CDN · Storybook</code>
      </li>
    </ol>
    <nav class="home-related" aria-label="相关技术资料">
      <a href="/storybook/?path=/docs/02-设计变量-06-主题与-token-架构--document">令牌与架构 <span aria-hidden="true">↗</span></a>
      <a href="/storybook/">组件 API <span aria-hidden="true">↗</span></a>
      <a href="/llms.txt">llms.txt <span aria-hidden="true">↗</span></a>
    </nav>
  </section>
`;

const renderAICheck = () => `
  <section class="home-ai-check" id="ai-check" aria-labelledby="ai-check-title">
    <div class="home-ai-check__index">02 <span>/</span> AI OUTPUT · CHECKED</div>
    <div class="home-ai-check__body">
      <div class="home-ai-check__heading">
        <p class="home-eyebrow">从提示词，走到可检查的产物</p>
        <h2 id="ai-check-title">AI 规范写建议。<br><span>检查面对真实输出。</span></h2>
      </div>
      <div class="home-ai-check__detail">
        <p>CI 会检查本仓库的 AI 页面样例：组件 API、图标名、令牌引用、常见裸值和表单关联。它不代表所有模型输出都自动合规。</p>
        <ul aria-label="样例检查范围">
          <li>组件 HTML 与 JS 属性</li>
          <li>图标与令牌名称</li>
          <li>常见样式裸值</li>
          <li>标签与输入关联</li>
        </ul>
      </div>
    </div>
    <div class="home-ai-check__foot">
      <span><i aria-hidden="true"></i> CI SAMPLE CHECK <code>apps/portal/public/ai-demo.html</code></span>
      <a href="/ai-demo.html">打开交互页面 <span aria-hidden="true">↗</span></a>
      <a href="/ai-usage.html">阅读 AI 指南 <span aria-hidden="true">↗</span></a>
    </div>
  </section>
`;

const renderInstall = () => {
  const npmCmd = 'pnpm add @aiyazone/design-system';
  const cdnSnippet = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@${__ZONE_VERSION__}/dist/index-v3.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@${__ZONE_VERSION__}/dist/index.esm.js"></script>`;
  return `
    <section class="home-install" id="install">
      <div class="home-install__intro">
        <p class="home-section-head__index">03 <span>/</span> GET STARTED</p>
        <h2>先接入，<br>再按 API 组合。</h2>
        <p>应用项目从 npm 开始；不使用构建工具的静态页面可固定版本并从 CDN 引入。</p>
      </div>
      <div class="home-install__examples">
        <div class="home-code">
          <div class="home-code__head"><span>PACKAGE <i>/</i> NPM</span><button type="button" data-copy="${npmCmd}">复制命令</button></div>
          <pre><code>${npmCmd}</code></pre>
        </div>
        <div class="home-code">
          <div class="home-code__head"><span>STATIC <i>/</i> CDN · v${__ZONE_VERSION__}</span><button type="button" data-copy="${cdnSnippet.replaceAll('"', '&quot;')}">复制片段</button></div>
          <pre><code>${cdnSnippet.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</code></pre>
        </div>
      </div>
    </section>
  `;
};

const renderFooterLinks = () => `
  <nav class="home-endnotes" aria-label="资源索引">
    <span>INDEX</span>
    <a href="/examples/">示例</a>
    <a href="/icons/">图标</a>
    <a href="/architecture.html">架构与范围</a>
    <a href="/ai-usage.html">AI 指南</a>
  </nav>
`;

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="home-main">
    ${renderCover()}
    ${renderSystemPath()}
    ${renderAICheck()}
    ${renderInstall()}
    ${renderFooterLinks()}
  </main>
  ${renderFooter()}
`;

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  }
};

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const copied = await copyText(button.dataset.copy ?? '');
    const originalText = button.textContent ?? '复制';
    button.textContent = copied ? '已复制' : '复制失败';
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
  });
});
