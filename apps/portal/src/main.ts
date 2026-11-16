import './style.css';

// --- 站点骨架 ---
const renderSiteHeaderSlot = () => `<div data-site-header data-app="portal"></div>`;
const renderFooter = () => `<div data-site-footer></div>`;

// --- 两条使用路径 ---
interface PathStep {
  n: string;
  title: string;
  desc: string;
}

const humanSteps: PathStep[] = [
  {
    n: '01',
    title: '安装',
    desc: 'pnpm add @aiyazone/design-system，一条命令拿到组件 + 三套主题。'
  },
  {
    n: '02',
    title: '注册',
    desc: "import '@aiyazone/design-system'，全部 zone-* 自定义元素就位。"
  },
  {
    n: '03',
    title: '拼页面',
    desc: '查组件文档，用 zone-* + --zone-* 令牌组合，禁止覆盖 shadow DOM。'
  }
];

const aiSteps: PathStep[] = [
  {
    n: '01',
    title: '喂规范',
    desc: '把 /llms.txt 放进模型上下文：10 个组件、117 个属性、113 个合法图标名。'
  },
  {
    n: '02',
    title: '提需求',
    desc: '用自然语言描述页面，模型按规范生成代码，不发明颜色和间距。'
  },
  {
    n: '03',
    title: '过验收',
    desc: '对照六条验收清单自查，七道 CI 门禁兜底，不合格就回炉。'
  }
];

const renderStep = (step: PathStep, accent: string) => `
  <li class="flex gap-4">
    <span class="shrink-0 w-8 h-8 rounded-lg ${accent} text-white text-xs font-bold flex items-center justify-center mt-0.5">${step.n}</span>
    <div>
      <p class="font-bold text-gray-900 text-sm md:text-base">${step.title}</p>
      <p class="text-gray-500 text-sm leading-relaxed mt-1">${step.desc}</p>
    </div>
  </li>
`;

const renderPaths = () => `
  <section class="w-full mb-16 md:mb-24">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div class="tech-card p-6 md:p-8 flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-900">给人用</h3>
          <span class="text-xs font-bold text-gray-400 tracking-widest">FOR HUMANS</span>
        </div>
        <ul class="space-y-5 flex-1">
          ${humanSteps.map((s) => renderStep(s, 'bg-gray-800')).join('')}
        </ul>
        <div class="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-5 border-t border-gray-100 text-sm font-bold">
          <a href="/storybook/" class="text-orange-600 hover:text-orange-700">组件文档 →</a>
          <a href="/examples/" class="text-orange-600 hover:text-orange-700">示例 →</a>
          <a href="/icons/" class="text-orange-600 hover:text-orange-700">图标库 →</a>
        </div>
      </div>

      <div class="tech-card p-6 md:p-8 flex flex-col ring-1 ring-orange-200 bg-gradient-to-br from-orange-50/60 to-white">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-900">给 AI 用 <span class="text-orange-500">·</span> 机器可读</h3>
          <span class="text-xs font-bold text-orange-500 tracking-widest">FOR AGENTS</span>
        </div>
        <ul class="space-y-5 flex-1">
          ${aiSteps.map((s) => renderStep(s, 'bg-orange-500')).join('')}
        </ul>
        <div class="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-5 border-t border-orange-100 text-sm font-bold">
          <a href="/ai-usage.html" class="text-orange-600 hover:text-orange-700">AI 生成规范 →</a>
          <a href="/ai-demo.html" class="text-orange-600 hover:text-orange-700">实测样例 →</a>
          <a href="/llms.txt" class="text-orange-600 hover:text-orange-700">llms.txt →</a>
        </div>
      </div>
    </div>
  </section>
`;

// --- 安装区 ---
const renderInstall = () => {
  const npmCmd = 'pnpm add @aiyazone/design-system';
  const cdnSnippet = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@latest/dist/index-v3.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@latest/dist/index.esm.js"></script>`;
  return `
  <section id="install" class="w-full mb-16 md:mb-24 scroll-mt-24">
    <div class="flex items-end justify-between mb-6 md:mb-8">
      <div>
        <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">GET STARTED</p>
        <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">两种引入方式，选一种即可</h2>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div class="tech-card p-5 md:p-6">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-bold text-gray-900">方式一 · 装包（推荐）</p>
          <button type="button" data-copy="${npmCmd}" class="copy-btn">复制</button>
        </div>
        <pre class="code-block"><code>${npmCmd}</code></pre>
        <p class="text-xs text-gray-400 mt-3 leading-relaxed">适用于任何构建工具；TypeScript 类型随包分发，无需额外安装 @types。</p>
      </div>
      <div class="tech-card p-5 md:p-6">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-bold text-gray-900">方式二 · CDN 直引（零构建）</p>
          <button type="button" data-copy="${cdnSnippet.replaceAll('"', '&quot;')}" class="copy-btn">复制</button>
        </div>
        <pre class="code-block"><code>${cdnSnippet
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')}</code></pre>
        <p class="text-xs text-gray-400 mt-3 leading-relaxed">静态页 / 活动页 / AI 一次性生成的演示页，一个 &lt;link&gt; 一个 &lt;script&gt; 就能跑。</p>
      </div>
    </div>
  </section>
`;
};

// --- 质量门禁 ---
const gates = [
  'TypeScript 全量类型检查',
  '单元 + 交互测试 294 项',
  '令牌锁 + 硬编码扫描',
  'API 契约快照',
  '文档漂移校验',
  'Storybook 79 stories 渲染冒烟',
  'Chromatic 视觉回归'
];

const renderGates = () => `
  <section class="w-full mb-16 md:mb-24">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
      <div>
        <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">QUALITY GATES</p>
        <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">每次 PR 自动过七道关</h2>
      </div>
      <a href="/architecture.html" class="text-sm font-bold text-orange-600 hover:text-orange-700">治理细节 →</a>
    </div>
    <div class="flex flex-wrap gap-2">
      ${gates
        .map(
          (g) => `<span class="gate-pill"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M20 6 9 17l-5-5"/></svg>${g}</span>`
        )
        .join('')}
    </div>
    <p class="text-xs text-gray-400 mt-4">门禁不过，PR 合不进 master；发版走 OIDC 临时凭证，仓库里不存任何 npm token。</p>
  </section>
`;

// --- 全部入口 ---
const entries = [
  { title: '组件文档', desc: '10 个组件的属性、事件、插槽与示例', href: '/storybook/' },
  { title: '图标库', desc: '113 个系统与社媒图标，点击复制图标名', href: '/icons/' },
  { title: '示例', desc: '主题切换、组件组合与业务场景范例', href: '/examples/' },
  { title: '架构与治理', desc: 'AI 生成流水线、分层依赖、七关门禁', href: '/architecture.html' },
  { title: 'AI 生成规范', desc: '提示词要点、组件选择指南、六条验收清单', href: '/ai-usage.html' },
  { title: 'AI 实测样例', desc: '按规范生成的账户设置页，含全链路交互', href: '/ai-demo.html' }
];

const renderEntries = () => `
  <section class="w-full mb-4 md:mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10">
      ${entries
        .map(
          (e) => `
        <a href="${e.href}" class="entry-row group">
          <div class="min-w-0">
            <p class="font-bold text-gray-900 text-sm md:text-base group-hover:text-orange-600 transition-colors">${e.title}</p>
            <p class="text-xs md:text-sm text-gray-400 truncate mt-0.5">${e.desc}</p>
          </div>
          <span class="shrink-0 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span>
        </a>`
        )
        .join('')}
    </div>
  </section>
`;

// --- Hero ---
const renderHero = () => `
  <section class="text-center mb-14 md:mb-20 relative">
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-72 md:w-[28rem] h-72 md:h-[28rem] bg-orange-100 rounded-full blur-[60px] md:blur-[80px] pointer-events-none opacity-60"></div>

    <p class="relative z-10 inline-flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-6 md:mb-8">
      <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
      ZDS · AIYAZONE Design System
    </p>

    <h1 class="relative z-10 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 px-4 leading-[1.15]">
      一套零件，<span class="text-highlight">两种写法</span>
    </h1>

    <p class="relative z-10 text-gray-500 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mt-5 md:mt-6 px-4">
      10 个 Web Components、179 个设计令牌、一份机器可读的规范。<br class="hidden md:inline"/>
      人照着文档写，AI 直接读 <code class="font-mono text-sm text-gray-700 bg-gray-100 rounded px-1.5 py-0.5">llms.txt</code> 生成——产出天然一致。
    </p>

    <div class="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-8 md:mt-10 px-4">
      <a href="#install" class="btn-primary">快速开始</a>
      <a href="/ai-usage.html" class="btn-secondary">AI 生成规范</a>
      <a href="/ai-demo.html" class="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors px-2 py-3">
        看实测样例
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
      </a>
    </div>
  </section>
`;

// --- 渲染 ---
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
    ${renderHero()}
    ${renderPaths()}
    ${renderInstall()}
    ${renderGates()}
    ${renderEntries()}
  </main>
  ${renderFooter()}
`;

// --- 复制按钮 ---
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

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const ok = await copyText(btn.dataset.copy ?? '');
    const original = btn.textContent ?? '复制';
    btn.textContent = ok ? '已复制 ✓' : '复制失败';
    setTimeout(() => {
      btn.textContent = original;
    }, 1400);
  });
});
