declare const __ZONE_VERSION__: string | undefined;

export const archMeta = {
  liveMapVersion: '1.0',
  blueprintYear: String(new Date().getFullYear()),
  zoneVersion: __ZONE_VERSION__ ?? 'unknown',
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
  { id: 'multisite', label: '多端站点', type: 'container', layer: 'app', desc: '主站与转化入口' },
  { id: 'contentsite', label: '内容化站点', type: 'container', layer: 'app', desc: '内容片段渲染' },
  { id: 'lp', label: '营销落地页', type: 'container', layer: 'app', desc: '独立 SPA 应用' },

  // Orchestration Layer (Atlas)
  { id: 'atlas', label: 'Atlas 内容中台', type: 'container', layer: 'orchestration', desc: 'Schema 定义与内容录入', tags: ['数据源'] },
  { id: 'schema-api', label: 'Schema API', type: 'component', layer: 'orchestration', desc: 'JSON 数据分发' },
  { id: 'renderer', label: '渲染核心', type: 'component', layer: 'orchestration', desc: 'Schema 解析与注册表' },

  // Domain Layer
  { id: 'zone', label: 'ZONE 设计系统', type: 'container', layer: 'domain', desc: '基础 UI 与设计令牌' },

  // Infra Layer
  { id: 'npm', label: 'NPM 制品库', type: 'system', layer: 'infra', desc: '版本化包管理' },
  { id: 'obs', label: '可观测性平台', type: 'system', layer: 'infra', desc: 'Sentry / NewRelic 监控' },
];

export const archFlows = [
  { from: 'user', to: 'cdn', label: '访问' },
  { from: 'cdn', to: 'multisite', label: '路由' },
  { from: 'cdn', to: 'contentsite', label: '路由' },
  { from: 'cdn', to: 'lp', label: '路由' },
  
  { from: 'multisite', to: 'renderer', label: '注水' },
  { from: 'lp', to: 'renderer', label: '渲染' },
  
  { from: 'atlas', to: 'schema-api', label: '发布' },
  { from: 'schema-api', to: 'renderer', label: '获取 JSON' },
  
  { from: 'renderer', to: 'zone', label: '引用' },

  { from: 'npm', to: 'zone', label: '安装' },
];

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
    state: '尚未建设',
    title: 'Atlas 内容平台',
    detail: '当前尚未提供内容管理或可视化页面搭建功能。',
  },
  {
    state: '由业务系统负责',
    title: '业务站点监控与发布',
    detail: '业务站点的发布、运行监控和效果统计，由相应业务系统负责。',
  },
] as const;
