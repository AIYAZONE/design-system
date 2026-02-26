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
    { label: '工程治理', tooltip: 'Engineering Maturity', value: 15 },
    { label: '交付效率', tooltip: 'Delivery Efficiency', value: 12 },
    { label: '性能水平', tooltip: 'Performance Level', value: 8 },
  ],
} as const;

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
