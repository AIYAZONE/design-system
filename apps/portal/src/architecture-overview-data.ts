export type CapabilityStatus = 'implemented' | 'partial' | 'planned';
export type ChainId = 'content' | 'code' | 'visit';
export interface Capability {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  status: CapabilityStatus;
  includes: string;
  collaboration: string;
  statusNote: string;
}
export interface CapabilityBand {
  id: string;
  title: string;
  caption: string;
  groups: Capability[];
}
const group = (
  id: string, title: string, summary: string, tags: string[], status: CapabilityStatus,
  includes: string, collaboration: string, statusNote: string,
): Capability => ({ id, title, summary, tags, status, includes, collaboration, statusNote });

export const capabilityStatusLabels: Record<CapabilityStatus, string> = {
  implemented: '已有实现', partial: '部分实现', planned: '规划',
};
export const capabilityBands: CapabilityBand[] = [
  {
    id: 'business', title: '业务应用', caption: '用户直接使用的入口',
    groups: [
      group('brand', '品牌与内容', '呈现品牌、产品与内容', ['品牌站', '内容页', '多站点'], 'partial',
        '品牌主页、内容页面与产品介绍；语言和区域作为站点配置。',
        'Atlas 管理内容，页面渲染与站点交付负责呈现。',
        'Atlas 有站点与页面源码；实际品牌站点的上线范围待核实。'),
      group('shop', '电商店面', '浏览商品、购物车与结账', ['商品', '购物车', 'Shopify'], 'partial',
        '商品展示、购物车与外部结账入口。',
        '页面通过业务 API 对接 Shopify；交易由外部系统负责。',
        'Atlas 有商品、购物车及店铺接入源码；完整交易链路待验证。'),
      group('campaign', '营销活动', '承载专题与活动页面', ['专题', '落地页', '线索'], 'planned',
        '营销专题、活动落地页及线索表单。',
        '复用 Atlas 内容和 ZDS 界面；稳定重复的模式可采用 ZBC。',
        '保留业务入口，完整活动能力尚无实现依据。'),
      group('account', '账户与会员', '提供账户与会员入口', ['账户', '会员', '订单入口'], 'planned',
        '消费者账户页面、会员展示与订单查询入口。',
        '由对应业务 API 或外部业务系统提供数据。',
        '消费者会员仍属规划；Atlas 管理账户不代表消费者会员已实现。'),
      group('support', '帮助与支持', '提供帮助内容与联系入口', ['帮助中心', 'FAQ', '联系表单'], 'planned',
        '帮助文章、常见问题与联系入口。',
        '内容由 Atlas 管理，交互界面使用 ZDS。',
        '本图保留应用范围，完整支持业务待实际场景建设。'),
    ],
  },
  {
    id: 'atlas', title: '内容平台 Atlas', caption: '管理、搭建与发布内容',
    groups: [
      group('sites', '站点与素材管理', '组织站点配置与公共素材', ['站点', '语言 / 区域', '素材'], 'partial',
        '站点、域名、主题、语言与店铺配置，以及图片等素材。',
        '向搭建器提供配置与素材引用，文件存储承载素材文件。',
        '站点和素材接口已有源码；文件存储与生产配置仍需核实。'),
      group('model', '内容建模', '定义页面和内容的结构', ['页面结构', '内容字段', '版本'], 'partial',
        '页面内容、字段结构与内容版本；Schema 表示可识别的数据结构。',
        '搭建器写入内容，页面渲染按结构读取和映射。',
        '页面、Schema 与内容版本源码可查；跨版本兼容仍待完善。'),
      group('builder', '可视化搭建', '用组件组合页面内容', ['拖拽搭建', '属性编辑', '页面配置'], 'partial',
        '页面编辑、组件属性与公共区块，输出页面配置。',
        '读取内容模型与素材，复用渲染能力进行预览。',
        'Atlas Builder 已有源码；完整组件接入范围待验证。'),
      group('publish', '预览与发布', '把确认的内容交给站点', ['预览', '发布', '内容版本'], 'partial',
        '预览页面、内容发布与历史版本操作。',
        '页面配置与内容交给 Runtime 渲染，产物通过站点交付发布。',
        '预览及发布源码已有；完整产物回退和发布状态仍需完善。'),
    ],
  },
  {
    id: 'zbc', title: '业务组合 ZBC', caption: '规划 · 按复用需要采用',
    groups: [
      group('zbc-marketing', '营销展示', '组合常用营销内容区块', ['头图', '卖点', '行动入口'], 'planned',
        '由基础组件组合的营销展示模式。',
        '使用 ZDS；可按需映射进页面，不是页面的必经依赖。',
        '尚在规划，需有至少三个真实复用场景再建设。'),
      group('zbc-form', '表单组合', '组合常见输入与反馈模式', ['表单布局', '校验反馈', '提交状态'], 'planned',
        '输入、校验提示与提交反馈的界面组合。',
        '复用 ZDS 基础组件，数据请求由使用页面负责。',
        '组合模式规划中，不包含新的业务后端服务。'),
      group('zbc-data', '数据展示', '组合列表与信息展示模式', ['列表', '筛选', '信息展示'], 'planned',
        '稳定复用的列表、筛选与信息展示界面。',
        '使用 ZDS；数据由页面或业务 API 提供。',
        '等待真实复用证据，不将基础组件重写为组合层。'),
    ],
  },
  {
    id: 'zds', title: '设计系统 ZDS', caption: '页面可直接使用的基础界面',
    groups: [
      group('tokens', '设计令牌与主题', '统一颜色、尺寸与界面风格', ['颜色 / 间距', '主题', '样式'], 'implemented',
        '版本化设计令牌、CSS 变量与主题样式。',
        '基础组件与业务页面共享令牌，工程构建生成产物。',
        '本仓库令牌生成和主题样式已有实现。'),
      group('components', '基础组件', '提供可复用的交互界面', ['Lit', 'Web Components', '组件包'], 'implemented',
        '按钮、输入、弹窗等十个基础组件与机器可读 API。',
        '页面直接使用 ZDS，也可按需组合为 ZBC；不依赖 Atlas。',
        '本仓库组件、类型与样例已实现；下游接入情况需单独验证。'),
      group('assets', '视觉资产', '提供图标与统一视觉资源', ['图标', '动态图标', '资源规范'], 'implemented',
        '图标资源、按需加载与视觉使用说明。',
        '组件和页面使用图标，工程流程生成资源清单。',
        '本仓库图标包和动态加载已有实现。'),
      group('utilities', '国际化与工具', '支持语言切换与常用界面逻辑', ['多语言', '格式化', '工具函数'], 'implemented',
        '界面语言、格式化与可复用工具函数。',
        '页面负责业务内容翻译，ZDS 提供基础界面的语言支持。',
        '本仓库 i18n 与 utils 包已有实现。'),
    ],
  },
  {
    id: 'engineering', title: '工程平台', caption: '从源码到可使用的交付物',
    groups: [
      group('source', '代码与版本管理', '维护源码、变更与包版本', ['Git', 'Monorepo', '版本记录'], 'implemented',
        '源码仓库、工作区依赖与版本变更记录。',
        '将组件和应用源码交给构建流程。',
        '本仓库 Git、pnpm 工作区和版本工具已有配置。'),
      group('quality', '构建与质量检查', '生成产物并检查交付质量', ['构建', '类型 / 测试', 'CI'], 'implemented',
        '组件包与应用构建，以及类型、lint、测试和文档检查。',
        '读取源码，向部署和应用接入提供产物。',
        '本仓库检查和 CI 配置已有；远端每次运行结果另行核实。'),
      group('deploy', '预览与部署', '交付组件包和站点产物', ['组件包', '应用产物', '部署'], 'partial',
        '组件包交付、预览环境与站点部署。',
        '构建产物交给站点交付；组件包安装进页面项目。',
        '本地构建与发布配置已有；真实包发布及平台部署需单独验证。'),
      group('docs', '文档与 AI 接入', '让人和 AI 读懂组件用法', ['组件文档', 'API', 'llms.txt'], 'implemented',
        '从源码生成组件清单、API 说明及 AI 接入资料。',
        '为页面开发与组件选择提供上下文，不限制模型输出。',
        '本仓库文档生成、Storybook 与 AI 说明已有实现。'),
    ],
  },
  {
    id: 'runtime', title: '运行与数据支撑', caption: '把内容和数据交付给页面',
    groups: [
      group('render', '页面渲染', '校验配置并映射为页面组件', ['Runtime', '结构校验', '组件映射'], 'partial',
        'Runtime 读取页面结构，将内容映射为对应组件；Registry 是组件映射表。',
        '接收 Atlas 内容，可直接使用 ZDS，也可按需使用 ZBC。',
        'Atlas storefront-runtime 已有源码；完整 ZDS 映射与兼容待验证。'),
      group('api', '业务 API', '为页面提供动态业务数据', ['内容接口', '商品 / 购物车', '外部接入'], 'partial',
        '内容、商品与购物车等接口；按实际应用提供动态数据。',
        '读取数据库，并对接 Shopify 等业务系统。',
        'Atlas 已有相关接口源码；完整消费者会员与支持接口仍属规划。'),
      group('storage', '数据库与文件存储', '承载内容、配置、素材和产物', ['PostgreSQL', '素材文件', '发布产物'], 'partial',
        '数据库保存内容与配置，文件存储承载素材和发布产物。',
        '供 Atlas、业务 API 和站点交付读写对应数据。',
        'PostgreSQL/Supabase 配置与本地发布文件已有；完整对象存储待核实。'),
      group('delivery', '站点交付', '将页面与公共资源送到访问者', ['静态 / SSR', 'CDN', '版本回退'], 'partial',
        '静态页面或按需 SSR、公共资源分发与版本回退。',
        '接收渲染和工程产物，向业务入口交付页面。',
        '站点与本地产物源码已有；生产 CDN、SSR 和完整回退待验证。'),
    ],
  },
  {
    id: 'feedback', title: '监控与反馈', caption: '发现问题并支持持续改进',
    groups: [
      group('performance', '页面性能', '观察加载与交互体验', ['加载速度', '交互响应', '访问体验'], 'planned',
        '页面加载、交互响应和实际访问体验。',
        '从站点获取性能反馈，支持页面和交付改进。',
        '保留观测范围；生产性能采集与告警未核实。'),
      group('errors', '前后端错误', '定位页面和接口异常', ['页面错误', 'API 错误', '日志'], 'planned',
        '前端异常、API 失败与对应日志。',
        '反馈给页面与 API 维护者，帮助定位问题。',
        '完整生产错误采集和关联能力待建设或核实。'),
      group('release-status', '发布运行状态', '观察发布结果与站点状态', ['发布结果', '可用状态', '回退记录'], 'partial',
        '内容发布结果、站点可用状态与回退记录。',
        '将结果反馈给 Atlas 预览发布和工程部署。',
        '内容发布与审计记录已有；完整发布产物及运行状态观测待完善。'),
      group('outcomes', '业务效果', '观察访问与业务目标达成', ['访问', '转化', '业务反馈'], 'planned',
        '访问、转化与业务反馈的高层指标。',
        '业务团队结合页面与外部交易数据评估效果。',
        '实际业务指标和采集方案需由业务场景确定。'),
    ],
  },
];
export const capabilities = capabilityBands.flatMap((band) => band.groups);
export const externalSystem = {
  id: 'shopify', title: 'Shopify 等业务系统',
  summary: '电商对接 Shopify，交易与结账由外部系统负责。',
};
export const keyRelations = [
  { id: 'content-render', from: 'publish', to: 'render', label: '页面配置与内容', chains: ['content'] },
  { id: 'render-page', from: 'render', to: 'brand', label: '渲染为业务页面', chains: ['content', 'code'] },
  { id: 'zds-page', from: 'components', to: 'render', label: '基础组件直接使用', chains: ['code'] },
  { id: 'zds-zbc', from: 'components', to: 'zbc-marketing', label: '按需组合 · 规划', chains: ['code'] },
  { id: 'engineering-delivery', from: 'deploy', to: 'delivery', label: '应用产物与部署', chains: ['content', 'code'] },
  { id: 'page-api', from: 'shop', to: 'api', label: '动态数据请求', chains: ['visit'] },
  { id: 'api-external', from: 'api', to: 'shopify', label: '商品、购物车与结账', chains: ['visit'] },
  { id: 'page-feedback', from: 'brand', to: 'performance', label: '性能、错误与业务反馈', chains: ['visit'] },
] satisfies { id: string; from: string; to: string; label: string; chains: ChainId[] }[];
export const mainChains: { id: ChainId; title: string; description: string; nodes: string[] }[] = [
  { id: 'content', title: '内容发布',
    description: 'Atlas 管理与搭建 → 预览发布 → 页面渲染 → 产物存储与站点交付 → 业务页面；发布结果反馈给维护者。',
    nodes: ['sites', 'model', 'builder', 'publish', 'render', 'storage', 'deploy', 'delivery', 'brand', 'release-status'] },
  { id: 'code', title: '组件与代码交付',
    description: '源码 → 构建检查 → 组件包 / 应用产物 → 页面与站点；文档和 AI 说明支持接入。页面直接使用 ZDS，ZBC 按需组合。',
    nodes: ['source', 'quality', 'deploy', 'docs', 'tokens', 'components', 'assets', 'utilities', 'zbc-marketing', 'zbc-form', 'zbc-data', 'render', 'delivery', 'brand'] },
  { id: 'visit', title: '访问与反馈',
    description: '访问业务页面 → 业务 API → 数据库或 Shopify；公共资源通过文件存储与 CDN 交付。性能、错误、发布状态和业务效果形成反馈。',
    nodes: ['brand', 'shop', 'campaign', 'account', 'support', 'api', 'storage', 'delivery', 'shopify', 'performance', 'errors', 'release-status', 'outcomes'] },
];
export const legacyGroupAliases: Record<string, string> = {
  'domain-sites': 'sites', 'domain-content': 'model', 'domain-release': 'publish',
  'experience-admin': 'builder', 'experience-runtime': 'render', 'experience-client': 'brand',
  'experience-zds': 'components', 'experience-compositions': 'zbc-marketing',
  'app-brand': 'brand', 'app-storefront': 'shop', 'app-campaign': 'campaign',
  'app-member': 'account', 'app-support': 'support', 'app-operations': 'sites',
  'access-edge': 'delivery', 'access-public': 'api', 'access-admin': 'api',
  'access-events': 'api', 'access-internal': 'api',
  'usecase-content': 'model', 'usecase-publish': 'publish', 'usecase-jobs': 'publish',
  'usecase-commerce': 'shop', 'usecase-customer': 'account', 'usecase-marketing': 'campaign',
  'domain-commerce': 'shop', 'domain-member': 'account', 'domain-engagement': 'campaign',
  'adapter-relational': 'storage', 'adapter-object': 'storage', 'adapter-messaging': 'publish',
  'adapter-search': 'api', 'adapter-external': 'api', 'adapter-analytics': 'outcomes',
  'infra-compute': 'delivery', 'infra-network': 'delivery', 'infra-database': 'storage',
  'infra-storage': 'storage', 'infra-operations': 'release-status',
  'governance-security': 'api', 'governance-delivery': 'quality',
  'governance-reliability': 'errors', 'governance-data': 'storage',
};
export function resolveGroupHash(hash: string): string | undefined {
  const match = /^#(group|module)-([a-z0-9-]+)$/.exec(hash);
  if (!match) return undefined;
  const id = match[1] === 'module' ? legacyGroupAliases[match[2]] : match[2];
  return capabilities.some((item) => item.id === id) ? id : undefined;
}
