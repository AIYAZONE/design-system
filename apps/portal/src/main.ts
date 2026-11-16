import './style.css';

declare const __ZONE_VERSION__: string;

// --- 站点骨架 ---
const renderSiteHeaderSlot = () => `<div data-site-header data-app="portal"></div>`;
const renderFooter = () => `<div data-site-footer></div>`;

// --- Hero：先给事实，再说用法 ---
const renderHero = () => `
  <section class="pt-6 pb-14 md:pt-10 md:pb-20">
    <p class="font-mono text-xs text-gray-400 mb-5">ZDS · v${__ZONE_VERSION__}</p>
    <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
      AIYAZONE 的前端标准
    </h1>
    <p class="text-gray-600 text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
      10 个 Web Components、179 个设计令牌、一份机器可读规范。
      业务页面无论人写还是 AI 生成，都使用这里的组件与令牌；每次提交由七道 CI 门禁验证。
    </p>
    <div class="flex flex-wrap items-center gap-3 mt-8">
      <a href="#install" class="btn-primary">开始使用</a>
      <a href="/ai-usage.html" class="btn-secondary">AI 生成规范</a>
    </div>
  </section>
`;

// --- 入口矩阵：按「查 / 抄 / 喂 AI / 了解」分组 ---
interface EntryLink {
  title: string;
  desc: string;
  href: string;
}

interface EntryGroup {
  label: string;
  hint: string;
  links: EntryLink[];
}

const entryGroups: EntryGroup[] = [
  {
    label: '查',
    hint: '组件与资产的准确信息',
    links: [
      { title: '组件文档', desc: '10 个组件的属性、事件、插槽', href: '/storybook/' },
      { title: '图标库', desc: '113 个图标，复制图标名', href: '/icons/' }
    ]
  },
  {
    label: '抄',
    hint: '可直接参照的页面写法',
    links: [
      { title: '组件示例', desc: '组合用法与业务场景', href: '/examples/' },
      { title: 'AI 实测样例', desc: '账户设置页，含完整交互', href: '/ai-demo.html' }
    ]
  },
  {
    label: '喂 AI',
    hint: '机器可读的规范与验收',
    links: [
      { title: 'AI 生成规范', desc: '提示词要点 + 六条验收清单', href: '/ai-usage.html' },
      { title: 'llms.txt', desc: '组件、属性、图标名全清单', href: '/llms.txt' }
    ]
  },
  {
    label: '了解',
    hint: '工程体系与治理规则',
    links: [
      { title: '架构与治理', desc: '全景图、生成流水线、门禁', href: '/architecture.html' }
    ]
  }
];

const renderEntryGroup = (group: EntryGroup) => `
  <div class="border-t border-gray-200 pt-5">
    <p class="text-xs font-bold text-gray-400 mb-1">${group.label}</p>
    <p class="text-xs text-gray-400 mb-3">${group.hint}</p>
    <ul>
      ${group.links
        .map(
          (l) => `
        <li>
          <a href="${l.href}" class="entry-link">
            <span class="min-w-0">
              <span class="block text-sm font-bold text-gray-800 entry-title">${l.title}</span>
              <span class="block text-xs text-gray-400 truncate">${l.desc}</span>
            </span>
            <span class="shrink-0 text-gray-300">→</span>
          </a>
        </li>`
        )
        .join('')}
    </ul>
  </div>
`;

const renderEntries = () => `
  <section class="mb-14 md:mb-20">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      ${entryGroups.map(renderEntryGroup).join('')}
    </div>
  </section>
`;

// --- 安装 ---
const renderInstall = () => {
  const npmCmd = 'pnpm add @aiyazone/design-system';
  const cdnSnippet = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@latest/dist/index-v3.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@latest/dist/index.esm.js"></script>`;
  return `
  <section id="install" class="mb-14 md:mb-20 scroll-mt-24">
    <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-1">安装</h2>
    <p class="text-sm text-gray-500 mb-5">装包适用于任何构建工具；静态页可直接引 CDN。</p>

    <div class="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <div class="flex items-center justify-between gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span class="font-mono text-xs text-gray-500">npm</span>
        <button type="button" data-copy="${npmCmd}" class="copy-btn">复制</button>
      </div>
      <pre class="code-block"><code>${npmCmd}</code></pre>
    </div>

    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="flex items-center justify-between gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span class="font-mono text-xs text-gray-500">CDN</span>
        <button type="button" data-copy="${cdnSnippet.replaceAll('"', '&quot;')}" class="copy-btn">复制</button>
      </div>
      <pre class="code-block"><code>${cdnSnippet
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')}</code></pre>
    </div>
  </section>
`;
};

// --- 渲染 ---
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6">
    ${renderHero()}
    ${renderEntries()}
    ${renderInstall()}
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
    btn.textContent = ok ? '已复制' : '复制失败';
    setTimeout(() => {
      btn.textContent = original;
    }, 1400);
  });
});
