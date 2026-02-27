import './style.css'
// Import Jackery Core components (if needed in the future)
// import '@jackery/core'; 

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

interface ArchNode {
  title: string;
  subtitle?: string;
  heightClass?: string;
  widthClass?: string;
  extraClasses?: string;
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
  },
  {
    title: '业务组件库',
    description: '基于 JDS 构建的业务级复用组件，含抽奖、刮刮乐等营销组件，支持多主题切换。',
    href: '/jbc/',
    linkText: '浏览组件',
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50',
    iconPath: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
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
      Jackery 数字生态的统一设计语言与前端架构中心。<br class="hidden md:inline"/>
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

const renderArchNode = (node: ArchNode) => `
  <div class="arch-node ${node.heightClass || 'h-16'} ${node.widthClass || 'w-full'} ${node.extraClasses || ''}">
    <span class="arch-node-title ${node.subtitle ? '' : 'text-xs'} text-center">${node.title}</span>
    ${node.subtitle ? `<span class="arch-node-subtitle">${node.subtitle}</span>` : ''}
  </div>
`;

const renderArchitecture = () => `
  <section class="w-full mb-12 md:mb-20">
    <div class="flex items-center justify-between mb-6 md:mb-8">
      <h3 class="text-xl md:text-2xl font-bold border-l-4 border-orange-500 pl-4 text-gray-900">前端架构全景</h3>
      <div class="text-xs text-gray-400 font-mono">LIVE MAP v1.0</div>
    </div>
    
    <!-- Diagram Container -->
    <div class="relative w-full min-h-[600px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-4 md:p-8">
      <!-- Background Grid for Diagram -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <!-- Mobile Layout (Flex Stack) -->
      <div class="relative z-10 flex flex-col gap-6 md:hidden">
         <!-- Infrastructure -->
         <div class="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div class="text-xs font-mono text-gray-400 mb-3 uppercase tracking-widest text-center">基础设施</div>
            <div class="grid grid-cols-2 gap-2">
              ${renderArchNode({ title: 'GitLab', heightClass: 'h-12' })}
              ${renderArchNode({ title: 'Nexus', heightClass: 'h-12' })}
              ${renderArchNode({ title: 'Jenkins', heightClass: 'h-12' })}
              ${renderArchNode({ title: '观测云', heightClass: 'h-12' })}
              ${renderArchNode({ title: 'Pagespeed', heightClass: 'h-12' })}
              ${renderArchNode({ title: 'GTM', heightClass: 'h-12' })}
            </div>
         </div>

         <!-- Platforms -->
         <div class="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
            <div class="text-xs font-mono text-blue-500 mb-3 uppercase tracking-widest text-center">C端业务平台</div>
            <div class="grid grid-cols-3 gap-2 justify-items-center">
              ${renderArchNode({ title: 'Shopify', heightClass: 'h-12', widthClass: 'w-full max-w-[120px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'AEM', heightClass: 'h-12', widthClass: 'w-full max-w-[120px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'Support', heightClass: 'h-12', widthClass: 'w-full max-w-[120px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'Account', heightClass: 'h-12', widthClass: 'w-full max-w-[120px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'Membership', heightClass: 'h-12', widthClass: 'w-full max-w-[120px]', extraClasses: 'bg-white border-blue-200' })}
            </div>
         </div>

         <!-- Core Systems -->
         <div class="flex flex-col gap-4">
            <!-- JDS -->
            <div class="p-4 rounded-xl border border-orange-200 bg-orange-50/50">
               <div class="text-xs font-mono text-orange-600 mb-3 uppercase tracking-widest text-center font-bold">设计系统 (JDS)</div>
               <div class="grid grid-cols-2 gap-2">
                  ${renderArchNode({ title: '核心组件', subtitle: 'Core', heightClass: 'h-16', extraClasses: 'bg-white border-orange-100' })}
                  ${renderArchNode({ title: '图标库', subtitle: 'Icons', heightClass: 'h-16', extraClasses: 'bg-white border-orange-100' })}
                  ${renderArchNode({ title: '工具库', subtitle: 'Utils', heightClass: 'h-16', extraClasses: 'bg-white border-orange-100' })}
                  ${renderArchNode({ title: '国际化', subtitle: 'i18n', heightClass: 'h-16', extraClasses: 'bg-white border-orange-100' })}
               </div>
            </div>

            <!-- JBC -->
            <div class="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
               <div class="text-xs font-mono text-purple-600 mb-3 uppercase tracking-widest text-center font-bold">业务组件 (JBC)</div>
               <div class="grid grid-cols-2 gap-2">
                  ${renderArchNode({ title: '基于 JDS 构建', heightClass: 'h-16', extraClasses: 'bg-white border-purple-100 text-xs' })}
                  ${renderArchNode({ title: 'Vue 组件', heightClass: 'h-16', extraClasses: 'bg-white border-purple-100 text-xs' })}
                  ${renderArchNode({ title: 'Web Components', heightClass: 'h-16', extraClasses: 'bg-white border-purple-100 text-xs' })}
                  ${renderArchNode({ title: '基于 其他框架', heightClass: 'h-16', extraClasses: 'bg-white border-purple-100 text-xs' })}
               </div>
            </div>
         </div>

         <!-- Guidelines & Status -->
         <div class="grid grid-cols-2 gap-2">
            ${renderArchNode({ title: '前端规范', heightClass: 'h-12', extraClasses: 'border-dashed border-gray-300 bg-transparent text-gray-500 text-xs' })}
            ${renderArchNode({ title: 'UED 规范', heightClass: 'h-12', extraClasses: 'border-dashed border-gray-300 bg-transparent text-gray-500 text-xs' })}
         </div>
         
         <div class="p-3 rounded bg-green-50 border border-green-200 text-center">
             <span class="text-xs text-green-600">构建状态: </span>
             <span class="font-bold text-green-700 text-sm">Passing</span>
         </div>
         <div class="grid grid-cols-2 gap-2 mt-2">
             <div class="p-3 rounded bg-orange-50 border border-orange-200 text-center">
                <div class="text-xs text-orange-600 mb-1">JDS</div>
                <div class="font-bold text-orange-700 text-sm">v0.1.7</div>
             </div>
             <div class="p-3 rounded bg-purple-50 border border-purple-200 text-center">
                <div class="text-xs text-purple-600 mb-1">JBC</div>
                <div class="font-bold text-purple-700 text-sm">v0.1.7</div>
             </div>
         </div>
      </div>

      <!-- Desktop Layout (CSS Grid) -->
      <div class="relative z-10 hidden md:grid grid-cols-12 gap-8 h-full">
        
        <!-- Column 1: Infrastructure -->
        <div class="col-span-2 flex flex-col gap-4 justify-center border-r border-gray-100 pr-4">
          <div class="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">基础设施 (Infrastructure)</div>
          ${renderArchNode({ title: 'GitLab' })}
          ${renderArchNode({ title: 'Nexus' })}
          ${renderArchNode({ title: 'Jenkins' })}
          ${renderArchNode({ title: '观测云' })}
          ${renderArchNode({ title: 'Pagespeed' })}
          ${renderArchNode({ title: 'GTM' })}
        </div>

        <!-- Column 2 & 3: Core System (Spanning 8 cols) -->
        <div class="col-span-8 flex flex-col gap-8 justify-center">

          <!-- Top: Business Platforms -->
          <div class="p-4 rounded-xl border border-blue-100 bg-blue-50/50 backdrop-blur-sm">
            <div class="text-xs font-mono text-blue-500 mb-4 uppercase tracking-widest text-center">C端业务平台</div>
            <div class="grid grid-cols-5 gap-4 justify-items-center">
              ${renderArchNode({ title: 'Shopify', heightClass: 'h-16', widthClass: 'w-full max-w-[160px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'AEM', heightClass: 'h-16', widthClass: 'w-full max-w-[160px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'Support', heightClass: 'h-16', widthClass: 'w-full max-w-[160px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'Account', heightClass: 'h-16', widthClass: 'w-full max-w-[160px]', extraClasses: 'bg-white border-blue-200' })}
              ${renderArchNode({ title: 'Membership', heightClass: 'h-16', widthClass: 'w-full max-w-[160px]', extraClasses: 'bg-white border-blue-200' })}
            </div>
          </div>

          <!-- Middle: JDS & JBC -->
          <div class="grid grid-cols-2 gap-6">
            <!-- JDS -->
            <div class="p-6 rounded-xl border border-orange-200 bg-orange-50/50 backdrop-blur-sm relative group">
              <div class="absolute -inset-[1px] bg-gradient-to-r from-orange-200 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="text-xs font-mono text-orange-600 mb-4 uppercase tracking-widest text-center font-bold">设计系统 (JDS)</div>
              <div class="grid grid-cols-2 gap-3">
                ${renderArchNode({ title: '核心组件', subtitle: 'Core', heightClass: 'h-20', extraClasses: 'bg-white border-orange-100' })}
                ${renderArchNode({ title: '图标库', subtitle: 'Icons', heightClass: 'h-20', extraClasses: 'bg-white border-orange-100' })}
                ${renderArchNode({ title: '工具库', subtitle: 'Utils', heightClass: 'h-20', extraClasses: 'bg-white border-orange-100' })}
                ${renderArchNode({ title: '国际化', subtitle: 'i18n', heightClass: 'h-20', extraClasses: 'bg-white border-orange-100' })}
              </div>
            </div>

            <!-- JBC -->
            <div class="p-6 rounded-xl border border-purple-200 bg-purple-50/50 backdrop-blur-sm">
              <div class="text-xs font-mono text-purple-600 mb-4 uppercase tracking-widest text-center font-bold">业务组件 (JBC)</div>
              <div class="grid grid-cols-2 gap-3">
                ${renderArchNode({ title: '基于 JDS 构建', heightClass: 'h-20', extraClasses: 'bg-white border-purple-100 text-xs break-words px-1' })}
                ${renderArchNode({ title: 'Vue 组件', heightClass: 'h-20', extraClasses: 'bg-white border-purple-100 text-xs' })}
                ${renderArchNode({ title: 'Web Components', heightClass: 'h-20', extraClasses: 'bg-white border-purple-100 text-xs break-words px-1' })}
                ${renderArchNode({ title: '基于 其他框架', heightClass: 'h-20', extraClasses: 'bg-white border-purple-100 text-xs break-words px-1' })}
              </div>
            </div>
          </div>

          <!-- Bottom: Guidelines -->
          <div class="flex gap-4">
             ${renderArchNode({ title: '前端开发规范', extraClasses: 'flex-1 border-dashed border-gray-300 bg-transparent text-gray-500' })}
             ${renderArchNode({ title: 'UED 设计规范', extraClasses: 'flex-1 border-dashed border-gray-300 bg-transparent text-gray-500' })}
          </div>

        </div>

        <!-- Column 4: Status -->
        <div class="col-span-2 flex flex-col gap-4 justify-center border-l border-gray-100 pl-4">
           <div class="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">系统状态</div>
           <div class="p-4 rounded bg-green-50 border border-green-200">
              <div class="text-xs text-green-600 mb-1">构建状态</div>
              <div class="font-bold text-green-700">通过 (Passing)</div>
           </div>
           <div class="flex flex-col gap-2">
             <div class="p-3 rounded bg-orange-50 border border-orange-200">
                <div class="text-xs text-orange-600 mb-1">JDS 版本</div>
                <div class="font-bold text-orange-700">v0.1.5</div>
             </div>
             <div class="p-3 rounded bg-purple-50 border border-purple-200">
                <div class="text-xs text-purple-600 mb-1">JBC 版本</div>
                <div class="font-bold text-purple-700">v0.1.6</div>
             </div>
           </div>
        </div>

      </div>
    </div>
  </section>
`;

const renderFooter = () => `<div data-site-footer></div>`;

// --- Main App Render ---

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
    ${renderHero()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mb-12 md:mb-24">
      ${cards.map(renderCard).join('')}
    </div>
    ${renderArchitecture()}
  </main>
  ${renderFooter()}
`;
