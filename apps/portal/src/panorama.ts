import { archMeta, maturity, selfAssessment } from './architecture-data';

type ArchChipVariant = 'default' | 'muted' | 'tag' | 'success' | 'warning' | 'purple';

interface ArchChip {
  label: string;
  tooltipTitle?: string;
  tooltipDesc?: string;
  variant?: ArchChipVariant;
}

// 工程与运行治理全景图（原首页内容原样保留，仅命名统一旧称 → ZDS）

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
  return `<span class="arch-chip ${chipVariantClass(chip.variant)}"${attrs}><span class="arch-chip-label">${chip.label}</span></span>`;
};

const layerTitle = (en: string, zh: string) =>
  `<div class="arch-layer-head"><div class="arch-layer-zh">${zh}</div><div class="arch-layer-en">${en}</div></div>`;

const businessModules: ArchChip[] = [
  { label: '多端站点', tooltipTitle: 'Multi-Site', tooltipDesc: '官网与多区域站点入口' },
  { label: '内容化站点', tooltipTitle: 'Content Sites', tooltipDesc: '内容生产与多语言管理' },
  { label: '营销活动', tooltipTitle: 'Campaign', tooltipDesc: '高频营销活动页与落地页' },
  { label: '账户与会员', tooltipTitle: 'Account & Membership', tooltipDesc: '登录、权益、订单等账户体系' },
  { label: '客服与支持', tooltipTitle: 'Support', tooltipDesc: '售前/售后支持与服务入口' },
];

const businessTags: ArchChip[] = [
  { label: '多区域', tooltipTitle: 'Multi-Region', tooltipDesc: 'US / EU / JP 多站点治理', variant: 'tag' },
  { label: 'SEO 驱动', tooltipTitle: 'SEO Driven', tooltipDesc: '流量获取与可发现性', variant: 'tag' },
  { label: '营销活动支撑', tooltipTitle: 'Marketing Support', tooltipDesc: '活动快速交付与复用', variant: 'tag' },
];

const atlasTags: ArchChip[] = [
  { label: 'Schema First', tooltipTitle: 'Schema First', tooltipDesc: '内容结构为唯一真理', variant: 'tag' },
  { label: 'Schema 版本化', tooltipTitle: 'Versioning', tooltipDesc: 'schemaVersion 或等价机制可识别', variant: 'tag' },
  { label: 'Registry 映射', tooltipTitle: 'Registry', tooltipDesc: '通过 type/key 映射到组件实现白名单', variant: 'tag' },
];

const atlasModules: ArchChip[] = [
  { label: '内容建模', tooltipTitle: 'Modeling', tooltipDesc: 'Content Type / 字段与约束' },
  { label: '可视化搭建', tooltipTitle: 'Editor', tooltipDesc: 'Section/Block 组合与配置' },
  { label: '预览与发布', tooltipTitle: 'Preview & Publish', tooltipDesc: '多环境发布与回滚' },
  { label: '审计与追溯', tooltipTitle: 'Audit', tooltipDesc: '变更记录与权限审计' },
  { label: '兼容与迁移', tooltipTitle: 'Compatibility', tooltipDesc: '向后兼容优先，必要时 transform' },
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
      { label: '依赖分层', tooltipTitle: 'Dependency Layering', tooltipDesc: '分层依赖约束' },
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
  { label: '页面可直接使用 ZDS', tooltipTitle: '依赖方向', tooltipDesc: '页面使用基础组件和样式；基础组件不依赖业务页面', variant: 'muted' },
  { label: '真实复用后再增加组合层', tooltipTitle: '业务组件准入', tooltipDesc: '同一模式在至少三个真实场景使用，行为稳定后再抽象', variant: 'muted' },
  { label: '依赖检查：待补充', tooltipTitle: '检查配置', tooltipDesc: '建议用 lint 或依赖图自动检查跨层引用', variant: 'muted' },
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
  { label: '体验漏斗', tooltipTitle: 'Funnel', tooltipDesc: '关键路径转化分析' },
  { label: '核心指标', tooltipTitle: 'Conversion Rate', tooltipDesc: '核心指标监控与归因' },
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

const renderPanelArchitectureDiagram = () => `
  <div class="arch-panel-grid">
    <div class="arch-panel-card col-span-1 md:col-span-2">
      <div class="arch-panel-title">系统关系与链路（规划）</div>
      <div class="arch-panel-desc">实线表示访问与内容数据，虚线表示组件包的构建依赖。Atlas 与页面内的组件映射仍在规划；站点监控由业务项目接入。手机可在图内左右滑动，下方有文字说明。</div>
      
      <div class="arch-c4-container" tabindex="0" role="region" aria-label="完整规划关系图，可横向滚动；下方有文字说明">
        <svg viewBox="0 0 1200 920" class="arch-c4-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="blueprint-title blueprint-desc">
          <title id="blueprint-title">多站点前端架构规划</title>
          <desc id="blueprint-desc">用户通过 CDN 访问站点；Atlas 通过 Schema API 提供内容数据，页面渲染核心映射到设计系统组件。NPM 分发组件包供应用构建。运行监控由站点负责，未绘制监控接入线。</desc>
          <!-- 定义箭头标记 -->
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>

          <!-- 分层背景 -->
          <g class="arch-c4-layers">
            <!-- 接入层背景 -->
            <rect x="0" y="40" width="1200" height="100" class="arch-c4-layer-bg arch-c4-client-bg" rx="8"/>
            <text x="60" y="95" class="arch-c4-layer-label">用户端</text>
            
            <!-- 边缘层背景 -->
            <rect x="0" y="150" width="1200" height="120" class="arch-c4-layer-bg arch-c4-edge-bg" rx="8"/>
            <text x="60" y="205" class="arch-c4-layer-label">访问加速</text>
            
            <!-- 应用层背景 -->
            <rect x="0" y="290" width="1200" height="140" class="arch-c4-layer-bg arch-c4-app-bg" rx="8"/>
            <text x="60" y="345" class="arch-c4-layer-label">应用层</text>
            
            <!-- 编排层背景 -->
            <rect x="0" y="450" width="1200" height="170" class="arch-c4-layer-bg arch-c4-orchestration-bg" rx="8"/>
            <text x="60" y="505" class="arch-c4-layer-label">内容与渲染</text>
            
            <!-- 领域层背景 -->
            <rect x="0" y="640" width="1200" height="140" class="arch-c4-layer-bg arch-c4-domain-bg" rx="8"/>
            <text x="60" y="695" class="arch-c4-layer-label">界面组件包</text>
            
            <!-- 基础设施层背景 -->
            <rect x="0" y="800" width="1200" height="110" class="arch-c4-layer-bg arch-c4-infra-bg" rx="8"/>
            <text x="60" y="855" class="arch-c4-layer-label">分发与监控</text>
          </g>

          <!-- 节点定义 -->
          <g class="arch-c4-nodes">
            <!-- 接入层节点 -->
            <g class="arch-c4-node arch-c4-actor" data-id="user" transform="translate(530, 60)">
              <rect x="0" y="0" width="140" height="60" rx="30" class="arch-c4-node-shape"/>
              <text x="70" y="23" class="arch-c4-node-title">用户设备</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--actor">
                <rect x="40" y="36" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="70" y="45" class="arch-c4-type-badge-text">角色</text>
              </g>
            </g>

            <!-- 边缘层节点 -->
            <g class="arch-c4-node arch-c4-system" data-id="cdn" transform="translate(520, 170)">
              <rect x="0" y="0" width="160" height="80" rx="4" class="arch-c4-node-shape"/>
              <text x="80" y="30" class="arch-c4-node-title">全球 CDN</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--system">
                <rect x="50" y="52" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="80" y="61" class="arch-c4-type-badge-text">外部系统</text>
              </g>
            </g>

            <!-- 应用层节点 -->
            <g class="arch-c4-node arch-c4-container" data-id="multisite" transform="translate(210, 310)">
              <rect x="0" y="0" width="180" height="100" rx="4" class="arch-c4-node-shape"/>
              <text x="90" y="32" class="arch-c4-node-title">多端站点</text>
              <text x="90" y="52" class="arch-c4-node-desc">官网与业务入口</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--container">
                <rect x="60" y="70" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="90" y="79" class="arch-c4-type-badge-text">容器</text>
              </g>
            </g>

            <g class="arch-c4-node arch-c4-container" data-id="contentsite" transform="translate(510, 310)">
              <rect x="0" y="0" width="180" height="100" rx="4" class="arch-c4-node-shape"/>
              <text x="90" y="32" class="arch-c4-node-title">内容化站点</text>
              <text x="90" y="52" class="arch-c4-node-desc">内容生产与多语言管理</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--container">
                <rect x="60" y="70" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="90" y="79" class="arch-c4-type-badge-text">容器</text>
              </g>
            </g>

            <g class="arch-c4-node arch-c4-container" data-id="campaign" transform="translate(810, 310)">
              <rect x="0" y="0" width="180" height="100" rx="4" class="arch-c4-node-shape"/>
              <text x="90" y="32" class="arch-c4-node-title">营销落地页</text>
              <text x="90" y="52" class="arch-c4-node-desc">高频营销活动页</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--container">
                <rect x="60" y="70" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="90" y="79" class="arch-c4-type-badge-text">容器</text>
              </g>
            </g>

            <!-- 编排层节点 -->
            <g class="arch-c4-node arch-c4-container" data-id="atlas" transform="translate(820, 490)">
              <rect x="0" y="0" width="160" height="90" rx="4" class="arch-c4-node-shape"/>
              <text x="80" y="28" class="arch-c4-node-title">Atlas 内容平台</text>
              <text x="80" y="46" class="arch-c4-node-desc">内容建模 · 规划中</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--container">
                <rect x="50" y="62" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="80" y="71" class="arch-c4-type-badge-text">容器</text>
              </g>
            </g>

            <g class="arch-c4-node arch-c4-container" data-id="renderer" transform="translate(210, 485)">
              <rect x="0" y="0" width="180" height="100" rx="4" class="arch-c4-node-shape"/>
              <text x="90" y="32" class="arch-c4-node-title">渲染核心</text>
              <text x="90" y="52" class="arch-c4-node-desc">组件映射 · 规划中</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--container">
                <rect x="60" y="70" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="90" y="79" class="arch-c4-type-badge-text">页面代码</text>
              </g>
            </g>

            <g class="arch-c4-node arch-c4-component" data-id="schema-api" transform="translate(520, 495)">
              <rect x="0" y="0" width="160" height="80" rx="8" class="arch-c4-node-shape"/>
              <text x="80" y="22" class="arch-c4-node-title">内容 API</text>
              <text x="80" y="42" class="arch-c4-node-desc">JSON 数据 · 规划中</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--component">
                <rect x="50" y="52" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="80" y="61" class="arch-c4-type-badge-text">组件</text>
              </g>
            </g>

            <!-- 领域层节点 -->
            <g class="arch-c4-node arch-c4-container" data-id="zone" transform="translate(460, 660)">
              <rect x="0" y="0" width="180" height="100" rx="4" class="arch-c4-node-shape"/>
              <text x="90" y="32" class="arch-c4-node-title">ZDS 设计系统</text>
              <text x="90" y="52" class="arch-c4-node-desc">样式与组件 · 已实现</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--container">
                <rect x="60" y="70" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="90" y="79" class="arch-c4-type-badge-text">组件包</text>
              </g>
            </g>

            <!-- 基础设施层节点 -->
            <g class="arch-c4-node arch-c4-system" data-id="npm" transform="translate(320, 815)">
              <rect x="0" y="0" width="160" height="80" rx="4" class="arch-c4-node-shape"/>
              <text x="80" y="22" class="arch-c4-node-title">npm 包仓库</text>
              <text x="80" y="42" class="arch-c4-node-desc">组件与资产分发</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--system">
                <rect x="50" y="52" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="80" y="61" class="arch-c4-type-badge-text">外部系统</text>
              </g>
            </g>

            <g class="arch-c4-node arch-c4-system" data-id="observability" transform="translate(720, 815)">
              <rect x="0" y="0" width="160" height="80" rx="4" class="arch-c4-node-shape"/>
              <text x="80" y="22" class="arch-c4-node-title">站点监控</text>
              <text x="80" y="42" class="arch-c4-node-desc">性能与错误监控</text>
              <g class="arch-c4-type-badge arch-c4-type-badge--system">
                <rect x="50" y="52" width="60" height="18" rx="9" class="arch-c4-type-badge-bg"/>
                <text x="80" y="61" class="arch-c4-type-badge-text">外部系统</text>
              </g>
            </g>
          </g>

          <!-- 连线定义 -->
          <g class="arch-c4-flows">
            <!-- 用户访问流向 -->
            <path d="M 600 120 L 600 170" class="arch-c4-flow arch-c4-flow-user" marker-end="url(#arrowhead)"/>
            <text x="610" y="145" class="arch-c4-flow-label">访问</text>

            <!-- CDN 到应用层流向 -->
            <path d="M 600 250 Q 600 290 300 310" class="arch-c4-flow arch-c4-flow-cdn" marker-end="url(#arrowhead)"/>
            <text x="450" y="285" class="arch-c4-flow-label">分发</text>

            <path d="M 600 250 L 600 310" class="arch-c4-flow arch-c4-flow-cdn" marker-end="url(#arrowhead)"/>
            <text x="610" y="285" class="arch-c4-flow-label">分发</text>

            <path d="M 600 250 Q 600 290 900 310" class="arch-c4-flow arch-c4-flow-cdn" marker-end="url(#arrowhead)"/>
            <text x="750" y="285" class="arch-c4-flow-label">分发</text>

            <!-- 应用层到编排层流向 -->
            <path d="M 300 410 L 300 485" class="arch-c4-flow arch-c4-flow-app" marker-end="url(#arrowhead)"/>
            <text x="310" y="445" class="arch-c4-flow-label">渲染</text>

            <path d="M 600 410 L 600 440 L 300 440 L 300 485" class="arch-c4-flow arch-c4-flow-app" marker-end="url(#arrowhead)"/>
            <text x="450" y="430" class="arch-c4-flow-label">渲染</text>

            <path d="M 900 410 L 900 440 L 300 440 L 300 485" class="arch-c4-flow arch-c4-flow-app" marker-end="url(#arrowhead)"/>
            <text x="600" y="430" class="arch-c4-flow-label">渲染</text>

            <!-- 编排层内部流向 -->
            <path d="M 820 535 L 680 535" class="arch-c4-flow arch-c4-flow-content" marker-end="url(#arrowhead)"/>
            <text x="750" y="527" class="arch-c4-flow-label">发布</text>

            <path d="M 520 535 L 390 535" class="arch-c4-flow arch-c4-flow-content" marker-end="url(#arrowhead)"/>
            <text x="455" y="527" class="arch-c4-flow-label">JSON</text>

            <!-- 编排层到领域层流向 -->
            <path d="M 300 585 L 300 620 L 550 620 L 550 660" class="arch-c4-flow arch-c4-flow-render" marker-end="url(#arrowhead)"/>
            <text x="420" y="612" class="arch-c4-flow-label">组件映射 / 样式调用</text>

            <!-- 基础设施到领域层流向 -->
            <path d="M 400 815 Q 500 800 550 760" class="arch-c4-flow arch-c4-flow-asset" marker-end="url(#arrowhead)"/>
            <text x="470" y="800" class="arch-c4-flow-label">NPM 包</text>
          </g>
        </svg>
      </div>

      <div class="arch-legend">
        <div class="arch-legend-item"><span class="arch-legend-line"></span> 访问与内容数据</div>
        <div class="arch-legend-item"><span class="arch-legend-line arch-legend-line--dependency"></span> 组件包的构建依赖</div>
        <div class="arch-legend-item">节点内标注“已实现”或“规划中”；外部系统需另行核实</div>
      </div>
    </div>
  </div>
  
  <div class="arch-panel-grid mt-3">
    <div class="arch-panel-card">
      <div class="arch-panel-title">关键流向说明</div>
      <div class="arch-panel-list">
        <div class="arch-panel-item"><span class="arch-panel-k">页面访问</span><span class="arch-panel-v">用户 → CDN → 业务站点；渲染代码属于页面应用</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">内容数据</span><span class="arch-panel-v">Atlas → 内容 API → 页面内的组件映射（规划）</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">构建依赖</span><span class="arch-panel-v">从 NPM 安装 ZDS → 应用构建 → 部署页面</span></div>
      </div>
    </div>
    <div class="arch-panel-card">
      <div class="arch-panel-title">核心设计决策</div>
      <div class="arch-panel-list">
        <div class="arch-panel-item"><span class="arch-panel-k">内容与界面分开</span><span class="arch-panel-v">Atlas 按约定输出数据，页面负责生成界面（规划）</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">限定可用组件</span><span class="arch-panel-v">只把数据中的组件名映射到已登记的实现（规划）</span></div>
        <div class="arch-panel-item"><span class="arch-panel-k">分层依赖</span><span class="arch-panel-v">基础设施对上层透明，依赖单向流动</span></div>
      </div>
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
          <div class="arch-upgrade-desc">组件复用率提升、依赖分层约束。</div>
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
      <div class="arch-panel-desc">工程治理能力 + 运行稳定性 + 性能驱动：用可持续交付体系支撑多站点前端协同。</div>
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
      <div class="arch-panel-title">历史自评判据</div>
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
  <div class="panorama">
    <details class="arch-capabilities">
      <summary>展开七层能力规划：业务、内容、组件、工程、运行与监控</summary>
      <p class="arch-note">下面列出目标能力范围。设计系统已实现基础组件与样式；内容平台和业务组合层尚未建设，工程与运行能力需要逐项确认。</p>
          <div class="arch-quicknav" aria-label="架构分层导航">
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-business">业务页面</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-atlas">内容平台</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-domain">业务组合</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-design">设计系统</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-platform">工程工具</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-runtime">站点运行</button>
            <button class="arch-quickbtn" type="button" data-arch-jump="arch-layer-observability">运行监控</button>
          </div>
    
    <!-- Diagram Container -->
    <div class="arch-blueprint">
      <div class="arch-blueprint-bg"></div>

      <div class="arch-blueprint-content">
        <div class="arch-meta-row">
          <div class="arch-meta-left">
            ${renderChip({ label: 'ZDS v' + archMeta.zoneVersion + ' · 已实现', variant: 'success' })}
            ${renderChip({ label: 'ZBC · 规划中', variant: 'muted' })}
            ${renderChip({ label: 'Atlas · 规划中', variant: 'muted' })}
          </div>
        </div>

        <div class="arch-canvas">
          <aside class="arch-axis">
            <div class="arch-axis-title">战略维度（概览）</div>
            <div class="arch-axis-list">
              ${strategicAxis
                .map((it) => `<div class="arch-axis-item" title="${escapeAttr(it.subtitle)}" aria-label="${escapeAttr(it.subtitle)}"><div class="arch-axis-item-title">${it.title}</div><div class="arch-axis-item-sub">${it.subtitle}</div></div>`)
                .join('')}
            </div>
          </aside>

          <div class="arch-layers">
            <div class="arch-layer arch-tone-blue" id="arch-layer-business">
              <div class="arch-layer-row">
                ${layerTitle('Business Layer', '业务页面 · 外部范围')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">面向用户的站点、账户与活动页面，由业务项目负责。</div>
                  <div class="arch-layer-tags">${businessTags.map(renderChip).join('')}</div>
                  <div class="arch-chip-row">
                    ${businessModules.map(renderChip).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-cyan" id="arch-layer-atlas">
              <div class="arch-layer-row">
                ${layerTitle('Content Platform', '内容平台 · Atlas 规划中')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">Atlas 计划负责定义内容结构、编辑和发布数据。页面按约定把内容数据对应到组件，本仓库尚未实现该平台。</div>
                  <div class="arch-layer-tags">${atlasTags.map(renderChip).join('')}</div>
                  <div class="arch-chip-row">
                    ${atlasModules.map(renderChip).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-purple" id="arch-layer-domain">
              <div class="arch-layer-row">
                ${layerTitle('Business Components', '业务组合 · ZBC 规划中')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">ZBC 计划组合基础组件，复用稳定的业务界面模式。当前没有业务组件包，也没有已确认的 Atlas 组件供给。</div>
                  <div class="arch-chip-row">
                    ${renderChip({ label: '营销活动', tooltipTitle: 'Marketing Campaigns', tooltipDesc: '活动页与营销玩法组件（占位）' })}
                    ${renderChip({ label: '表单流程', tooltipTitle: 'Form Flows', tooltipDesc: '复杂表单与流程编排组件（占位）' })}
                    ${renderChip({ label: '数据展示', tooltipTitle: 'Data Display', tooltipDesc: '列表 / 图表等数据展示组件（占位）' })}
                    ${renderChip({ label: '达到复用条件后再建设', variant: 'tag' })}
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-orange" id="arch-layer-design">
              <div class="arch-layer-row">
                ${layerTitle('Design System', '设计系统 · ZDS 已实现')}
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
                  ${layerTitle('Engineering Platform', '工程工具 · 部分配置')}
                  <div class="arch-platform-watermark">PLATFORM</div>
                </div>
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">已有仓库构建、CI 与文档检查配置；下列预览、依赖限制、体积与安全检查仍需逐项补齐或核实。</div>
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
                ${layerTitle('Runtime Layer', '站点运行 · 外部范围')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">站点项目负责部署、缓存、灰度与回滚。下列是运行规划，不是本组件仓库已经提供的服务。</div>
                  <div class="arch-chip-row">
                    ${runtimeModules.map(renderChip).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="arch-layer arch-tone-red" id="arch-layer-observability">
              <div class="arch-layer-row">
                ${layerTitle('Observability', '运行监控 · 外部范围')}
                <div class="arch-layer-body">
                  <div class="arch-layer-desc">站点项目采集加载性能、错误与业务效果，再据此改进页面。本仓库尚未接入这些运行监控服务。</div>
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
                      <div class="arch-obs-title">Data & Insights</div>
                      <div class="arch-chip-row">${observabilityData.map(renderChip).join('')}</div>
                    </div>
                  </div>
                  <div class="arch-obs-loop">Performance → Stability → Delivery Loop</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="arch-summary">
          <div class="arch-summary-grid">
            <div class="arch-summary-card">
              <div class="arch-summary-title">核心价值</div>
              <div class="arch-summary-list">
                <div class="arch-summary-item">提升交付效率</div>
                <div class="arch-summary-item">营销活动快速交付</div>
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
        
      </div>
    </div>
    </details>
    <details class="arch-history">
      <summary>历史自评数据 · ${maturity.lastUpdated} · 未重新核实</summary>
      <p class="arch-note">保留原自评百分比供追溯，不能当作当前成熟度。内网 GitLab、Jenkins 与 CDN 的证据未在此次核查中验证。</p>
        <aside class="arch-maturity">
          <div class="arch-maturity-title">历史成熟度</div>
          <div class="arch-maturity-level">${maturity.current.label} / ${maturity.current.maxLevel}</div>
          <div class="arch-maturity-bars">
            ${maturity.bars
              .map(
                (b) => `
                  <div class="arch-bar" data-tooltip-title="${escapeAttr(b.label)}" data-tooltip-desc="${escapeAttr(b.tooltip)}" aria-label="${escapeAttr(b.label)} · ${escapeAttr(b.tooltip)}" tabindex="0">
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

    </details>
        <div class="arch-panels" data-arch-panels>
          <div class="arch-tabs" role="tablist" aria-label="架构说明与自评">
            <button class="arch-tab is-active" type="button" role="tab" aria-selected="true" data-arch-tab="arch">系统关系图</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="maturity">历史成熟度模型</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="score">旧评分方法</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="rubric">历史自评判据</button>
            <button class="arch-tab" type="button" role="tab" aria-selected="false" data-arch-tab="upgrade">原升级设想</button>
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="maturity" hidden>
            <p class="arch-note">以下定位来自 ${maturity.lastUpdated} 的旧自评，未重新核实，不代表本次源码评估结论。</p>
            ${renderPanelMaturity()}
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="score" hidden>
            ${renderPanelScore()}
          </div>
          <div class="arch-panel is-active" role="tabpanel" data-arch-panel="arch">
            ${renderPanelArchitectureDiagram()}
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="rubric" hidden>
            <p class="arch-note">这是 ${selfAssessment.lastUpdated} 的历史记录。内网证据未验证，部分“缺失”项如今已有 CI 配置，不能直接作为当前结论。</p>
            ${renderPanelRubric()}
          </div>
          <div class="arch-panel" role="tabpanel" data-arch-panel="upgrade" hidden>
            <p class="arch-note">以下为原目标设想，提效百分比没有本次测量依据。当前优化优先级见本页“优化建议”。</p>
            ${renderPanelUpgrade()}
          </div>
        </div>
  </div>
`;


export const renderPanorama = () => renderArchitecture();

export const setupPanorama = () => {
  setupArchPanels();
  setupArchQuickNav();
  setupArchitectureTooltip();
};

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
      t.tabIndex = active ? 0 : -1;
    });

    panels.forEach((p) => {
      const active = p.dataset.archPanel === key;
      p.classList.toggle('is-active', active);
      p.toggleAttribute('hidden', !active);
    });
  };

  tabs.forEach((t) => {
    const key = t.dataset.archTab!;
    t.id = `arch-tab-${key}`;
    t.setAttribute('aria-controls', `arch-panel-${key}`);
    t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
    const panel = panels.find((p) => p.dataset.archPanel === key);
    if (panel) {
      panel.id = `arch-panel-${key}`;
      panel.setAttribute('aria-labelledby', t.id);
    }
    t.addEventListener('click', () => {
      const key = t.dataset.archTab;
      if (!key) return;
      activate(key);
    });
    t.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = tabs.indexOf(t);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[next].dataset.archTab!);
      tabs[next].focus();
    });
  });
};
const setupArchitectureTooltip = () => {
  const bars = Array.from(document.querySelectorAll<HTMLElement>('.arch-maturity .arch-bar, .arch-chip[data-tooltip-title]'));
  if (!bars.length) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'arch-tooltip-float';
  tooltip.id = 'architecture-tooltip';
  tooltip.setAttribute('role', 'tooltip');

  const titleEl = document.createElement('span');
  titleEl.className = 'arch-tooltip-title';

  const descEl = document.createElement('span');
  descEl.className = 'arch-tooltip-desc';

  tooltip.appendChild(titleEl);
  tooltip.appendChild(descEl);
  document.body.appendChild(tooltip);

  let active: HTMLElement | null = null;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const position = () => {
    if (!active) return;

    const title = active.dataset.tooltipTitle ?? '';
    const desc = active.dataset.tooltipDesc ?? '';

    titleEl.textContent = title;
    descEl.textContent = desc;

    tooltip.classList.add('is-measuring');
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    tooltip.classList.remove('is-measuring');

    const barTop = active.querySelector<HTMLElement>('.arch-bar-top');
    const anchor = (barTop ?? active).getBoundingClientRect();

    const pad = 12;
    const desiredLeft = anchor.left;
    const left = clamp(desiredLeft, pad, window.innerWidth - width - pad);

    const aboveTop = anchor.top - height - 10;
    const belowTop = anchor.bottom + 10;
    const placeBelow = aboveTop < pad && belowTop + height + pad < window.innerHeight;

    const top = placeBelow ? belowTop : Math.max(pad, aboveTop);

    const anchorX = clamp(anchor.left + 24 - left, 16, width - 16);
    tooltip.style.setProperty('--tip-arrow-x', `${anchorX}px`);
    tooltip.classList.toggle('is-below', placeBelow);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const show = (bar: HTMLElement) => {
    active?.removeAttribute('aria-describedby');
    active = bar;
    active.setAttribute('aria-describedby', tooltip.id);
    tooltip.classList.add('is-visible');
    position();
  };

  const hide = () => {
    active?.removeAttribute('aria-describedby');
    active = null;
    tooltip.classList.remove('is-visible', 'is-below');
  };

  bars.forEach((bar) => {
    bar.addEventListener('mouseenter', () => show(bar));
    bar.addEventListener('mouseleave', hide);
    bar.addEventListener('focusin', () => show(bar));
    bar.addEventListener('focusout', hide);
  });

  window.addEventListener('scroll', position, true);
  window.addEventListener('resize', position);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(); });
};

const setupArchQuickNav = () => {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-arch-jump]'));
  if (!buttons.length) return;

  const getHeaderOffset = () => {
    const headerHost = document.querySelector<HTMLElement>('[data-site-header]');
    const topbar = headerHost?.querySelector<HTMLElement>('.portal-topbar');
    const height = (topbar ?? headerHost)?.getBoundingClientRect().height ?? 0;
    return Math.ceil(height);
  };

  const applyHeaderOffsetVar = () => {
    const height = getHeaderOffset();
    if (!height) return;
    document.documentElement.style.setProperty('--site-header-offset', `${height}px`);
  };

  const highlight = (el: HTMLElement) => {
    el.classList.add('is-focus');
    window.setTimeout(() => el.classList.remove('is-focus'), 1200);
  };

  applyHeaderOffsetVar();
  window.addEventListener('resize', applyHeaderOffsetVar, { passive: true });

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.archJump;
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const offset = getHeaderOffset() + 12;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      highlight(el);
    });
  });
};
