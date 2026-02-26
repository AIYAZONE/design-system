import './style.css'
import { archMeta, maturity, selfAssessment } from './architecture-data';
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

type ArchChipVariant = 'default' | 'muted' | 'tag' | 'success' | 'warning' | 'purple';

interface ArchChip {
  label: string;
  tooltipTitle?: string;
  tooltipDesc?: string;
  variant?: ArchChipVariant;
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

const escapeAttr = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const chipVariantClass = (variant?: ArchChipVariant) => {
  switch (variant) {
    case 'muted':
      return 'arch-chip-muted';
    case 'tag':
      return 'arch-chip-tag';
    case 'success':
      return 'arch-chip-success';
    case 'warning':
      return 'arch-chip-warning';
    case 'purple':
      return 'arch-chip-purple';
    default:
      return '';
  }
};

const renderChip = (chip: ArchChip) => {
  const tooltipTitle = chip.tooltipTitle ? escapeAttr(chip.tooltipTitle) : '';
  const tooltipDesc = chip.tooltipDesc ? escapeAttr(chip.tooltipDesc) : '';
  const hasTooltip = Boolean(tooltipTitle || tooltipDesc);
  const ariaLabel = hasTooltip ? [tooltipTitle, tooltipDesc].filter(Boolean).join(' · ') : '';
  const attrs = hasTooltip
    ? ` data-tooltip-title="${tooltipTitle}" data-tooltip-desc="${tooltipDesc}" aria-label="${ariaLabel}" tabindex="0"`
    : '';
  const tooltip =
    hasTooltip
      ? `<span class="arch-tooltip" role="tooltip"><span class="arch-tooltip-title">${tooltipTitle}</span><span class="arch-tooltip-desc">${tooltipDesc}</span></span>`
      : '';
  return `<span class="arch-chip ${chipVariantClass(chip.variant)}"${attrs}><span class="arch-chip-label">${chip.label}</span>${tooltip}</span>`;
};

const layerTitle = (en: string, zh: string) =>
  `<div class="arch-layer-head"><div class="arch-layer-en">${en}</div><div class="arch-layer-zh">${zh}</div></div>`;

const businessModules: ArchChip[] = [
  { label: 'Shopify 主站', tooltipTitle: 'Shopify', tooltipDesc: '官网主站与转化入口' },
  { label: 'AEM 内容站', tooltipTitle: 'AEM (CMS)', tooltipDesc: '内容生产与多语言管理' },
  { label: 'Campaign 活动', tooltipTitle: 'Campaign', tooltipDesc: '高频营销活动页与落地页' },
  { label: '账户与会员', tooltipTitle: 'Account & Membership', tooltipDesc: '登录、权益、订单等账户体系' },
  { label: '客服与支持', tooltipTitle: 'Support', tooltipDesc: '售前/售后支持与服务入口' },
];

const businessTags: ArchChip[] = [
  { label: '多区域', tooltipTitle: 'Multi-Region', tooltipDesc: 'US / EU / JP 多站点治理', variant: 'tag' },
  { label: 'SEO 驱动', tooltipTitle: 'SEO Driven', tooltipDesc: '流量获取与可发现性', variant: 'tag' },
  { label: '高频营销', tooltipTitle: 'High-Frequency Marketing', tooltipDesc: '活动快速交付与复用', variant: 'tag' },
];

const domainCommerce: ArchChip[] = [
  { label: '商品卡片', tooltipTitle: 'Product Card', tooltipDesc: '统一商品信息展示与交互' },
  { label: '价格系统', tooltipTitle: 'Price System', tooltipDesc: '多地区币种/税费/促销价计算' },
  { label: '库存提示', tooltipTitle: 'Inventory Badge', tooltipDesc: '库存状态与发货信息提示' },
  { label: '促销引擎', tooltipTitle: 'Promotion Engine', tooltipDesc: '折扣/满减/赠品等规则编排' },
  { label: '结算流程', tooltipTitle: 'Checkout Flow', tooltipDesc: '从购物车到支付的流程编排' },
];

const domainMarketing: ArchChip[] = [
  { label: '活动区块', tooltipTitle: 'Campaign Section', tooltipDesc: '活动页的可复用内容区块' },
  { label: '首屏横幅', tooltipTitle: 'Hero Banner', tooltipDesc: '主视觉与核心 CTA 承载' },
  { label: '优惠券模块', tooltipTitle: 'Coupon Module', tooltipDesc: '券领取/校验/展示组件' },
  { label: '动态坑位', tooltipTitle: 'Dynamic Slot', tooltipDesc: '可配置的动态内容投放位' },
];

const domainAccount: ArchChip[] = [
  { label: '登录', tooltipTitle: 'Login', tooltipDesc: '认证与安全登录流程' },
  { label: '订单历史', tooltipTitle: 'Order History', tooltipDesc: '订单查询与售后入口' },
  { label: '忠诚度模块', tooltipTitle: 'Loyalty Module', tooltipDesc: '积分/等级/权益体系' },
];

const designColumns = [
  {
    title: 'Tokens',
    subtitle: '设计令牌',
    chips: [
      { label: '多主题', tooltipTitle: 'Multi-Theme', tooltipDesc: '不同区域与品牌主题覆盖' },
      { label: '变量输出', tooltipTitle: 'CSS Variables', tooltipDesc: 'Token 以 CSS 变量对外输出' },
    ],
  },
  {
    title: 'Base Components',
    subtitle: '基础组件',
    chips: [
      { label: '无业务', tooltipTitle: 'No Business Logic', tooltipDesc: '保持通用与可组合' },
      { label: '一致交互', tooltipTitle: 'Consistent UX', tooltipDesc: '交互模式统一、降低学习成本' },
    ],
  },
  {
    title: 'Visual Assets',
    subtitle: '视觉资产',
    chips: [
      { label: '图标', tooltipTitle: 'Icons', tooltipDesc: '统一图标规范与产物' },
      { label: '动效', tooltipTitle: 'Motion', tooltipDesc: '统一动效规则与组件动效' },
    ],
  },
];

const designTags: ArchChip[] = [
  { label: '多主题', tooltipTitle: 'Multi-Theme', tooltipDesc: '按区域/站点覆盖主题', variant: 'tag' },
  { label: 'Token → CSS Variables', tooltipTitle: 'Token to CSS Variables', tooltipDesc: '设计令牌到 CSS 变量', variant: 'tag' },
  { label: 'Figma 同步', tooltipTitle: 'Figma Sync', tooltipDesc: '设计资产同步机制', variant: 'tag' },
];

const designSupport: ArchChip[] = [
  { label: '国际化（i18n）', tooltipTitle: 'i18n', tooltipDesc: '多语言、格式化、区域化策略', variant: 'muted' },
  { label: '工具库（utils）', tooltipTitle: 'utils', tooltipDesc: '通用工具、adapter/hook、跨包复用', variant: 'muted' },
  { label: '无障碍（a11y）', tooltipTitle: 'Accessibility', tooltipDesc: '键盘可达、语义与对比度基线', variant: 'muted' },
];

const platformQuadrants = [
  {
    title: 'Code Governance',
    subtitle: '代码治理',
    chips: [
      { label: 'Monorepo', tooltipTitle: 'Monorepo', tooltipDesc: '统一仓库与构建管线' },
      { label: '版本发布', tooltipTitle: 'Package Versioning', tooltipDesc: '语义化版本与自动发布' },
      { label: '依赖分层', tooltipTitle: 'Dependency Layering', tooltipDesc: 'Apps → JBC → JDS 约束' },
      { label: '变更日志', tooltipTitle: 'Changelog', tooltipDesc: '可追溯的变更记录' },
    ],
  },
  {
    title: 'CI/CD',
    subtitle: '自动化交付',
    chips: [
      { label: 'PR 门禁', tooltipTitle: 'PR Gate', tooltipDesc: '质量检查与合并策略' },
      { label: '自动测试', tooltipTitle: 'Auto Test', tooltipDesc: '单测/交互测试自动化' },
      { label: '预览环境', tooltipTitle: 'Preview Env', tooltipDesc: '改动可视化验收' },
      { label: '多环境发布', tooltipTitle: 'Multi-Env Deploy', tooltipDesc: 'Dev/Staging/Prod 发布策略' },
    ],
  },
  {
    title: 'Build System',
    subtitle: '构建体系',
    chips: [
      { label: '代码分割', tooltipTitle: 'Code Splitting', tooltipDesc: '按路由/场景拆包' },
      { label: 'Tree-shaking', tooltipTitle: 'Tree Shaking', tooltipDesc: '按需引入减少冗余' },
      { label: '体积监控', tooltipTitle: 'Bundle Monitor', tooltipDesc: '体积门禁与可视化分析' },
      { label: '图片优化', tooltipTitle: 'Image Optimization', tooltipDesc: '格式/压缩/响应式加载' },
    ],
  },
  {
    title: 'Quality Gate',
    subtitle: '质量门禁',
    chips: [
      { label: 'ESLint', tooltipTitle: 'ESLint', tooltipDesc: '代码规范自动校验' },
      { label: 'Commitlint', tooltipTitle: 'Commitlint', tooltipDesc: '提交规范与自动化发布' },
      { label: '安全扫描', tooltipTitle: 'Security Scan', tooltipDesc: '依赖漏洞与合规检查' },
      { label: 'Token 校验', tooltipTitle: 'Token Validation', tooltipDesc: '设计令牌一致性校验' },
    ],
  },
];

const platformDependency: ArchChip[] = [
  { label: 'Apps → 域能力包(JBC) → JDS', tooltipTitle: 'Dependency Layering', tooltipDesc: '页面通过域包间接使用设计系统', variant: 'muted' },
  { label: '禁止页面直依赖 JDS', tooltipTitle: 'Architecture Rule', tooltipDesc: '避免业务页面绕过域能力抽象', variant: 'muted' },
  { label: '依赖分层门禁', tooltipTitle: 'Layer Gate', tooltipDesc: '通过 lint/graph 强制执行', variant: 'muted' },
];

const runtimeModules: ArchChip[] = [
  { label: '全球 CDN', tooltipTitle: 'Global CDN', tooltipDesc: '多区域加速与缓存策略' },
  { label: '静态资源策略', tooltipTitle: 'Static Asset Strategy', tooltipDesc: '分域、缓存与版本策略' },
  { label: 'SSR / Edge', tooltipTitle: 'SSR / Edge', tooltipDesc: '首屏与动态能力优化' },
  { label: '灰度发布', tooltipTitle: 'Gray Release', tooltipDesc: '低风险上线与验证' },
  { label: '快速回滚', tooltipTitle: 'Rollback', tooltipDesc: '故障快速止损机制' },
];

const observabilityPerformance: ArchChip[] = [
  { label: 'Core Web Vitals', tooltipTitle: 'Core Web Vitals', tooltipDesc: '核心性能指标体系' },
  { label: '加载链路监控', tooltipTitle: 'Load Chain Monitor', tooltipDesc: '首屏链路分段定位' },
];

const observabilityErrors: ArchChip[] = [
  { label: 'JS 错误', tooltipTitle: 'JS Error', tooltipDesc: '前端错误聚合与告警' },
  { label: 'API 失败率', tooltipTitle: 'API Failure Rate', tooltipDesc: '接口可用性与失败追踪' },
];

const observabilityData: ArchChip[] = [
  { label: '转化漏斗', tooltipTitle: 'Funnel', tooltipDesc: '关键路径转化分析' },
  { label: '转化率', tooltipTitle: 'Conversion Rate', tooltipDesc: '核心指标监控与归因' },
  { label: 'A/B 实验', tooltipTitle: 'A/B Test', tooltipDesc: '实验驱动增长与验证' },
];

const strategicAxis = [
  { title: '多站点治理', subtitle: 'Multi-Site Governance' },
  { title: '营销效率', subtitle: 'Marketing Efficiency' },
  { title: '性能驱动', subtitle: 'Performance Driven' },
  { title: '工程自动化', subtitle: 'Engineering Automation' },
];

const renderPanelMaturity = () => `
  <div class="arch-panel-grid">
    <div class="arch-panel-card">
      <div class="arch-panel-title">五级成熟度模型</div>
      <div class="arch-panel-list">
        <div class="arch-panel-item"><span class="arch-panel-k">Level 1</span><span class="arch-panel-v">工具化</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">Level 2</span><span class="arch-panel-v">组件化</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">Level 3</span><span class="arch-panel-v">工程化（目标）</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">Level 4</span><span class="arch-panel-v">运行治理</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">Level 5</span><span class="arch-panel-v">数据驱动</span></div>
      </div>
    </div>
    <div class="arch-panel-card">
      <div class="arch-panel-title">当前定位与下一步</div>
      <div class="arch-panel-desc">当前约处于 ${maturity.current.label}：${maturity.current.nextStepDesc}</div>
      <div class="arch-chip-row">
        ${renderChip({ label: '目标：1 年内达到 ' + maturity.target.label, tooltipTitle: 'Target', tooltipDesc: maturity.target.tooltipDesc, variant: 'muted' })}
        ${renderChip({ label: '强调：能力而非工具', tooltipTitle: 'Principle', tooltipDesc: '对外表达强调能力，不强调工具', variant: 'muted' })}
      </div>
    </div>
  </div>
`;

const renderPanelScore = () => `
  <div class="arch-panel-grid">
    <div class="arch-panel-card">
      <div class="arch-panel-title">总分 100（季度自评）</div>
      <div class="arch-panel-table">
        <div class="arch-panel-row"><div class="arch-panel-k">工程治理</div><div class="arch-panel-v">30</div></div>
        <div class="arch-panel-row"><div class="arch-panel-k">组件资产化</div><div class="arch-panel-v">20</div></div>
        <div class="arch-panel-row"><div class="arch-panel-k">运行体系</div><div class="arch-panel-v">20</div></div>
        <div class="arch-panel-row"><div class="arch-panel-k">性能与数据闭环</div><div class="arch-panel-v">20</div></div>
        <div class="arch-panel-row"><div class="arch-panel-k">营销交付能力</div><div class="arch-panel-v">10</div></div>
      </div>
    </div>
    <div class="arch-panel-card">
      <div class="arch-panel-title">分数解读</div>
      <div class="arch-panel-list">
        <div class="arch-panel-item"><span class="arch-panel-k">≥ 80</span><span class="arch-panel-v">成熟工程体系</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">60–80</span><span class="arch-panel-v">结构稳定，未数据驱动</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">&lt; 60</span><span class="arch-panel-v">仍偏工具化</span></div>
      </div>
      <div class="arch-panel-desc mt-3">对内：用打分体系做季度自评；对外：展示分层架构、工程平台、性能治理与多站点能力。</div>
    </div>
  </div>
`;

const renderPanelUpgrade = () => `
  <div class="arch-upgrade">
    <div class="arch-upgrade-top">
      <div class="arch-panel-grid">
        <div class="arch-panel-card">
          <div class="arch-panel-title">升级背景</div>
          <div class="arch-panel-list">
            <div class="arch-panel-item"><span class="arch-panel-k">痛点</span><span class="arch-panel-v">工程能力未形成闭环</span></div>
            <div class="arch-panel-item"><span class="arch-panel-k">痛点</span><span class="arch-panel-v">领域能力抽象不足</span></div>
            <div class="arch-panel-item"><span class="arch-panel-k">痛点</span><span class="arch-panel-v">性能与转化未打通</span></div>
            <div class="arch-panel-item"><span class="arch-panel-k">痛点</span><span class="arch-panel-v">多站点扩展成本高</span></div>
          </div>
        </div>
        <div class="arch-panel-card">
          <div class="arch-panel-title">升级目标与原则</div>
          <div class="arch-panel-desc">目标：稳定交付、高频营销、性能驱动增长、多站点可扩展。</div>
          <div class="arch-panel-list mt-3">
            <div class="arch-panel-item"><span class="arch-panel-k">原则</span><span class="arch-panel-v">分层清晰</span></div>
            <div class="arch-panel-item"><span class="arch-panel-k">原则</span><span class="arch-panel-v">规范自动化</span></div>
            <div class="arch-panel-item"><span class="arch-panel-k">原则</span><span class="arch-panel-v">资产沉淀</span></div>
            <div class="arch-panel-item"><span class="arch-panel-k">原则</span><span class="arch-panel-v">数据闭环</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="arch-upgrade-actions">
      <div class="arch-upgrade-grid">
        <div class="arch-upgrade-card">
          <div class="arch-upgrade-title">工程平台</div>
          <div class="arch-upgrade-desc">Monorepo、版本发布、CI 门禁、体积与质量基线。</div>
        </div>
        <div class="arch-upgrade-card">
          <div class="arch-upgrade-title">组件体系</div>
          <div class="arch-upgrade-desc">JBC 领域拆分、复用率提升、依赖分层约束。</div>
        </div>
        <div class="arch-upgrade-card">
          <div class="arch-upgrade-title">运行体系</div>
          <div class="arch-upgrade-desc">CDN/缓存策略、灰度发布、快速回滚、SSR/Edge。</div>
        </div>
        <div class="arch-upgrade-card">
          <div class="arch-upgrade-title">监控闭环</div>
          <div class="arch-upgrade-desc">Web Vitals、错误追踪、漏斗转化、性能与 GMV 关联。</div>
        </div>
      </div>
    </div>

    <div class="arch-upgrade-kpis">
      <div class="arch-kpi-grid">
        <div class="arch-kpi-card">
          <div class="arch-kpi-title">效率</div>
          <div class="arch-kpi-value">活动开发效率 ↑ 30%</div>
        </div>
        <div class="arch-kpi-card">
          <div class="arch-kpi-title">性能</div>
          <div class="arch-kpi-value">首屏加载 ↓ 20%</div>
        </div>
        <div class="arch-kpi-card">
          <div class="arch-kpi-title">构建</div>
          <div class="arch-kpi-value">构建时间 ↓ 40%</div>
        </div>
        <div class="arch-kpi-card">
          <div class="arch-kpi-title">稳定</div>
          <div class="arch-kpi-value">线上事故 ↓ 50%</div>
        </div>
      </div>
    </div>

    <div class="arch-upgrade-outbound">
      <div class="arch-panel-title">对外一句话表达</div>
      <div class="arch-panel-desc">工程治理能力 + 运行稳定性 + 性能驱动增长：用可持续交付体系支撑全球电商增长。</div>
    </div>
  </div>
`;

const assessmentStatusMeta = (status: string): { label: string; variant: ArchChipVariant; tooltipDesc: string } => {
  switch (status) {
    case 'done':
      return { label: '完成', variant: 'success', tooltipDesc: '已固化为默认能力，可重复执行' };
    case 'partial':
      return { label: '部分', variant: 'warning', tooltipDesc: '存在但不稳定/未覆盖主路径/未形成门禁' };
    default:
      return { label: '缺失', variant: 'muted', tooltipDesc: '未形成可执行的主路径或缺少证据' };
  }
};

const renderEvidence = (raw: string) => {
  const value = raw.trim();
  if (!value) return '<span class="text-slate-500">待补充</span>';

  const parts = value
    .split(/[\n;,，]+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const rendered = parts.map((p) => {
    const segments = p.split('|').map((s) => s.trim());
    const hasPair = segments.length >= 2;
    const label = hasPair ? segments[0] : '';
    const url = hasPair ? segments.slice(1).join('|') : p;
    const isHttp = /^https?:\/\/\S+$/i.test(url);

    if (isHttp) {
      const text = label || url;
      return `<a class="text-orange-700 hover:underline" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
    }

    return `<span class="font-mono text-slate-600">${escapeHtml(p)}</span>`;
  });

  return rendered.join('<span class="mx-1 text-slate-400">•</span>');
};

const renderPanelRubric = () => {
  const items = selfAssessment.items;
  const done = items.filter((it) => it.status === 'done').length;
  const partial = items.filter((it) => it.status === 'partial').length;
  const missing = items.filter((it) => it.status === 'missing').length;
  const total = items.length;
  return `
    <div class="arch-panel-grid">
      <div class="arch-panel-card">
        <div class="arch-panel-title">自评判据（可勾选）</div>
        <div class="arch-panel-desc">用于把“成熟度”从感受变成清单：每条都要能给出证据（规则配置、流水线、链接或截图）。</div>
        <div class="arch-panel-table">
          <div class="arch-panel-row">
            <div class="arch-panel-k">更新时间</div>
            <div class="arch-panel-v">${selfAssessment.lastUpdated}</div>
          </div>
          <div class="arch-panel-row">
            <div class="arch-panel-k">统计</div>
            <div class="arch-panel-v">完成 ${done} / 部分 ${partial} / 缺失 ${missing}（共 ${total}）</div>
          </div>
        </div>
      </div>
      <div class="arch-panel-card">
        <div class="arch-panel-title">如何判定 Level 0.5</div>
        <div class="arch-panel-desc">当“入口不统一、门禁不稳定、资产少且不可规模复用”时，按 Level 0.5 处理更真实；先把主路径跑通，再谈评分与提效。</div>
        <div class="arch-panel-desc mt-3">建议先达成：代码入口（A）+ 质量门禁（B）+ 最小发布可追溯（D）+ 共享环境可验证（E1）。</div>
      </div>
    </div>
    <div class="arch-panel-card mt-3">
      <div class="arch-panel-title">判据清单</div>
      <div class="arch-panel-table">
        ${items
          .map((it) => {
            const meta = assessmentStatusMeta(it.status);
            const evidence = renderEvidence(it.evidence);
            return `
              <div class="arch-panel-row">
                <div class="min-w-0 flex-1 pr-3">
                  <div class="text-sm font-extrabold text-slate-800">${escapeAttr(it.category)}</div>
                  <div class="mt-1 text-sm text-slate-700 wrap-break-word">${escapeAttr(it.criterion)}</div>
                  <div class="mt-1 text-xs text-slate-500 wrap-break-word">证据：${evidence}</div>
                </div>
                <div class="shrink-0">
                  ${renderChip({ label: meta.label, tooltipTitle: 'Status', tooltipDesc: meta.tooltipDesc, variant: meta.variant })}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
};

const renderArchitecture = () => `
  <section class="w-full mb-12 md:mb-20">
    <div class="flex flex-col gap-3 mb-6 md:mb-8">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h3 class="text-xl md:text-2xl font-bold border-l-4 border-orange-500 pl-4 text-gray-900">电商前端工程与运行治理全景图</h3>
          <div class="mt-2 text-xs md:text-sm text-gray-500 pl-4">Engineering & Revenue Driven Architecture</div>
          <div class="arch-quicknav" aria-label="架构分层导航">
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-business">Business</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-domain">Domain</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-design">Design</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-platform">Platform</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-runtime">Runtime</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-observability">Observability</button>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="text-xs text-gray-400 font-mono">LIVE MAP v${archMeta.liveMapVersion}</div>
          <div class="flex flex-wrap justify-end gap-2">
            ${renderChip({ label: '适用：多站点电商体系', tooltipTitle: 'Designed for', tooltipDesc: '支持多站点、多语言与高频营销交付的架构蓝图', variant: 'muted' })}
            ${renderChip({ label: archMeta.blueprintYear, tooltipTitle: 'Version', tooltipDesc: '蓝图版本标注', variant: 'muted' })}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Diagram Container -->
    <div class="relative w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-8">
      <div class="arch-blueprint-bg"></div>

      <div class="relative z-10">
        <div class="arch-meta-row">
          <div class="arch-meta-left">
            ${renderChip({ label: '构建：Passing', tooltipTitle: 'Build Status', tooltipDesc: '构建与校验通过', variant: 'success' })}
            ${renderChip({ label: 'JDS v' + archMeta.jdsVersion, tooltipTitle: 'Design System', tooltipDesc: '设计系统版本', variant: 'warning' })}
            ${renderChip({ label: 'JBC v' + archMeta.jbcVersion, tooltipTitle: 'Business Components', tooltipDesc: '领域能力包版本', variant: 'purple' })}
          </div>
          <div class="arch-meta-right">
            ${renderChip({ label: '当前成熟度：' + maturity.current.label, tooltipTitle: 'Current Maturity', tooltipDesc: maturity.current.subtitle, variant: 'muted' })}
            ${renderChip({ label: '自评更新：' + maturity.lastUpdated, tooltipTitle: 'Updated', tooltipDesc: '成熟度与自评数据最后更新时间', variant: 'muted' })}
            ${renderChip({ label: '目标：' + maturity.target.label, tooltipTitle: 'Target', tooltipDesc: maturity.target.tooltipDesc, variant: 'muted' })}
          </div>
        </div>

        <div class="arch-canvas">
          <aside class="arch-axis">
            <div class="arch-axis-title">战略侧轴</div>
            <div class="arch-axis-list">
              ${strategicAxis
                .map((it) => `<div class="arch-axis-item" title="${escapeAttr(it.subtitle)}" aria-label="${escapeAttr(it.subtitle)}"><div class="arch-axis-item-title">${it.title}</div><div class="arch-axis-item-sub">${it.subtitle}</div></div>`)
                .join('')}
            </div>
          </aside>

          <div class="arch-layers">
            <div class="arch-layer arch-tone-blue" id="arch-layer-business">
              <div class="arch-layer-row">
                ${layerTitle('Business Layer', '变现业务层')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">直接面向用户的商业入口，承接转化与高频营销交付。</div>
                  <div class="arch-layer-tags">${businessTags.map(renderChip).join('')}</div>
                  <div class="arch-modules arch-modules-5">
                    ${businessModules.map((m) => `<div class="arch-module-card">${renderChip(m)}</div>`).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-purple" id="arch-layer-domain">
              <div class="arch-layer-row">
                ${layerTitle('Domain Capability', '电商领域能力层')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">JBC：按领域沉淀能力包（Commerce / Marketing / Account），页面只做组合。</div>
                  <div class="arch-domain-cols">
                    <div class="arch-domain-col">
                      <div class="arch-domain-title">Commerce</div>
                      <div class="arch-chip-row">${domainCommerce.map(renderChip).join('')}</div>
                    </div>
                    <div class="arch-domain-col">
                      <div class="arch-domain-title">Marketing</div>
                      <div class="arch-chip-row">${domainMarketing.map(renderChip).join('')}</div>
                    </div>
                    <div class="arch-domain-col">
                      <div class="arch-domain-title">Account</div>
                      <div class="arch-chip-row">${domainAccount.map(renderChip).join('')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-orange" id="arch-layer-design">
              <div class="arch-layer-row">
                ${layerTitle('Design System', '设计系统（JDS）')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">统一 Tokens、基础组件与视觉资产，支持多主题与国际化。</div>
                  <div class="arch-layer-tags">${designTags.map(renderChip).join('')}</div>
                  <div class="arch-design-cols">
                    ${designColumns
                      .map(
                        (col) => `
                          <div class="arch-design-col">
                            <div class="arch-design-title">${col.title}</div>
                            <div class="arch-design-sub">${col.subtitle}</div>
                            <div class="arch-chip-row">${col.chips.map(renderChip).join('')}</div>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                  <div class="arch-support-row">
                    <div class="arch-support-label">支撑能力</div>
                    <div class="arch-support-chips">${designSupport.map(renderChip).join('')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-yellow arch-layer-platform" id="arch-layer-platform">
              <div class="arch-layer-row">
                <div class="arch-platform-head">
                  ${layerTitle('Engineering Platform', '前端工程平台')}
                  <div class="arch-platform-watermark">PLATFORM</div>
                </div>
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">工程能力闭环（治理 / 交付 / 构建 / 质量），体现工程实力。</div>
                  <div class="arch-platform-grid">
                    ${platformQuadrants
                      .map(
                        (q) => `
                          <div class="arch-platform-card">
                            <div class="arch-platform-title">${q.title}</div>
                            <div class="arch-platform-sub">${q.subtitle}</div>
                            <div class="arch-chip-row">${q.chips.map(renderChip).join('')}</div>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                  <div class="arch-platform-deps">${platformDependency.map(renderChip).join('')}</div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-green" id="arch-layer-runtime">
              <div class="arch-layer-row">
                ${layerTitle('Runtime Layer', '运行与交付')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">多区域交付与可回滚的运行体系，保障稳定上线与快速止损。</div>
                  <div class="arch-modules arch-modules-5">
                    ${runtimeModules.map((m) => `<div class="arch-module-card">${renderChip(m)}</div>`).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-red" id="arch-layer-observability">
              <div class="arch-layer-row">
                ${layerTitle('Observability', '可观测性与数据闭环')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">性能 → 转化 → 收入闭环，用数据驱动性能与业务增长。</div>
                  <div class="arch-obs-cols">
                    <div class="arch-obs-col">
                      <div class="arch-obs-title">Performance</div>
                      <div class="arch-chip-row">${observabilityPerformance.map(renderChip).join('')}</div>
                    </div>
                    <div class="arch-obs-col">
                      <div class="arch-obs-title">Error Tracking</div>
                      <div class="arch-chip-row">${observabilityErrors.map(renderChip).join('')}</div>
                    </div>
                    <div class="arch-obs-col">
                      <div class="arch-obs-title">Data & Conversion</div>
                      <div class="arch-chip-row">${observabilityData.map(renderChip).join('')}</div>
                    </div>
                  </div>
                  <div class="arch-obs-loop">Performance → Conversion → Revenue Loop</div>
                </div>
              </div>
            </div>
          </div>

          <aside class="arch-maturity">
            <div class="arch-maturity-title">成熟度</div>
            <div class="arch-maturity-level">${maturity.current.label} / ${maturity.current.maxLevel}</div>
            <div class="arch-maturity-bars">
              ${maturity.bars
                .map(
                  (b) => `
                    <div class="arch-bar" title="${escapeAttr(b.tooltip)}" aria-label="${escapeAttr(b.tooltip)}">
                      <div class="arch-bar-top">
                        <div class="arch-bar-label">${b.label}</div>
                        <div class="arch-bar-value">${b.value}%</div>
                      </div>
                      <div class="arch-bar-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${b.value}">
                        <div class="arch-bar-fill" style="width:${b.value}%"></div>
                      </div>
                    </div>
                  `
                )
                .join('')}
            </div>
          </aside>
        </div>

        <div class="arch-summary">
          <div class="arch-summary-grid">
            <div class="arch-summary-card">
              <div class="arch-summary-title">核心价值</div>
              <div class="arch-summary-list">
                <div class="arch-summary-item">提升转化率</div>
                <div class="arch-summary-item">支持高频营销</div>
                <div class="arch-summary-item">支持多区域站点</div>
              </div>
            </div>
            <div class="arch-summary-card">
              <div class="arch-summary-title">工程效率</div>
              <div class="arch-summary-list">
                <div class="arch-summary-item">代码治理自动化</div>
                <div class="arch-summary-item">持续集成与部署</div>
                <div class="arch-summary-item">性能监控体系</div>
              </div>
            </div>
            <div class="arch-summary-card">
              <div class="arch-summary-title">运行保障</div>
              <div class="arch-summary-list">
                <div class="arch-summary-item">多区域 CDN</div>
                <div class="arch-summary-item">灰度发布机制</div>
                <div class="arch-summary-item">快速回滚能力</div>
              </div>
            </div>
          </div>
        </div>

        <div class="arch-panels" data-arch-panels>
          <div class="arch-tabs" role="tablist" aria-label="架构说明与自评">
            <button class="arch-tab is-active" type="button" role="tab" aria-selected="true" data-arch-tab="maturity">成熟度模型说明</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="score">架构自评打分体系</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="rubric">自评判据清单</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="upgrade">升级方案摘要</button>
          </div>
          <div class="arch-panel is-active" role="tabpanel" data-arch-panel="maturity">
            ${renderPanelMaturity()}
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="score" hidden>
            ${renderPanelScore()}
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="rubric" hidden>
            ${renderPanelRubric()}
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="upgrade" hidden>
            ${renderPanelUpgrade()}
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

const setupArchPanels = () => {
  const root = document.querySelector<HTMLElement>('[data-arch-panels]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-arch-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-arch-panel]'));

  const activate = (key: string) => {
    tabs.forEach((t) => {
      const active = t.dataset.archTab === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    panels.forEach((p) => {
      const active = p.dataset.archPanel === key;
      p.classList.toggle('is-active', active);
      p.toggleAttribute('hidden', !active);
    });
  };

  tabs.forEach((t) => {
    t.addEventListener('click', () => {
      const key = t.dataset.archTab;
      if (!key) return;
      activate(key);
    });
  });
};

setupArchPanels();

const setupArchQuickNav = () => {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-arch-jump]'));
  if (!buttons.length) return;

  const highlight = (el: HTMLElement) => {
    el.classList.add('is-focus');
    window.setTimeout(() => el.classList.remove('is-focus'), 1200);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.archJump;
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      highlight(el);
    });
  });
};

setupArchQuickNav();

const setupArchTooltipLayerLift = () => {
  const selector = '.arch-chip[data-tooltip-title], .arch-chip[data-tooltip-desc]';
  const activeClass = 'is-tooltip-open';

  const lift = (target: Element | null) => {
    const layer = target?.closest('.arch-layer');
    if (!layer) return;
    layer.classList.add(activeClass);
  };

  const drop = (target: Element | null) => {
    const layer = target?.closest('.arch-layer');
    if (!layer) return;
    layer.classList.remove(activeClass);
  };

  document.addEventListener('pointerenter', (e) => {
    const el = (e.target as Element | null)?.closest(selector);
    if (!el) return;
    lift(el);
  }, true);

  document.addEventListener('pointerleave', (e) => {
    const el = (e.target as Element | null)?.closest(selector);
    if (!el) return;
    drop(el);
  }, true);

  document.addEventListener('focusin', (e) => {
    const el = (e.target as Element | null)?.closest(selector);
    if (!el) return;
    lift(el);
  });

  document.addEventListener('focusout', (e) => {
    const el = (e.target as Element | null)?.closest(selector);
    if (!el) return;
    drop(el);
  });
};

setupArchTooltipLayerLift();
