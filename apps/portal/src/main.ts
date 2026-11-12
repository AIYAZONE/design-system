import './style.css'
// Import AIYAZONE Core components (if needed in the future)
// import '@aiyazone/core';

// --- Interfaces & Data ---
interface CardItem {
  title: string;
  description: string;
  href: string;
  linkText: string;
  iconColor: string;
  iconBg: string;
  iconPath: string;
}

const cards: CardItem[] = [
  {
    title: '设计系统指导文档',
    description: '基于 Web Components 的跨框架组件库，含 Button、Dialog、Toast 等 7+ 核心组件，支持深浅主题与无障碍访问。',
    href: '/storybook/',
    linkText: '查看文档',
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-50',
    iconPath: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
  },
  {
    title: '设计系统示例',
    description: '组件交互演示与真实业务场景落地范例，涵盖主题切换、国际化、响应式布局等实践。',
    href: '/examples/',
    linkText: '浏览示例',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    iconPath: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 9h.01"/><path d="M15 15h.01"/>'
  },
  {
    title: '图标资产',
    description: '87+ 精选 SVG 图标，含系统图标与社媒图标，支持按需导入与 Tree-shaking。',
    href: '/icons/',
    linkText: '搜索图标',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    iconPath: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/>'
  }
];

// --- Component Renderers ---

const renderSiteHeaderSlot = () => `<div data-site-header data-app="portal"></div>`;

const renderHero = () => `
  <div class="text-center mb-12 md:mb-20 relative">
    <!-- Soft Glow Background -->
    <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 bg-orange-100 rounded-full blur-[60px] md:blur-[80px] pointer-events-none opacity-60"></div>

    <h2 class="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight text-gray-900 relative z-10 px-4">
      统一设计语言 <br class="md:hidden"/>
      <span class="text-highlight">构建卓越体验</span>
    </h2>
    <p class="text-gray-500 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed relative z-10 px-4">
      AIYAZONE 数字生态的统一设计语言与前端资产中心。<br class="hidden md:inline"/>
      致力于打造一致、高效、卓越的用户体验。
    </p>
  </div>
`;

const renderCard = (card: CardItem) => `
  <a href="${card.href}" class="tech-card group p-6 flex flex-col h-56 md:h-60 justify-between">
    <div>
      <div class="w-10 h-10 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${card.iconPath}
        </svg>
      </div>
      <h3 class="text-lg md:text-xl font-bold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">${card.title}</h3>
      <p class="text-gray-500 text-sm line-clamp-2 md:line-clamp-none">${card.description}</p>
    </div>
    <div class="flex items-center text-xs font-bold ${card.iconColor} opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
      ${card.linkText} <span class="ml-2">→</span>
    </div>
  </a>
`;

const renderFooter = () => `<div data-site-footer></div>`;

// --- Main App Render ---

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
    ${renderHero()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full mb-12 md:mb-24">
      ${cards.map(renderCard).join('')}
    </div>
  </main>
  ${renderFooter()}
`;
