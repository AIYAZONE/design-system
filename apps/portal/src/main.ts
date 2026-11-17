import '../../../src/styles/index.less';
import './style.css';
import '@aiyazone/core';
import '@aiyazone/icons';
// @ts-ignore 公共静态模块也供不使用构建工具的页面使用
import { aiInstruction, bindCopy } from '../public/shared/copy-text.js';
import { renderHomePreview, initHomePreview } from './home-preview';
declare const __ZONE_VERSION__: string;
const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cdn = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@${__ZONE_VERSION__}/dist/index-v3.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@${__ZONE_VERSION__}/dist/index.esm.js"></script>`;
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div data-site-header data-app="portal"></div>
  <main class="home-main" id="content" tabindex="-1">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__copy">
        <p class="site-eyebrow"><span class="brand-dot"></span> AIYAZONE 设计系统 <span class="home-version">v${__ZONE_VERSION__}</span></p>
        <h1 id="home-title">用 AI，更快做出<br>统一风格的页面。</h1>
        <p class="home-lede">把组件和样式说明交给 AI，帮你完成页面初稿。你可以先看示例，再按步骤开始。</p>
        <div class="site-actions"><a class="site-button site-button--primary" href="/ai-usage.html">查看 AI 使用方法 <span aria-hidden="true">→</span></a><a class="site-button" href="/ai-demo.html">打开页面示例</a></div>
        <p class="home-caption">使用已有组件 · 保持样式统一 · 生成后检查</p>
      </div>
      ${renderHomePreview()}
    </section>
    <section class="site-section" aria-labelledby="steps-title">
      <div class="home-section-heading"><h2 id="steps-title">三步开始用 AI</h2><a href="/ai-usage.html">查看完整方法 →</a></div>
      <ol class="site-steps"><li><span class="number">01</span><h3>复制使用指令</h3><p>让 AI 先了解这套组件和样式。</p></li><li><span class="number">02</span><h3>告诉 AI 你要做什么页面</h3><p>写清内容、操作和你需要的布局。</p></li><li><span class="number">03</span><h3>打开结果，检查内容和交互</h3><p>试一试按钮、表单和手机显示。</p></li></ol>
      <div class="site-code"><div class="site-code__head"><span>把这段话交给 AI，补充你的页面需求</span><button class="site-button" data-copy-target="home-prompt" type="button" aria-live="polite">复制使用指令</button></div><pre id="home-prompt">${aiInstruction}</pre></div>
    </section>
    <section class="site-section"><h2>页面需要的基础，都在这里</h2><div class="site-resources">
      <article><h3>组件</h3><p>按钮、弹窗、下拉等常用交互，可以直接使用。</p><a href="/storybook/">查看组件文档 →</a></article>
      <article><h3>样式</h3><p>统一颜色、字号和间距，让页面保持一致。</p><a href="/storybook/?path=/docs/02-设计变量-06-主题与-token-架构--document">查看样式说明 →</a></article>
      <article><h3>图标</h3><p>搜索需要的图标，点击即可复制名称。</p><a href="/icons/">查找图标 →</a></article></div></section>
    <section class="site-section home-install"><div><h2>直接在项目里使用</h2><p class="site-note">已有前端项目？安装组件包后开始使用。</p></div><div><div class="site-code"><div class="site-code__head"><span>安装命令</span><button class="site-button" data-copy-target="install-command" type="button" aria-live="polite">复制命令</button></div><pre id="install-command">pnpm add @aiyazone/design-system</pre></div><details><summary>静态 HTML 接入</summary><p>把下面两行放进页面，使用固定版本的组件和样式。</p><pre id="cdn-command">${escape(cdn)}</pre><button class="site-button" type="button" data-copy-target="cdn-command">复制代码</button></details></div></section>
  </main><div data-site-footer></div>`;
bindCopy();
initHomePreview();
