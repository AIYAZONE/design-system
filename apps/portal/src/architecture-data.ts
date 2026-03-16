declare const __JDS_VERSION__: string | undefined;
declare const __JBC_VERSION__: string | undefined;

export const archMeta = {
  liveMapVersion: '1.0',
  blueprintYear: String(new Date().getFullYear()),
  jdsVersion: __JDS_VERSION__ ?? 'unknown',
  jbcVersion: __JBC_VERSION__ ?? 'unknown',
} as const;

export const maturity = {
  lastUpdated: '2026-02-26',
  current: {
    level: 0.5,
    maxLevel: 5,
    label: 'Level 0.5',
    subtitle: '起步阶段（混乱、未统一）',
    nextStepDesc: '基建薄弱，流程与标准未统一；JDS 仍在建设中，JBC 复用资产较少，需要先把“入口与门禁”收敛成主路径。',
  },
  target: {
    label: 'Level 1',
    tooltipDesc: '先达到工具化（Level 1）：统一入口、最小门禁与基础文档',
  },
  bars: [
    { label: '工程治理', tooltip: '分支保护 / MR 门禁 / 规范化发布 / 依赖分层门禁 / 变更可追溯', value: 15 },
    { label: '组件资产化', tooltip: 'JDS tokens 统一 / 基础组件可复用 / JBC 领域组件沉淀 / 跨站复用率', value: 10 },
    { label: '运行体系', tooltip: '灰度发布 / 快速回滚 / 告警与 SLA / 事故复盘与演练 / 容量与弹性', value: 8 },
    { label: '性能与数据闭环', tooltip: 'CWV 指标 / 错误监控 / 链路分段 / 转化漏斗 / 归因与 A/B', value: 6 },
    { label: '营销交付能力', tooltip: '落地页工程化 / 模板化生产 / 多语言与多区域 / 实验配置 / 发布效率', value: 12 },
  ],
} as const;

export interface ArchNode {
  id: string;
  label: string;
  type: 'container' | 'component' | 'actor' | 'system';
  layer: 'client' | 'edge' | 'app' | 'orchestration' | 'domain' | 'infra';
  desc?: string;
  tags?: string[];
  links?: { target: string; label?: string; type?: 'flow' | 'dependency' }[];
}

export const archNodes: ArchNode[] = [
  // Client Layer
  { id: 'user', label: '用户设备', type: 'actor', layer: 'client', desc: '浏览器 / 移动端' },
  
  // Edge Layer
  { id: 'cdn', label: '全球 CDN', type: 'system', layer: 'edge', desc: 'AWS CloudFront 加速' },
  
  // App Layer
  { id: 'shopify', label: 'Shopify 商城', type: 'container', layer: 'app', desc: 'Liquid 模板 + Islands' },
  { id: 'aem', label: 'AEM 品牌站', type: 'container', layer: 'app', desc: '内容片段渲染' },
  { id: 'lp', label: '营销落地页', type: 'container', layer: 'app', desc: '独立 SPA 应用' },

  // Orchestration Layer (Atlas)
  { id: 'atlas', label: 'Atlas 内容中台', type: 'container', layer: 'orchestration', desc: 'Schema 定义与内容录入', tags: ['数据源'] },
  { id: 'schema-api', label: 'Schema API', type: 'component', layer: 'orchestration', desc: 'JSON 数据分发' },
  { id: 'renderer', label: '渲染核心', type: 'component', layer: 'orchestration', desc: 'Schema 解析与注册表' },

  // Domain Layer
  { id: 'jbc', label: 'JBC 业务组件', type: 'container', layer: 'domain', desc: '交易 / 营销能力包' },
  { id: 'jds', label: 'JDS 设计系统', type: 'container', layer: 'domain', desc: '基础 UI 与设计令牌' },

  // Infra Layer
  { id: 'npm', label: 'NPM 制品库', type: 'system', layer: 'infra', desc: '版本化私有包管理' },
  { id: 'obs', label: '可观测性平台', type: 'system', layer: 'infra', desc: 'Sentry / NewRelic 监控' },
];

export const archFlows = [
  { from: 'user', to: 'cdn', label: '访问' },
  { from: 'cdn', to: 'shopify', label: '路由' },
  { from: 'cdn', to: 'aem', label: '路由' },
  { from: 'cdn', to: 'lp', label: '路由' },
  
  { from: 'shopify', to: 'renderer', label: '注水' },
  { from: 'lp', to: 'renderer', label: '渲染' },
  
  { from: 'atlas', to: 'schema-api', label: '发布' },
  { from: 'schema-api', to: 'renderer', label: '获取 JSON' },
  
  { from: 'renderer', to: 'jbc', label: '映射' },
  { from: 'renderer', to: 'jds', label: '引用' },
  
  { from: 'npm', to: 'jbc', label: '安装' },
  { from: 'npm', to: 'jds', label: '安装' },
];

export const selfAssessment = {
  lastUpdated: maturity.lastUpdated,
  items: [
    {
      category: '盘点（0.5）',
      criterion: '已有基础设施可用（GitLab/Jenkins/AWS CDN）',
      status: 'done',
      evidence: 'GitLab|http://192.168.30.241/, Jenkins1|http://192.168.30.90:8080/,Jenkins2|http://192.168.20.126:8080/, AWS CDN|https://console.aws.amazon.com/cloudfront/home',
    },
    {
      category: '代码入口（A）',
      criterion: '所有变更通过 MR 合并到主分支',
      status: 'done',
      evidence: 'shopiy-web ADD-FEAT:20260205版本|http://192.168.30.241/global-website/shopify-web/merge_requests/5823',
    },
    {
      category: '代码入口（A）',
      criterion: '主分支保护开启（禁止直推）',
      status: 'done',
      evidence: 'shopiy-web|http://192.168.30.241/global-website/shopify-web/settings/repository',
    },
    {
      category: '代码入口（A）',
      criterion: 'MR 模板包含：变更说明/风险/回滚/验证方式（可选：预览链接）',
      status: 'done',
      evidence: 'shopiy-web ADD-FEAT:20260205版本|http://192.168.30.241/global-website/shopify-web/merge_requests/5823',
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
      criterion: '依赖方向明确：Apps → JBC（域）→ JDS',
      status: 'partial',
      evidence: '',
    },
    {
      category: '依赖分层（C）',
      criterion: '禁止 Apps 直依赖 JDS（规则强制）',
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
