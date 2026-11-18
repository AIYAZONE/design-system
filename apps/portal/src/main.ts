import '../../../src/styles/index.less';
import './style.css';
import '@aiyazone/core';
import '@aiyazone/icons';
// @ts-ignore 公共静态模块也供不使用构建工具的页面使用
import { aiInstruction, bindCopy } from '../public/shared/copy-text.js';
import { renderHomePreview, initHomePreview } from './home-preview';
declare const __ZONE_VERSION__: string;
const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
// 0.3.2 为已发布旧入口；新自包含入口在 ZDS-02 发布后同步切换并验证。
const cdn = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@${__ZONE_VERSION__}/dist/index-v3.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@${__ZONE_VERSION__}/dist/index.esm.js"></script>`;
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div data-site-header data-app="portal"></div>
  <main class="home-main" id="content" tabindex="-1">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__copy">
        <p class="site-eyebrow"><span class="brand-dot"></span> AIYAZONE 设计系统 <span class="home-version">v${__ZONE_VERSION__}</span></p>
        <h1 id="home-title">从组件到页面，<br>让 AI 帮你开始。</h1>
        <p class="home-lede">一套统一的组件、样式和图标。<br>把使用说明交给 AI，让想法变成可操作的页面。</p>
        <div class="site-actions"><a class="site-button site-button--primary" href="/ai-usage.html">开始使用 <span aria-hidden="true">→</span></a><a class="site-button" href="/examples/">浏览示例</a></div>
        <p class="home-caption">Web Components <span> / </span> 多主题 <span> / </span> AI 使用指南</p>
      </div>
      ${renderHomePreview()}
    </section>
    <nav class="home-resources" aria-label="设计资源">
      <a href="/storybook/"><span class="resource-index">01 / COMPONENTS</span><span class="resource-title">组件文档 <span aria-hidden="true">↗</span></span><span class="resource-description">从按钮到表单，查看用法与交互。</span></a>
      <a href="/storybook/?path=/docs/02-设计变量-06-主题与-token-架构--document"><span class="resource-index">02 / FOUNDATION</span><span class="resource-title">样式与主题 <span aria-hidden="true">↗</span></span><span class="resource-description">用统一的颜色、字号与间距搭建页面。</span></a>
      <a href="/icons/"><span class="resource-index">03 / ICONS</span><span class="resource-title">图标库 <span aria-hidden="true">↗</span></span><span class="resource-description">搜索、预览，点击复制图标名称。</span></a>
    </nav>
    <section class="site-section home-start" aria-labelledby="steps-title">
      <div><div class="home-section-heading"><h2 id="steps-title">把下一页，交给 AI。</h2></div>
      <ol class="site-steps"><li><span class="number">01</span><div><h3>复制使用指令</h3><p>让 AI 了解组件和样式规范。</p></div></li><li><span class="number">02</span><div><h3>补充你的页面需求</h3><p>说明内容、操作和期望的布局。</p></div></li><li><span class="number">03</span><div><h3>打开页面，检查结果</h3><p>试试交互，也看看手机上的效果。</p></div></li></ol><a class="home-guide-link" href="/ai-usage.html">查看完整使用指南 →</a></div>
      <div class="site-code"><div class="site-code__head"><span>AI 使用指令</span><button class="site-button" data-copy-target="home-prompt" type="button" aria-live="polite">复制指令</button></div><pre id="home-prompt">${aiInstruction}</pre></div>
    </section>
    <section class="site-section home-install"><div><h2>直接在项目里使用</h2><p class="site-note">已有前端项目？安装组件包后开始使用。</p></div><div><div class="site-code"><div class="site-code__head"><span>安装命令</span><button class="site-button" data-copy-target="install-command" type="button" aria-live="polite">复制命令</button></div><pre id="install-command">pnpm add @aiyazone/design-system</pre></div><details><summary>静态 HTML 接入</summary><p>把下面两行放进页面，使用固定版本的组件和样式。</p><pre id="cdn-command">${escape(cdn)}</pre><button class="site-button" type="button" data-copy-target="cdn-command">复制代码</button></details></div></section>
  </main><div data-site-footer></div>`;
bindCopy();
initHomePreview();
