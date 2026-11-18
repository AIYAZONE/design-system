declare const __ZONE_VERSION__: string | undefined;

export const archMeta = {
  liveMapVersion: '2.0',
  blueprintYear: '2026',
  checkedAt: '2026-11-17',
  zoneVersion: typeof __ZONE_VERSION__ === 'undefined' ? 'unknown' : __ZONE_VERSION__,
  zbcVersion: '0.1.0',
} as const;

export const maturity = {
  lastUpdated: '2026-02-26',
  current: {
    level: 0.5,
    maxLevel: 5,
    label: 'Level 0.5',
    subtitle: '起步阶段（混乱、未统一）',
    nextStepDesc: '基建薄弱，流程与标准未统一；ZDS 仍在建设中，需要先把“入口与门禁”收敛成主路径。',
  },
  target: {
    label: 'Level 1',
    tooltipDesc: '先达到工具化（Level 1）：统一入口、最小门禁与基础文档',
  },
  bars: [
    { label: '工程治理', tooltip: '分支保护 / MR 门禁 / 规范化发布 / 依赖分层门禁 / 变更可追溯', value: 15 },
    { label: '组件资产化', tooltip: 'ZONE tokens 统一 / 基础组件可复用 / 跨站复用率', value: 10 },
    { label: '运行体系', tooltip: '灰度发布 / 快速回滚 / 告警与 SLA / 事故复盘与演练 / 容量与弹性', value: 8 },
    { label: '性能与数据闭环', tooltip: 'CWV 指标 / 错误监控 / 链路分段 / 转化漏斗 / 归因与 A/B', value: 6 },
    { label: '营销交付能力', tooltip: '落地页工程化 / 模板化生产 / 多语言与多区域 / 实验配置 / 发布效率', value: 12 },
  ],
} as const;

export const selfAssessment = {
  lastUpdated: maturity.lastUpdated,
  items: [
    {
      category: '盘点（0.5）',
      criterion: '已有基础设施可用（GitLab/Jenkins/AWS CDN）',
      status: 'done',
      evidence: 'GitLab / Jenkins / AWS CDN 已就绪（内网环境）',
    },
    {
      category: '代码入口（A）',
      criterion: '所有变更通过 MR 合并到主分支',
      status: 'done',
      evidence: '内网 GitLab MR 记录',
    },
    {
      category: '代码入口（A）',
      criterion: '主分支保护开启（禁止直推）',
      status: 'done',
      evidence: '内网 GitLab 仓库设置页',
    },
    {
      category: '代码入口（A）',
      criterion: 'MR 模板包含：变更说明/风险/回滚/验证方式（可选：预览链接）',
      status: 'done',
      evidence: '内网 GitLab MR 记录',
    },
    {
      category: '质量门禁（B）',
      criterion: 'TypeScript 类型检查必过（主路径）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '质量门禁（B）',
      criterion: 'Lint 必过（含依赖分层规则）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '质量门禁（B）',
      criterion: '最小测试必过（smoke 优先）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '质量门禁（B）',
      criterion: 'Gate 失败可定位（日志统一、原因清晰）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '依赖分层（C）',
      criterion: '依赖方向明确：Apps → ZONE（域）→ 基础层',
      status: 'partial',
      evidence: '',
    },
    {
      category: '依赖分层（C）',
      criterion: '禁止 Apps 直依赖 ZONE（规则强制）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '版本发布（D）',
      criterion: '版本策略（semver）统一且有 Changelog',
      status: 'done',
      evidence: '有版本变更文档',
    },
    {
      category: '版本发布（D）',
      criterion: '产物可追溯：版本 → commit → 产物 → 发布记录',
      status: 'missing',
      evidence: '',
    },
    {
      category: '预览环境（E）',
      criterion: '共享环境可验证（合并后可在 Dev/Staging 部署并验证）',
      status: 'partial',
      evidence: '',
    },
    {
      category: '预览环境（E）',
      criterion: '按需预览（仅对高风险 MR 提供 Preview URL）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '预览环境（E）',
      criterion: '每 MR 自动预览（高级能力）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '可观测性（G）',
      criterion: 'CWV 指标可采集可查询（LCP/CLS/INP）',
      status: 'missing',
      evidence: '',
    },
    {
      category: '可观测性（G）',
      criterion: 'JS 错误与 API 失败率可聚合可告警',
      status: 'missing',
      evidence: '',
    },
    {
      category: '可观测性（G）',
      criterion: '关键漏斗/转化口径对齐并可查询',
      status: 'missing',
      evidence: '',
    },
  ],
} as const;

export const currentArchitecture = [
  {
    number: '01',
    title: '组件、统一样式和图标',
    implementation: 'packages/tokens · packages/core · packages/icons',
    detail: '按钮、弹窗等常用组件，配套颜色、字号、间距和可搜索的图标。',
    output: '令牌 CSS / TypeScript · Web Components · 图标包',
  },
  {
    number: '02',
    title: '文档如何生成',
    implementation: 'Custom Elements Manifest · zone-manifest · docs/api',
    detail: '从组件源码提取属性和用法，生成组件文档与 AI 可读说明，方便核对已有功能。',
    output: '组件 API 文档 · llms.txt · llms-full.txt',
  },
  {
    number: '03',
    title: '安装与使用',
    implementation: 'npm · CDN · Storybook · examples · portal',
    detail: '在前端项目中安装组件包，或在静态 HTML 中引入固定版本。页面示例展示实际操作。',
    output: '可安装的包 · 交互示例 · 机器可读参考',
  },
] as const;

export const currentChecks = [
  { name: '源码与包', detail: '构建、代码规范、类型检查、组件测试和包文件校验' },
  { name: '独立安装', detail: '六个打包产物的 ESM/CJS、严格类型、混用注册、多语言和生产样式' },
  { name: '发布前检查', detail: '标签发布先执行同一提交的 CI；远端运行结果需提交后确认' },
  { name: '统一样式', detail: '样式生成结果与未使用样式变量的颜色' },
  { name: '文档', detail: '组件清单、API 文档和 AI 索引同步' },
  { name: '页面示例', detail: '账户设置示例的组件属性、图标名、样式变量与表单标签' },
  { name: '页面呈现', detail: '组件文档渲染检查；配置截图服务后可比较视觉变化' },
] as const;

export const futureWork = [
  {
    state: '按真实复用推进',
    title: '业务组合组件',
    detail: '某种业务模式在多个真实页面重复后，再考虑做成可复用的组合组件。',
  },
  {
    state: '同级项目已有源码',
    title: 'Atlas 内容平台',
    detail: 'Atlas 已有 Admin、Builder、Java API、Preview、Publisher、Web 与共享运行库；生产部署与可靠发布仍待验证。',
  },
  {
    state: '由业务系统负责',
    title: '业务站点监控与发布',
    detail: '业务站点的发布、运行监控和效果统计，由相应业务系统负责。',
  },
] as const;

export type ImplementationStatus = 'source-present' | 'partial' | 'planned' | 'proposed' | 'unverified';
export type RelationKind = 'code' | 'call' | 'event' | 'artifact' | 'governance';
export type Perspective = 'current' | 'target';
export interface Layer { id: string; order: number; title: string; question: string; summary: string }
export interface Feature {
  id: string; moduleId: string; title: string; detail: string;
  implementationStatus: ImplementationStatus; origin: string; evidenceIds: string[];
}
export interface Module {
  id: string; layerId: string; kind: 'module' | 'application' | 'governance'; title: string;
  responsibility: string; featureIds: string[]; contractIds: string[]; dataIds: string[];
  deploymentIds: string[]; evidenceIds: string[]; boundaries: string[]; ownerRole: string;
  implementationStatus: ImplementationStatus; validationStatus: 'verified' | 'configured' | 'unverified';
  deploymentStatus: 'confirmed' | 'target' | 'external-unverified';
}
export interface Relation {
  id: string; from: string; to: string; kind: RelationKind; label: string; scenarioIds: string[];
  perspective: Perspective; evidenceIds: string[];
}
export interface Contract {
  id: string; title: string; perspective: Perspective; input: string; output: string;
  errors: string; consistency: string; versioning: string; evidenceIds: string[];
}
export interface DataAsset {
  id: string; title: string; ownerModuleId: string; sourceOfTruth: string; store: string;
  regionPolicy: string; readers: string[]; writers: string[]; lifecycle: string; status: ImplementationStatus;
}
export interface Deployment {
  id: string; title: string; scope: 'global' | 'regional' | 'external'; technology: string;
  moduleIds: string[]; failureBoundary: string; status: 'confirmed' | 'target' | 'external-unverified';
}
export interface Evidence {
  id: string; kind: 'source' | 'doc' | 'config' | 'test' | 'runtime'; path: string;
  checkedAt: string; note: string; publicHref?: string;
}
export interface Scenario { id: string; title: string; description: string }
export interface ValidationItem { id: string; title: string; status: string; detail: string; evidenceIds: string[] }
export interface ArchitectureGap { id: string; title: string; current: string; target: string; ownerRole: string; evidenceIds: string[] }

export const statusLabels: Record<ImplementationStatus, string> = {
  'source-present': '源码已有', partial: '部分已有', planned: '已规划', proposed: '候选设计', unverified: '待核实',
};
export const layers: Layer[] = [
  { id: 'L7', order: 7, title: '业务应用', question: '谁完成什么任务', summary: '按使用人群与完整任务分类；站点、语言和区域是配置维度。' },
  { id: 'L6', order: 6, title: '体验与呈现', question: '如何变成交互界面', summary: '管理界面、运行渲染、基础组件与客户端；ZDS 属于这一层。' },
  { id: 'L5', order: 5, title: 'API 与接入', question: '请求进入哪个能力', summary: '身份、站点上下文与输入校验在可信服务端完成。' },
  { id: 'L4', order: 4, title: '用例与流程', question: '一次任务如何编排', summary: '用例协调领域规则与端口；发布与异步任务显式管理失败。' },
  { id: 'L3', order: 3, title: '领域能力', question: '谁负责规则与数据', summary: '按数据与业务规则划分所有权，跨领域通过公开契约合作。' },
  { id: 'L2', order: 2, title: '数据与技术适配', question: '怎样存储与集成', summary: '适配器实现内层端口；目标领域不依赖 ORM 或云 SDK。' },
  { id: 'L1', order: 1, title: '运行基础设施', question: '在哪里运行与恢复', summary: '按区域与故障域部署；逻辑模块不等于独立微服务。' },
];

export const evidence: Evidence[] = [
  { id: 'e-zds', kind: 'source', path: 'ZDS/packages/core/src/index.ts · packages/{tokens,icons,i18n,utils} · src/index.ts', checkedAt: '2026-11-17', note: '十组件和六包源码、产物接口可查；不证明下游全部接入。', publicHref: '/ai-usage.html' },
  { id: 'e-ci', kind: 'config', path: 'ZDS/.github/workflows/{ci,release}.yml · packages/core/scripts/build-ai-docs.mjs', checkedAt: '2026-11-17', note: '构建、CEM/清单、API 文档、包检查与发布门禁配置；远端运行另核实。', publicHref: '/llms.txt' },
  { id: 'e-api', kind: 'source', path: 'Atlas/apps/atlas-api/src/main/java/com/atlas/api/controller', checkedAt: '2026-11-17', note: 'sites、site-stores、pages、assets、global-sections、products、cart、accounts、schemas 接口存在。Account 不代表消费者会员。' },
  { id: 'e-ui', kind: 'source', path: 'Atlas/apps/{atlas-admin,atlas-builder,atlas-web} · packages/{schema,storefront-runtime,auth-ui,atlas-client,atlas-ui}', checkedAt: '2026-11-17', note: 'Vue/Nuxt 管理、搭建及站点渲染源码；Preview/Publisher/Web 部分直接相对导入 runtime 源码。' },
  { id: 'e-publish', kind: 'source', path: 'Atlas/apps/atlas-api/src/main/java/com/atlas/api/service/PagePublishService.java', checkedAt: '2026-11-17', note: '发布、审计与版本操作；回滚直接切历史内容版本并清草稿，不生成新版本。库内事务不覆盖产物与 CDN。' },
  { id: 'e-worker', kind: 'source', path: 'Atlas/apps/atlas-publisher/src/services/publish-flow.mjs', checkedAt: '2026-11-17', note: '实际先 client.publish 标记 LIVE，再渲染并 writeFile 到 dist/{site}；顶部注释顺序过时。' },
  { id: 'e-preview', kind: 'source', path: 'Atlas/apps/atlas-api/.../controller/PreviewController.java · apps/atlas-preview', checkedAt: '2026-11-17', note: 'Java /preview/{pageId} 代理与 Node 预览存在；生产入口鉴权覆盖待验证。' },
  { id: 'e-db', kind: 'config', path: 'Atlas/apps/atlas-api/src/main/resources/application.yml · pom.xml · repository', checkedAt: '2026-11-17', note: '主配置 PostgreSQL/Supabase；H2 保留迁移配置，README 的 H2→MySQL 说明过时。Service 直接依赖 Repository。' },
  { id: 'e-scale', kind: 'doc', path: 'atlas-docs/部署与 NFR、Scale 设计草案', checkedAt: '2026-11-17', note: 'AWS、容量及高可用仅设计草案，不证明生产部署或演练通过。' },
  { id: 'e-plan', kind: 'doc', path: 'ZDS/.trae/documents/20261117_架构全景UI重设计与模块补全计划.md', checkedAt: '2026-11-17', note: '用户批准的目标蓝图：数字商业、区域归属写入、混合部署；候选契约需后续实施评审。' },
];

type ModuleSeed = [string, string, string, string, ImplementationStatus, string[], string, string?];
const seeds: ModuleSeed[] = [
  ['app-brand', 'L7', '品牌与内容门户', '访客了解品牌、阅读文章和产品资料。', 'partial', ['e-ui'], '品牌首页|文章与内容展示|产品资料|搜索与 SEO*'],
  ['app-storefront', 'L7', '电商店面', '买家浏览商品、管理购物车并进入 Shopify 结账。', 'partial', ['e-ui', 'e-api'], '商品详情与集合页|购物车交互|结账跳转|库存价格展示'],
  ['app-campaign', 'L7', '营销活动中心', '访客参与活动、提交线索；运营配置投放。', 'proposed', ['e-plan'], '落地页装配|活动规则|线索表单|同意管理|投放归因'],
  ['app-member', 'L7', '会员中心', '消费者登录、查询资料、权益及订单入口。', 'proposed', ['e-plan'], '消费者登录|资料管理|会员权益|订单查询适配'],
  ['app-support', 'L7', '帮助与售后门户', '用户检索帮助、提交问题并跟踪服务进度。', 'proposed', ['e-plan'], '帮助知识|服务搜索|售后工单|服务进度'],
  ['app-operations', 'L7', '运营工作台', '运营管理页面、站点与素材，完成预览和发布。', 'source-present', ['e-ui', 'e-api'], 'Atlas Admin|Atlas Builder|页面素材管理|预览与发布|站点配置'],
  ['experience-admin', 'L6', '管理 UI', 'Admin/Builder 与共享管理壳，处理编辑状态。', 'source-present', ['e-ui'], '共享管理壳 atlas-ui|认证界面 auth-ui|可视化搭建|编辑表单|预览入口'],
  ['experience-runtime', 'L6', '站点渲染', 'Runtime 将校验后的内容、主题与能力装配成页面。', 'partial', ['e-ui', 'e-preview'], 'Schema 校验|Registry 映射|Theme 装配|SSR 与 SSG|未知组件回退*|兼容矩阵*'],
  ['experience-zds', 'L6', 'ZDS 基础库', '通用界面原语，不承载会员、交易或内容发布规则。', 'source-present', ['e-zds'], '令牌与主题 tokens|badge · button · checkbox|dialog · dropdown · filter-select|popover · spinner · toast · tooltip|图标 icons|国际化 i18n|工具 utils|总包 design-system'],
  ['experience-compositions', 'L6', '业务组合', '复用稳定的营销、表单与展示界面模式。', 'proposed', ['e-plan'], '营销展示模式|表单模式|列表与数据展示|至少三真实场景准入', 'ZDS 不反向依赖组合；业务数据与埋点由应用负责。'],
  ['experience-client', 'L6', '客户端接入', '稳定 API 客户端、站点路由与界面状态。', 'partial', ['e-ui'], 'atlas-client|站点路由|状态与表单|错误提示|公开 DTO 与协议版本*'],
  ['access-edge', 'L5', '边缘路由', '将可信 Host 映射到站点与 homeRegion。', 'proposed', ['e-plan'], 'Host 解析|区域识别|TLS 与 WAF|限流|未知域名拒绝', '客户端 siteId 不能建立授权；个人 API 不用公共缓存。'],
  ['access-public', 'L5', '公共 API', '内容、商品和购物车的公开查询与命令入口。', 'partial', ['e-api'], '内容查询|商品查询|购物车命令|公开视图 DTO*|消费者接入*'],
  ['access-admin', 'L5', '管理 API', '管理编辑、站点、发布与预览请求。', 'partial', ['e-api', 'e-preview'], '页面与版本接口|站点店铺接口|素材全局区块|预览代理入口|组织站点授权*'],
  ['access-events', 'L5', '外部事件接入', '可信接收外部事件并路由至区域能力。', 'proposed', ['e-plan'], 'Webhook 验签|时间窗校验|事件去重|区域映射|持久接收后确认'],
  ['access-internal', 'L5', '服务间接入', '定义内部请求的身份、超时与协议边界。', 'proposed', ['e-plan'], '内部身份|超时与重试预算|协议版本|关联 ID|调用配额'],
  ['usecase-content', 'L4', '内容管理用例', '编排建页、草稿、复制及内容引用同步。', 'partial', ['e-api', 'e-publish'], '建页与草稿|复制与归档|素材引用|全局区块同步|SEO 与路径规则|并发 revision 冲突*'],
  ['usecase-publish', 'L4', '发布与预览流程', '协调校验、版本、构建、上线和回滚。', 'partial', ['e-publish', 'e-worker', 'e-preview'], '当前内容版本发布|当前回滚与下线|当前 Node 预览|固定四版本*|不可变构建与校验*|条件激活与 CDN 确认*|历史 release 回滚*', '现状先标记 LIVE 再产物；目标失败保留旧发布，草稿处理需明确。'],
  ['usecase-commerce', 'L4', '交易用例', '编排商品、购物车操作与结账跳转。', 'partial', ['e-api'], '商品查询|购物车命令|Shopify checkout|超时与 429 策略*'],
  ['usecase-customer', 'L4', '客户服务用例', '编排会员、权益、订单与工单公开接口。', 'proposed', ['e-plan'], '消费者身份关联|权益查询|订单查询适配|客服工单适配'],
  ['usecase-marketing', 'L4', '营销用例', '协调活动、线索、用户同意与归因。', 'proposed', ['e-plan'], '活动参与|线索提交|同意管理|归因记录'],
  ['usecase-jobs', 'L4', '异步任务', '管理后台任务生命周期、重试与补偿。', 'proposed', ['e-plan'], '排队与状态|幂等执行|每站点激活串行|重试与补偿|定时任务|死信处置'],
  ['domain-sites', 'L3', '组织品牌与站点', '站点域负责域名、内容配置、店铺与发布归属。组织→品牌→站点；品牌 A 欧洲店面与日本店面可复用同一应用，各有域名、语言/币种、主题版本、店铺和区域。', 'partial', ['e-api'], 'site code 站点|店铺绑定|语言配置|组织与品牌模型*|homeRegion 与授权隔离*|域名与配置版本*', '站点是访问入口与配置边界，不等于组织租户或区域数据库。应用按任务分，主页/文章/购物车属于页面类型，手机/桌面属于渠道。'],
  ['domain-content', 'L3', '内容与素材', '拥有内容模型、页面版本、素材引用和全局区块。', 'partial', ['e-api', 'e-publish'], '内容模型 Schema|页面与内容版本|素材引用|全局区块|引用生命周期*'],
  ['domain-release', 'L3', '发布版本', '拥有线上指针及目标完整 release 清单。', 'partial', ['e-publish', 'e-worker'], '当前内容版本指针|当前发布审计|完整 release 模型*|不可变产物清单*|指针比较并交换*'],
  ['domain-commerce', 'L3', '商业能力边界', 'Shopify 拥有商品、价格、库存、客户、订单、支付与履约真相；平台拥有店铺映射及适配规则。', 'partial', ['e-api'], '商品与购物车适配|店铺映射|价格库存来自 Shopify|订单支付履约外部权威', '不建立 Atlas 订单支付第二真相源；查询投影不得反写权威状态。'],
  ['domain-member', 'L3', '消费者与会员', '消费者身份关联、客户资料与权益规则。', 'proposed', ['e-plan'], '消费者身份关联|资料与权益|区域归属|同意与删除策略', '集团管理 IAM 与消费者身份分离；Atlas Account 不是会员域实现。'],
  ['domain-engagement', 'L3', '营销与客服', '拥有活动、线索、知识与工单规则，按后续真实业务细分。', 'proposed', ['e-plan'], '活动与线索|知识内容|客服工单|隐私与保留期'],
  ['adapter-relational', 'L2', '关系存储适配', '当前 Repository 持久化；目标实现领域声明的端口。', 'partial', ['e-db'], 'Repository 与事务|迁移与索引|PostgreSQL 连接|端口分离*|组织站点查询约束*|可验证数据库隔离*'],
  ['adapter-object', 'L2', '对象存储适配', '当前发布写本地文件；目标对象存储管理素材与产物。', 'partial', ['e-worker'], '当前本地 dist 产物|S3 上传与清单*|不可变前缀*|签名访问*|保留与清理*'],
  ['adapter-search', 'L2', '缓存与搜索', '按实际访问规模建设可重建的缓存与索引。', 'proposed', ['e-plan'], '缓存一致性|搜索索引投影|失效与重建|容量触发', '可重建投影，不成为写入主数据源。'],
  ['adapter-messaging', 'L2', '消息任务适配', '数据库 Outbox 与托管队列协同可靠投递。', 'proposed', ['e-plan'], '事务 Outbox|至少一次投递|eventId 去重|聚合版本乱序检测|死信与回放'],
  ['adapter-external', 'L2', '外部系统适配', '通过端口连接 Shopify、身份、CRM/ERP/仓储与通知。', 'partial', ['e-api'], 'Shopify 商品购物车|身份提供方*|CRM ERP 仓储*|通知*|外部限流与熔断*'],
  ['adapter-analytics', 'L2', '分析数据管道', '归集区域事件、形成投影和允许共享的汇总。', 'proposed', ['e-plan'], '区域事件归集|报表投影|脱敏与汇总|数据质量|隐私过滤'],
  ['infra-network', 'L1', '区域网络与边缘', 'DNS/CDN/WAF、负载均衡与区域私网的部署建议。', 'proposed', ['e-scale', 'e-plan'], 'DNS 与 CloudFront|WAF 与 TLS|区域负载均衡|私网|边缘探测'],
  ['infra-compute', 'L1', '计算运行单元', '已有 Java API、Node Preview/Publisher 与 Nuxt 源码；建议分故障域部署。', 'partial', ['e-api', 'e-ui', 'e-worker', 'e-preview'], 'Java 模块化 API|Node Preview|Publisher Worker|Nuxt Web|AWS 托管容器*|独立扩缩容*'],
  ['infra-database', 'L1', '数据库资源', '现有 PostgreSQL/Supabase 配置；区域数据库与恢复为目标。', 'partial', ['e-db'], 'PostgreSQL Supabase 配置|连接池|区域主库*|备份与 PITR*|恢复演练*'],
  ['infra-storage', 'L1', '对象与队列资源', '建议区域 S3 与托管队列；缓存和搜索按容量触发。', 'proposed', ['e-scale', 'e-plan'], '区域 S3|托管队列与死信|可选缓存|可选独立搜索'],
  ['infra-operations', 'L1', '运维基础', '配置、密钥、IaC 与环境隔离，保证故障可恢复。', 'proposed', ['e-plan'], '密钥与配置|IaC|健康检查|环境隔离|扩缩容|灾备策略'],
  ['governance-security', '', '身份与安全', '管理 IAM、消费者身份、授权与审计贯穿各层。', 'proposed', ['e-plan'], '管理 IAM 与消费者分离|RBAC|组织站点授权|秘密管理|同意与审计'],
  ['governance-delivery', '', '工程交付', '构建、包版本、兼容、CI 与制品溯源。', 'partial', ['e-ci'], 'Java Node 构建隔离*|Schema API 兼容*|组件包版本|CEM 清单与 AI 文档|CI 检查|制品溯源与部署回退*'],
  ['governance-reliability', '', '可观测与可靠性', '通过日志、指标、Trace/RUM、错误预算与演练验证运行能力。', 'proposed', ['e-plan'], '日志指标 Trace|RUM|错误预算|容量告警|数据库饱和|发布积压与不一致|故障恢复'],
  ['governance-data', '', '数据与架构治理', '明确数据生命周期、驻留、契约及依赖责任。', 'proposed', ['e-plan'], '所有者与生命周期|区域驻留|契约版本|依赖门禁|ADR 与责任角色'],
];

export const contracts: Contract[] = [
  { id: 'c-existing', title: '现有 Atlas API', perspective: 'current', input: '/api/sites · /api/site-stores · /api/pages · versions/publish/rollback/preview-render · /api/assets · /api/global-sections · products/cart · /preview/{pageId}', output: '现有站点、内容、素材、商品、购物车与预览响应；以源码为准。', errors: '生产鉴权覆盖、并发与失败策略待验证。', consistency: 'Java 库内事务不覆盖 Node 文件或 CDN。', versioning: '当前内容版本；跨 Schema/Theme/Runtime 兼容待核实。', evidenceIds: ['e-api', 'e-preview', 'e-publish'] },
  { id: 'c-site', title: '解析站点上下文', perspective: 'target', input: '已验证 Host、访问区域、语言偏好', output: 'orgId / brandId / siteId / homeRegion / storeRef / locale / configVersion', errors: '未知 Host 拒绝；跨区误路由返回可重试路由提示。', consistency: '服务端可信注册表建立授权；区域归属写入。', versioning: '版本化配置；旧 site code 双读迁移。', evidenceIds: ['e-plan'] },
  { id: 'c-draft', title: '保存内容草稿', perspective: 'target', input: '主体权限、siteId、pageId、baseRevision、Schema 版本与内容', output: '新 revision 与校验结果', errors: '并发冲突明确返回；字段错误携带路径，不覆盖他人草稿。', consistency: '乐观锁与区域事务。', versioning: 'Schema 兼容矩阵；保留现有 pageId。', evidenceIds: ['e-plan'] },
  { id: 'c-release', title: '提交与查询发布', perspective: 'target', input: '固定 content/theme/runtime/config 四版本、幂等键；查询 releaseId 与授权站点', output: 'releaseId / jobId；queued → building → validating → activating → succeeded，或 failed/cancelled；含失败阶段、产物摘要', errors: '同键同请求复用任务；同键异参拒绝；失败保留旧版本。', consistency: '发布记录 + 事务 Outbox；Worker 按 releaseId 幂等，每站点激活串行。', versioning: '不可变 siteId/releaseId 前缀，关联旧内容版本。', evidenceIds: ['e-plan'] },
  { id: 'c-activate', title: '激活与回滚发布', perspective: 'target', input: '目标 releaseId、预期 currentReleaseId、校验结果或回滚原因', output: '条件更新线上指针与审计；CDN 确认前保持 activating', errors: '指针冲突重新评审；切换失败补偿/重试，不丢旧产物。', consistency: '比较并交换；不承诺跨库、S3 与 CDN 全局事务。回滚复用完整历史产物，草稿处理显式记录。', versioning: '缺完整产物的旧版本不承诺即时回滚。', evidenceIds: ['e-plan'] },
  { id: 'c-commerce', title: '交易适配', perspective: 'target', input: 'siteId、店铺映射、商品/购物车操作、消费者上下文', output: '稳定公开视图与 Shopify checkout 地址', errors: '受控超时、429、失效购物车；写入不伪成功。', consistency: 'Shopify 是交易权威；平台只持有映射与必要投影。', versioning: '公开 DTO 与外部 API 版本隔离。', evidenceIds: ['e-plan'] },
  { id: 'c-event', title: '外部事件与统一信封', perspective: 'target', input: 'provider、eventId、签名、时间戳、区域映射；eventId/type/schemaVersion/occurredAt/orgId/siteId/region/correlationId/aggregateId/aggregateVersion/data', output: '持久接收后确认；ContentVersionCreated / ReleaseRequested / ReleaseActivated / ReleaseFailed / CommerceEventReceived / CustomerConsentChanged', errors: '验签失败拒绝；重复幂等，业务失败重试/死信，乱序按聚合版本检测。', consistency: '至少一次投递 + eventId 去重 + 事务 Outbox；不携带密钥与支付敏感数据。', versioning: 'schemaVersion 向后兼容；回放与迁移需评审。', evidenceIds: ['e-plan'] },
];

export const dataAssets: DataAsset[] = [
  { id: 'd-sites', title: '组织、品牌、站点与域名', ownerModuleId: 'domain-sites', sourceOfTruth: '平台站点域；组织品牌为候选扩展', store: '区域 PostgreSQL / 管理控制面', regionPolicy: '全球只读非敏感配置副本，写入 homeRegion', readers: ['access-edge', 'experience-client', 'adapter-external'], writers: ['usecase-content'], lifecycle: '配置版本化；迁移先双读验证', status: 'partial' },
  { id: 'd-content', title: '页面、素材引用与内容版本', ownerModuleId: 'domain-content', sourceOfTruth: 'Atlas 内容域', store: '所属区域 PostgreSQL；素材对象存储为目标', regionPolicy: '公共已发布内容可分发；管理草稿按所属区域', readers: ['experience-runtime', 'usecase-publish', 'access-public'], writers: ['usecase-content'], lifecycle: 'Schema 兼容、引用清理与保留策略待补', status: 'partial' },
  { id: 'd-release', title: '发布记录、指针与产物清单', ownerModuleId: 'domain-release', sourceOfTruth: '发布域；完整 release 模型为候选', store: '当前区域库与本地文件；目标区域库 + S3', regionPolicy: '公共不可变产物可 CDN 分发', readers: ['experience-runtime', 'infra-network'], writers: ['usecase-publish', 'usecase-jobs'], lifecycle: '保留完整历史产物与审计；条件激活', status: 'partial' },
  { id: 'd-commerce', title: '商品、价格、库存与交易', ownerModuleId: 'external-shopify', sourceOfTruth: 'Shopify：客户、订单、支付、履约也由外部权威负责', store: 'Shopify；平台映射及必要缓存/投影', regionPolicy: '交易和个人数据区域策略需与供应商核实', readers: ['adapter-external', 'usecase-commerce', 'usecase-customer'], writers: ['external-shopify'], lifecycle: '投影可重建；不复制支付权威状态', status: 'partial' },
  { id: 'd-member', title: '消费者身份、资料与会员权益', ownerModuleId: 'domain-member', sourceOfTruth: '消费者身份提供方 / 会员域，待建设', store: '所属区域身份提供方与会员存储', regionPolicy: '区域驻留；与集团管理 IAM 分离', readers: ['usecase-customer'], writers: ['usecase-customer'], lifecycle: '同意、删除与保留期上线前确认', status: 'proposed' },
  { id: 'd-engagement', title: '线索、同意、工单与个人行为', ownerModuleId: 'domain-engagement', sourceOfTruth: '营销、客服与隐私域，候选', store: '区域业务库与事件存储', regionPolicy: '跨区只共享允许的脱敏或汇总', readers: ['usecase-marketing', 'usecase-customer', 'adapter-analytics'], writers: ['usecase-marketing', 'usecase-customer'], lifecycle: '目的、法律依据与保留期进入上线决策', status: 'proposed' },
  { id: 'd-projections', title: '缓存、搜索索引与分析报表', ownerModuleId: 'adapter-analytics', sourceOfTruth: '投影所有者；可重建', store: '候选缓存、搜索与区域分析存储', regionPolicy: '个人事件留区域；允许的聚合跨区', readers: ['access-public', 'app-operations'], writers: ['adapter-analytics', 'adapter-search'], lifecycle: '禁止反向写主数据，记录重建与数据质量', status: 'proposed' },
];

export const deployments: Deployment[] = [
  { id: 'dep-global', title: '全球控制面', scope: 'global', technology: '版本化站点配置、制品索引、允许共享的汇总（建议）', moduleIds: ['domain-sites', 'governance-delivery', 'governance-data'], failureBoundary: '仅非敏感配置全局只读；管理身份与审计仍按实际驻留布置。', status: 'target' },
  { id: 'dep-edge', title: 'CDN 边缘', scope: 'global', technology: 'AWS CloudFront / DNS / WAF（部署建议）', moduleIds: ['infra-network', 'access-edge', 'experience-runtime'], failureBoundary: '静态访问不依赖区域 API 可用；个人 API 不公共缓存。', status: 'target' },
  { id: 'dep-java', title: '区域 Java API', scope: 'regional', technology: 'Java 模块化部署；AWS 托管容器为建议', moduleIds: ['access-public', 'access-admin', 'usecase-content', 'usecase-publish', 'usecase-commerce', 'domain-sites', 'domain-content', 'domain-release', 'domain-commerce', 'adapter-relational', 'adapter-external', 'infra-compute'], failureBoundary: '沿用现有模块化服务；域间公开契约，不跨域访问私有表。', status: 'target' },
  { id: 'dep-preview', title: '区域 Node Preview', scope: 'regional', technology: 'Node + storefront-runtime（源码已有，生产部署待核实）', moduleIds: ['experience-runtime', 'usecase-publish', 'infra-compute'], failureBoundary: '独立伸缩与内部身份；预览失败不影响已发布页面。', status: 'target' },
  { id: 'dep-worker', title: '区域 Publisher Worker', scope: 'regional', technology: 'Node + 托管队列 + S3（可靠异步机制候选）', moduleIds: ['usecase-publish', 'usecase-jobs', 'adapter-messaging', 'adapter-object', 'infra-storage', 'infra-compute'], failureBoundary: 'CPU/IO 构建独立；每站点激活串行、不同站点配额隔离。', status: 'target' },
  { id: 'dep-web', title: '区域 Vue / Nuxt 应用', scope: 'regional', technology: 'Admin / Builder / Web；生产 SSR 待验证', moduleIds: ['app-brand', 'app-storefront', 'app-operations', 'experience-admin', 'experience-client', 'experience-runtime', 'experience-zds'], failureBoundary: '静态产物可边缘分发；动态应用独立健康检查。', status: 'target' },
  { id: 'dep-data', title: '区域持久资源', scope: 'regional', technology: 'PostgreSQL / Supabase + S3；可选队列、缓存与搜索', moduleIds: ['infra-database', 'infra-storage', 'adapter-relational', 'adapter-object', 'adapter-search', 'adapter-messaging'], failureBoundary: 'homeRegion 写主库；故障不在他区自动创建同一实体。灾备允许区域另定。', status: 'target' },
  { id: 'dep-customer', title: '区域客户、营销与分析能力', scope: 'regional', technology: '候选身份/会员、工单、活动与分析单元', moduleIds: ['app-member', 'app-support', 'app-campaign', 'access-events', 'access-internal', 'usecase-customer', 'usecase-marketing', 'domain-member', 'domain-engagement', 'adapter-analytics', 'governance-security', 'governance-reliability', 'infra-operations', 'experience-compositions'], failureBoundary: '按数据归属、负载和生命周期拆分；local/dev/staging/prod 隔离凭证与存储。', status: 'target' },
  { id: 'dep-external', title: '外部交易与企业系统', scope: 'external', technology: 'Shopify / 身份提供方 / CRM / ERP / 仓储 / 财务 / 通知', moduleIds: ['adapter-external', 'domain-commerce'], failureBoundary: '外部超时和限流显式降级；供应商部署与区域驻留待核实。', status: 'external-unverified' },
];

const contractMap: Record<string, string[]> = {
  'domain-sites': ['c-existing', 'c-site'], 'access-edge': ['c-site'],
  'usecase-content': ['c-existing', 'c-draft'], 'domain-content': ['c-draft'],
  'access-admin': ['c-existing', 'c-draft', 'c-release', 'c-activate'],
  'usecase-publish': ['c-existing', 'c-release', 'c-activate'], 'domain-release': ['c-release', 'c-activate'],
  'usecase-jobs': ['c-release', 'c-event'], 'adapter-messaging': ['c-event'],
  'access-public': ['c-existing', 'c-commerce'], 'usecase-commerce': ['c-commerce'],
  'adapter-external': ['c-commerce', 'c-event'], 'access-events': ['c-event'],
};
const layerBoundaries: Record<string, string> = {
  L7: '应用依赖体验与公开客户端；不直接读库或访问其他应用内部代码。',
  L6: 'UI 不持有管理密钥；Builder 不 import 真正 Storefront Renderer/Theme；Preview/Publisher/Web 复用 Runtime。',
  L5: '接入调用用例与契约；领域不反向依赖 Controller，公开 DTO 不作为持久化实体。',
  L4: '目标只依赖领域与端口，不直接依赖云 SDK 或其他域私有表。当前 Service→Repository 仍待演进。',
  L3: '目标纯领域只依赖自身规则与纯类型，不依赖 HTTP、ORM、AWS 或 Shopify SDK；当前实体耦合需演进。',
  L2: '适配实现内层端口；不绕过用例决策或跨域读写私有数据。',
  L1: '启动装配注入实现，框架与容器不反向进入领域。部署与恢复目标需真实验证。',
};
const roles: Record<string, string> = { L7: '业务应用团队', L6: '体验与平台团队', L5: '平台接入团队', L4: '应用与内容团队', L3: '对应领域负责人', L2: '数据与集成团队', L1: '运维与平台团队' };
export const features: Feature[] = seeds.flatMap(([id, , , , status, evidenceIds, list]) =>
  list.split('|').map((title, position) => ({
    id: `${id}-f${position + 1}`, moduleId: id, title: title.replace(/\*$/, ''),
    detail: title.endsWith('*') ? '目标扩展：实施与运行验证尚缺；不能由模块已有源码推断此能力已实现。' : '本模块职责内的子能力；具体实现与适用边界见模块证据。',
    implementationStatus: title.endsWith('*') ? 'proposed' : status,
    origin: title.endsWith('*') || status === 'proposed' ? '批准目标蓝图' : '源码核对',
    evidenceIds: title.endsWith('*') ? ['e-plan'] : evidenceIds,
  })));
export const modules: Module[] = seeds.map(([id, layerId, title, responsibility, status, evidenceIds, , boundary]) => ({
  id, layerId, title, responsibility, kind: layerId === 'L7' ? 'application' : layerId ? 'module' : 'governance',
  implementationStatus: status, validationStatus: id === 'governance-delivery' ? 'configured' : 'unverified',
  deploymentStatus: 'target', featureIds: features.filter((item) => item.moduleId === id).map((item) => item.id),
  contractIds: contractMap[id] ?? [], evidenceIds,
  dataIds: dataAssets.filter((item) => item.ownerModuleId === id || item.readers.includes(id) || item.writers.includes(id)).map((item) => item.id),
  deploymentIds: deployments.filter((item) => item.moduleIds.includes(id)).map((item) => item.id),
  boundaries: [boundary ?? layerBoundaries[layerId] ?? '横切规则需要责任人与自动检查，不能由配置存在推断线上有效。'],
  ownerRole: roles[layerId] ?? '平台治理团队',
}));
export const externalNodes = [
  { id: 'actor-visitor', title: '访客浏览器', kind: 'actor' },
  { id: 'actor-operator', title: '运营人员', kind: 'actor' },
  { id: 'actor-ai', title: '开发者与 AI', kind: 'actor' },
  { id: 'external-shopify', title: 'Shopify 交易权威', kind: 'external' },
  { id: 'external-enterprise', title: 'CRM / ERP / 仓储 / 财务', kind: 'external' },
  { id: 'external-identity', title: '消费者身份提供方', kind: 'external' },
];
export const scenarios: Scenario[] = [
  { id: 'visit', title: '访客访问', description: '静态内容走 CDN；动态商品和购物车调用区域 API 与 Shopify。' },
  { id: 'edit', title: '编辑与预览', description: '管理入口编辑内容；Java 代理到 Node Preview，复用 Runtime/Theme。' },
  { id: 'publish', title: '内容发布', description: '现状先标记 LIVE 再写产物；目标固定版本、构建校验、条件激活、CDN 确认。' },
  { id: 'account', title: '消费者账户', description: '消费者身份、会员权益与订单适配为候选；不借用 Atlas 管理账户。' },
  { id: 'events', title: '外部事件与分析', description: '验签、去重、区域处理与聚合共享；队列和分析投影为候选。' },
  { id: 'delivery', title: '组件与 AI 交付', description: '源码生成 CEM/清单/API 文档；包制品进入应用构建，不是线上后端调用。' },
];
type RelationSeed = [string, string, RelationKind, string, string, Perspective, string[]?];
const relationSeeds: RelationSeed[] = [
  ['app-campaign', 'experience-compositions', 'code', '活动与表单展示模式', 'delivery', 'target'],
  ['app-support', 'experience-client', 'code', '帮助查询与工单客户端', 'account', 'target'],
  ['app-member', 'experience-client', 'code', '消费者公开客户端', 'account', 'target'],
  ['app-operations', 'experience-admin', 'code', '运营应用装配管理 UI', 'edit', 'target'],
  ['experience-runtime', 'experience-client', 'code', '通过客户端端口读公开数据', 'visit', 'target'],
  ['experience-client', 'access-public', 'call', '公开协议与站点上下文', 'visit', 'target'],
  ['access-edge', 'domain-sites', 'call', '查询可信站点注册与 homeRegion', 'visit', 'target'],
  ['access-public', 'usecase-commerce', 'code', '公开接入依赖交易用例', 'visit', 'target'],
  ['access-internal', 'usecase-jobs', 'call', '内部任务身份与超时契约', 'publish', 'target'],
  ['usecase-marketing', 'domain-engagement', 'code', '活动线索与同意规则', 'events', 'target'],
  ['usecase-customer', 'domain-member', 'code', '消费者资料与权益规则', 'account', 'target'],
  ['usecase-jobs', 'domain-release', 'code', '任务使用 release 状态与端口', 'publish', 'target'],
  ['adapter-search', 'domain-content', 'code', '实现公开内容索引投影端口', 'visit', 'target'],
  ['adapter-object', 'infra-storage', 'call', '执行区域 S3 产物存储', 'publish', 'target'],
  ['adapter-messaging', 'infra-storage', 'call', '托管队列与死信资源', 'publish', 'target'],
  ['infra-operations', 'infra-compute', 'governance', '环境配置、健康检查与恢复', 'publish', 'target'],
  ['app-campaign', 'access-public', 'call', '公开营销接入', 'events', 'target'],
  ['access-public', 'usecase-marketing', 'call', '活动与线索命令', 'events', 'target'],
  ['app-support', 'access-public', 'call', '公开帮助与工单接入', 'account', 'target'],
  ['actor-visitor', 'infra-network', 'call', '访问公开 CDN', 'visit', 'target'],
  ['infra-network', 'adapter-object', 'call', '读取已发布静态产物', 'visit', 'target'],
  ['app-storefront', 'access-public', 'call', '商品与购物车', 'visit', 'current', ['e-api', 'e-ui']],
  ['access-public', 'usecase-commerce', 'call', '交易用例', 'visit', 'current', ['e-api']],
  ['usecase-commerce', 'adapter-external', 'call', '调用 Shopify 适配', 'visit', 'current', ['e-api']],
  ['adapter-external', 'external-shopify', 'call', '商品 / 购物车 / checkout', 'visit', 'current', ['e-api']],
  ['actor-operator', 'experience-admin', 'call', '编辑页面', 'edit', 'current', ['e-ui']],
  ['experience-admin', 'access-admin', 'call', '管理请求', 'edit', 'current', ['e-ui', 'e-api']],
  ['access-admin', 'usecase-content', 'call', '内容操作', 'edit', 'current', ['e-api']],
  ['usecase-content', 'adapter-relational', 'call', '当前 Service → Repository', 'edit', 'current', ['e-db']],
  ['adapter-relational', 'infra-database', 'call', '区域 PostgreSQL', 'edit', 'current', ['e-db']],
  ['access-admin', 'usecase-publish', 'call', 'Java 预览代理 → Node Preview', 'edit', 'current', ['e-preview']],
  ['usecase-publish', 'experience-runtime', 'call', '预览 Runtime / Theme', 'edit', 'current', ['e-preview', 'e-ui']],
  ['experience-runtime', 'access-public', 'call', '按需读取内容与商品', 'edit', 'target'],
  ['experience-admin', 'usecase-publish', 'call', '提交发布', 'publish', 'current', ['e-worker', 'e-ui']],
  ['usecase-publish', 'domain-release', 'call', '先标记内容 LIVE', 'publish', 'current', ['e-worker', 'e-publish']],
  ['usecase-publish', 'experience-runtime', 'call', '随后渲染页面', 'publish', 'current', ['e-worker']],
  ['experience-runtime', 'adapter-object', 'artifact', 'writeFile 本地 dist/{site}', 'publish', 'current', ['e-worker']],
  ['experience-admin', 'usecase-publish', 'call', '提交固定四版本 + 幂等键', 'publish', 'target'],
  ['usecase-publish', 'domain-content', 'call', '读取固定内容版本', 'publish', 'target'],
  ['usecase-publish', 'domain-release', 'call', '创建 release / 校验后条件激活', 'publish', 'target'],
  ['usecase-publish', 'adapter-messaging', 'event', 'ReleaseRequested / Outbox', 'publish', 'target'],
  ['adapter-messaging', 'usecase-jobs', 'event', '至少一次 / 幂等 Worker', 'publish', 'target'],
  ['usecase-jobs', 'experience-runtime', 'call', '固定 Runtime 与 Theme 构建', 'publish', 'target'],
  ['experience-runtime', 'adapter-object', 'artifact', '不可变产物 + 清单校验', 'publish', 'target'],
  ['adapter-object', 'domain-release', 'event', '产物就绪 / 比较并交换', 'publish', 'target'],
  ['domain-release', 'infra-network', 'event', '激活路由 / CDN 确认', 'publish', 'target'],
  ['app-member', 'external-identity', 'call', '消费者登录（候选）', 'account', 'target'],
  ['app-member', 'access-public', 'call', '客户 API（候选）', 'account', 'target'],
  ['access-public', 'usecase-customer', 'call', '会员与订单查询', 'account', 'target'],
  ['usecase-customer', 'domain-member', 'call', '资料与权益规则', 'account', 'target'],
  ['usecase-customer', 'adapter-external', 'call', '订单查询适配', 'account', 'target'],
  ['external-shopify', 'access-events', 'event', 'Webhook 事件', 'events', 'target'],
  ['external-enterprise', 'access-events', 'event', '企业系统事件', 'events', 'target'],
  ['access-events', 'adapter-messaging', 'event', '验签 / 持久接收 / 去重', 'events', 'target'],
  ['adapter-messaging', 'domain-engagement', 'event', '区域领域处理', 'events', 'target'],
  ['adapter-messaging', 'adapter-analytics', 'event', '区域分析投影', 'events', 'target'],
  ['adapter-analytics', 'app-operations', 'artifact', '允许共享的聚合报表', 'events', 'target'],
  ['experience-zds', 'governance-delivery', 'artifact', '源码 → CEM / 清单 / API', 'delivery', 'current', ['e-ci', 'e-zds']],
  ['governance-delivery', 'actor-ai', 'artifact', '组件文档与 llms.txt', 'delivery', 'current', ['e-ci']],
  ['governance-delivery', 'experience-zds', 'artifact', '检查 → 版本化包制品', 'delivery', 'current', ['e-ci']],
  ['experience-zds', 'app-brand', 'artifact', '包 → 应用构建 → 部署（目标接入）', 'delivery', 'target'],
  ['app-storefront', 'experience-runtime', 'code', 'Web 复用 Runtime', 'visit', 'current', ['e-ui']],
  ['experience-admin', 'experience-client', 'code', 'Admin/Builder 依赖客户端', 'edit', 'current', ['e-ui']],
  ['usecase-publish', 'experience-runtime', 'code', '当前跨包相对源码导入', 'publish', 'current', ['e-worker', 'e-ui']],
  ['usecase-content', 'adapter-relational', 'code', '当前 Service 直接依赖 Repository', 'edit', 'current', ['e-db']],
  ['app-brand', 'experience-zds', 'code', '允许应用直接用 ZDS', 'delivery', 'target'],
  ['experience-compositions', 'experience-zds', 'code', '稳定组合依赖基础库', 'delivery', 'target'],
  ['experience-admin', 'experience-client', 'code', '客户端 / 公开 Schema', 'edit', 'target'],
  ['app-storefront', 'experience-runtime', 'code', 'Runtime / Schema / Theme', 'visit', 'target'],
  ['access-admin', 'usecase-content', 'code', '接入依赖用例', 'edit', 'target'],
  ['usecase-content', 'domain-content', 'code', '用例依赖领域与端口', 'edit', 'target'],
  ['adapter-relational', 'domain-content', 'code', '适配实现内层 Repository 端口', 'edit', 'target'],
  ['adapter-object', 'domain-release', 'code', '适配实现发布存储端口', 'publish', 'target'],
  ['adapter-external', 'domain-commerce', 'code', '外部 SDK 留在适配层', 'visit', 'target'],
  ['infra-compute', 'usecase-content', 'code', '启动装配内层与适配', 'edit', 'target'],
  ['governance-security', 'access-admin', 'governance', '组织站点授权', 'edit', 'target'],
  ['governance-data', 'domain-sites', 'governance', '区域驻留与所有权', 'events', 'target'],
  ['governance-reliability', 'usecase-publish', 'governance', '版本产物一致性告警', 'publish', 'target'],
];
const targetContinuity: RelationSeed[] = relationSeeds.filter(([, , kind, , scenario, perspective]) =>
  perspective === 'current' && kind !== 'code' && ['visit', 'edit', 'delivery'].includes(scenario))
  .map(([from, to, kind, label, scenario, , evidenceIds]) =>
    [from, to, kind, label.replace('当前 Service → Repository', '用例端口 → 区域存储适配'), scenario, 'target', [...(evidenceIds ?? []), 'e-plan']]);
export const relations: Relation[] = [...relationSeeds, ...targetContinuity].map(([from, to, kind, label, scenario, perspective, evidenceIds], i) => ({
  id: `r-${i + 1}`, from, to, kind, label, scenarioIds: from === 'adapter-external' && to === 'external-shopify' && perspective === 'target' ? [scenario, 'account'] : [scenario], perspective,
  evidenceIds: evidenceIds ?? ['e-plan'],
}));

export const dependencyRules = [
  ['应用 UI', '体验组件、客户端、公开 DTO/Schema', '数据库驱动、管理密钥、其他应用内部实现'],
  ['ZDS', '令牌、通用工具、基础运行依赖', 'Atlas、会员、Shopify 或业务页面'],
  ['业务组合', 'ZDS 与稳定展示契约', '直接读后端库、让 ZDS 反向依赖组合'],
  ['Admin / Builder', '客户端、Schema、管理 UI', 'Storefront Renderer/Theme、iframe 绕过权限'],
  ['Preview / Publisher / Web', 'Runtime、Schema、Theme、客户端端口', 'Builder/Admin 内部代码'],
  ['API 接入', '用例与输入输出契约', '领域依赖 Controller、公开 DTO 充当持久实体'],
  ['应用用例', '领域、Repository/集成端口、事件契约', '具体云 SDK、跨领域表'],
  ['领域', '自身模型规则、必要纯类型', 'HTTP、Controller、ORM、AWS/Shopify SDK、他域 Repository'],
  ['技术适配', '内层声明的端口与外部 SDK', '跨域私有结构、绕过用例的决策'],
  ['启动装配', '用例、适配与运行配置', '容器与框架反向进入领域'],
];
export const validationItems: ValidationItem[] = [
  { id: 'v-boundaries', title: '边界与契约', status: '设计已有 / 源码可查', detail: '应用、领域、外部权威与目标契约已列；接口兼容与消费者契约测试尚缺。', evidenceIds: ['e-plan', 'e-api'] },
  { id: 'v-isolation', title: '数据与隔离', status: '源码可查 / 尚缺', detail: 'site 字段和 PostgreSQL 配置存在；组织品牌、授权隔离与区域驻留未验证。连接池不能仅靠会话变量隔离。', evidenceIds: ['e-api', 'e-db'] },
  { id: 'v-dependency', title: '依赖门禁', status: '源码可查 / 尚缺', detail: 'ZDS 门禁已配置；Atlas 的实体/ORM 耦合与跨包相对路径仍在，目标端口分离未完成。', evidenceIds: ['e-ci', 'e-db', 'e-ui'] },
  { id: 'v-recovery', title: '容量与恢复', status: '设计已有 / 线上待核实', detail: '容量、恢复及多 AZ 文档是草稿；压测、PITR、发布回滚和跨区灾备演练尚缺。', evidenceIds: ['e-scale'] },
  { id: 'v-runtime', title: '线上可观测性', status: '线上待核实', detail: '真实拓扑、日志指标 Trace/RUM、错误预算、告警值班及供应商状态未核实，不给总体成熟度分数。', evidenceIds: ['e-plan', 'e-scale'] },
];
export const architectureGaps: ArchitectureGap[] = [
  { id: 'g-publish', title: '可靠发布与回滚', current: '先 LIVE 后本地产物；回滚只切内容指针并清草稿。注释与 README 存在旧语义。', target: '固定四版本 → 幂等构建 → 不可变产物校验 → 条件激活 → CDN 确认；失败保留旧版本，回滚完整 release。', ownerRole: '内容与运维团队', evidenceIds: ['e-worker', 'e-publish'] },
  { id: 'g-region', title: '组织站点与区域边界', current: '主要 site code；存在站点字段不等于多租户与集团权限隔离。', target: '组织→品牌→站点；可信 Host 与身份解析 homeRegion，区域写入；灾备不擅自跨区复制个人数据。', ownerRole: '平台与身份团队', evidenceIds: ['e-api', 'e-plan'] },
  { id: 'g-ports', title: '端口与稳定包依赖', current: 'Service 直接依赖 Repository，domain 使用持久实体；Runtime 存在跨包相对导入。', target: '内层声明端口、适配实现；公共包与 Schema/API 兼容门禁，旧 ID/URL 继续可解析。', ownerRole: '平台工程团队', evidenceIds: ['e-db', 'e-ui'] },
  { id: 'g-business', title: '会员、营销与客服', current: '完整会员、活动规则、工单和消费者身份缺少实现依据。', target: '按真实业务和数据所有权实施；ERP/CRM/仓储/财务保持外部边界，交易仍由 Shopify 权威承载。', ownerRole: '业务领域团队', evidenceIds: ['e-api', 'e-plan'] },
  { id: 'g-database', title: '数据库事实与运行验证', current: 'PostgreSQL/Supabase 主配置；README 仍写 H2→MySQL，H2 留作迁移配置。', target: '统一文档与实际拓扑；取容量基线，验证备份、恢复、区域路由与故障边界。', ownerRole: '数据与运维团队', evidenceIds: ['e-db', 'e-scale'] },
];
export const reliabilityTargets = [
  ['公开静态访问', '99.95% 月可用；RUM LCP P75 ≤2.5s', '边缘探测 + RUM；API 故障仍可访问已发布内容'],
  ['自有动态商业 API', '99.9%；不含外部耗时 P95 ≤300ms', '单列 Shopify 耗时与端到端成功率；购物车写不伪成功'],
  ['编辑与管理 API', '99.9%；常规请求 P95 ≤300ms', '区域压测；并发编辑冲突、超时可恢复'],
  ['交互预览', '99.5%；暖实例 P95 ≤1s', '独立资源；失败不影响已发布页面'],
  ['异步发布', '重试后成功率 ≥99.9%；P95 ≤5min', '监控队列年龄、阶段耗时与失败；保持原版本'],
  ['区域数据恢复', 'RPO ≤5min / RTO ≤30min', 'PITR 恢复演练；跨区域灾难另定目标'],
  ['发布回滚', '完整历史产物前提下 ≤10min', '包含路由与 CDN 生效检查'],
];
export const capacityInputs = [
  ['峰值流量 / 访客 QPS', '未取数'], ['CDN 命中 / 动态访问比', '未取数'], ['请求服务时间 / 数据库连接', '未取数'],
  ['站点总数 / 对象量 / 存储增长', '未取数'], ['任务到达率 / 构建耗时 / 排队等待', '未取数'],
  ['初始压测场景（Scale 草稿）', '500 编辑并发 · 单站最多 10000 页 · 10 站点同时构建 · 内容页约 500KB 上限，均待确认'],
];
