import './style.css';

// --- 站点骨架 ---
const renderSiteHeaderSlot = () => `<div data-site-header data-app="portal"></div>`;
const renderFooter = () => `<div data-site-footer></div>`;

// --- 1. AI 生成流水线 ---
interface FlowNode {
  step: string;
  title: string;
  desc: string;
  actor: '人' | 'AI' | 'CI';
  accent: string;
}

const flow: FlowNode[] = [
  {
    step: '01',
    title: '需求',
    desc: '页面要解决什么、给谁用、什么语气。',
    actor: '人',
    accent: 'bg-gray-800'
  },
  {
    step: '02',
    title: '读规范',
    desc: 'llms.txt + llms-full.txt 进上下文：组件、属性、图标名、验收清单。',
    actor: 'AI',
    accent: 'bg-orange-500'
  },
  {
    step: '03',
    title: '生成页面',
    desc: '只用 zone-* 组件和 --zone-* 令牌，不发明颜色、间距、图标。',
    actor: 'AI',
    accent: 'bg-orange-500'
  },
  {
    step: '04',
    title: '验收自查',
    desc: '六条清单逐项过：令牌化、键盘可达、层级、响应式、主题适配。',
    actor: '人',
    accent: 'bg-gray-800'
  },
  {
    step: '05',
    title: '七关 CI',
    desc: '类型、测试、令牌、API 契约、文档漂移、渲染冒烟、视觉 diff。',
    actor: 'CI',
    accent: 'bg-emerald-600'
  },
  {
    step: '06',
    title: '上线',
    desc: 'PR 合入即部署；组件改动走 tag → OIDC 自动发版。',
    actor: 'CI',
    accent: 'bg-emerald-600'
  }
];

const actorClass = (actor: FlowNode['actor']) =>
  actor === '人'
    ? 'bg-gray-100 text-gray-600'
    : actor === 'AI'
      ? 'bg-orange-100 text-orange-600'
      : 'bg-emerald-100 text-emerald-700';

const renderFlow = () => `
  <section class="w-full mb-14 md:mb-20">
    <div class="mb-6 md:mb-8">
      <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">GENERATION PIPELINE</p>
      <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">页面是怎么被生产出来的</h2>
      <p class="text-gray-500 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
        AI 接管了"写"这个环节，但标准、验收和发布仍然在人手里。人的介入点只有三个：定需求、收敛验收、异常决策。
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      ${flow
        .map(
          (n) => `
        <div class="tech-card p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg ${n.accent} text-white text-[11px] font-bold flex items-center justify-center">${n.step}</span>
              <p class="font-bold text-gray-900">${n.title}</p>
            </div>
            <span class="text-[11px] font-bold rounded-full px-2 py-0.5 ${actorClass(n.actor)}">${n.actor}</span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">${n.desc}</p>
        </div>`
        )
        .join('')}
    </div>

    <div class="mt-4 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-xs md:text-sm text-gray-600 leading-relaxed">
      <span class="font-bold text-orange-600">为什么不会失控：</span>模型没有"记忆自由"，它只能在
      <code class="font-mono text-gray-800">llms.txt</code> 给出的词汇表里选——组件名、属性名、令牌名、图标名全部有白名单，
      编造即报错。
    </div>
  </section>
`;

// --- 2. 分层 ---
interface Layer {
  level: string;
  name: string;
  pkg: string;
  items: string;
  note: string;
  tone: string;
}

const layers: Layer[] = [
  {
    level: 'L4',
    name: '业务页面',
    pkg: 'ZBC 薄层',
    items: 'ZA/页面 · 活动页 · 后台',
    note: 'AI 现场生成或复用；同一模式出现 ≥3 处才沉淀为新组件',
    tone: 'border-gray-200 bg-white/70'
  },
  {
    level: 'L3',
    name: '规范与验证',
    pkg: 'docs · ci',
    items: 'llms.txt · ai-usage 验收清单 · Storybook · 七关 CI',
    note: '机器可读的规范 + 自动化验证，是 AI 生成质量的唯一约束',
    tone: 'border-orange-200 bg-orange-50/50'
  },
  {
    level: 'L2',
    name: '组件层',
    pkg: '@aiyazone/core',
    items: '10 个 Lit Web Components · shadow DOM · 框架无关',
    note: '只消费令牌，不写死颜色；对外暴露属性与事件，不暴露内部结构',
    tone: 'border-gray-200 bg-white/70'
  },
  {
    level: 'L1',
    name: '令牌层',
    pkg: '@aiyazone/tokens',
    items: '179 个 --zone-* 变量：颜色 / 字号 / 间距 / 圆角 / 层级 / 动效',
    note: '唯一事实来源；三套主题（v1/v2/v3）只切换变量，不改页面',
    tone: 'border-gray-200 bg-white/70'
  }
];

const rules = [
  '页面只能使用「组件 + 令牌」，不得用 div 模拟按钮、弹窗、下拉',
  '禁止覆盖 shadow DOM 内部类名，定制只走公开属性或 --zone-* 变量',
  '页面不直读 tokens.json，不跨层引用组件内部实现',
  '图标名必须来自 113 个官方清单（llms.txt 可查），禁止编造'
];

const renderLayers = () => `
  <section class="w-full mb-14 md:mb-20">
    <div class="mb-6 md:mb-8">
      <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">LAYERS</p>
      <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">四层结构，依赖单向向下</h2>
      <p class="text-gray-500 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
        上层只能依赖下层。越往下越稳定、变更越慢；越往上越灵活、由 AI 快速生成。
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
      <div class="lg:col-span-2 space-y-3">
        ${layers
          .map(
            (l) => `
          <div class="rounded-xl border ${l.tone} p-4 md:p-5 backdrop-blur-sm">
            <div class="flex flex-wrap items-center gap-2 md:gap-3">
              <span class="text-[11px] font-bold text-gray-400 tracking-widest">${l.level}</span>
              <p class="font-bold text-gray-900">${l.name}</p>
              <code class="text-[11px] font-mono text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">${l.pkg}</code>
            </div>
            <p class="text-sm text-gray-600 mt-2">${l.items}</p>
            <p class="text-xs text-gray-400 mt-1.5">${l.note}</p>
          </div>`
          )
          .join('')}
      </div>

      <div class="tech-card p-5 md:p-6">
        <p class="text-sm font-bold text-gray-900 mb-4">四条硬规则</p>
        <ul class="space-y-3">
          ${rules
            .map(
              (r) => `<li class="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
              <span class="shrink-0 mt-0.5 text-orange-500">▪</span>
              <span>${r}</span>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    </div>
  </section>
`;

// --- 3. 七关门禁 ---
const gates: Array<{ name: string; guard: string; fail: string }> = [
  { name: 'TypeScript', guard: '全量类型检查', fail: '类型不安全，AI 生成的代码无法收口' },
  { name: 'Test', guard: '单元 + 交互测试 294 项', fail: '交互回归（焦点、键盘、事件）' },
  { name: 'Tokens', guard: '令牌锁 + 硬编码扫描', fail: '出现魔法色值 / 像素间距' },
  { name: 'API 契约', guard: '属性快照 + 图标资产守卫', fail: '组件 API 被悄悄改坏' },
  { name: 'Docs', guard: 'AI 文档与源码一致性校验', fail: '文档漂移（AI 会照错文档写代码）' },
  { name: 'Storybook', guard: '79 stories 渲染冒烟', fail: '组件在真实渲染中崩坏' },
  { name: 'Visual', guard: 'Chromatic 像素级 diff', fail: '无意的视觉变更未评审' }
];

const renderGates = () => `
  <section class="w-full mb-14 md:mb-20">
    <div class="mb-6 md:mb-8">
      <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">QUALITY GATES</p>
      <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">七道门禁各自守什么</h2>
      <p class="text-gray-500 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
        全部在 PR 上自动执行，不过则无法合入 master。人不需要逐行审 AI 的代码，只需要看门禁是否变红。
      </p>
    </div>
    <div class="tech-card overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50/80 text-xs text-gray-400">
          <tr>
            <th class="px-4 py-3 font-bold">门禁</th>
            <th class="px-4 py-3 font-bold">守什么</th>
            <th class="px-4 py-3 font-bold hidden md:table-cell">如果它变红</th>
          </tr>
        </thead>
        <tbody>
          ${gates
            .map(
              (g) => `<tr class="border-t border-gray-100">
              <td class="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">${g.name}</td>
              <td class="px-4 py-3 text-gray-600">${g.guard}</td>
              <td class="px-4 py-3 text-gray-400 hidden md:table-cell">${g.fail}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  </section>
`;

// --- 4. 发布链路 ---
const releaseSteps = [
  { k: 'bump', v: '升版本号（package.json）' },
  { k: 'docs:gen', v: '重新生成 API 文档与 llms 入口（版本号嵌入）' },
  { k: 'PR', v: '七关 CI 全绿后合入 master' },
  { k: 'tag v*', v: '打标签触发 Release workflow' },
  { k: 'OIDC', v: 'GitHub Actions 凭临时凭证发布 npm，仓库零 token' },
  { k: 'deploy', v: 'Vercel 自动部署站点与文档' }
];

const renderRelease = () => `
  <section class="w-full mb-14 md:mb-20">
    <div class="mb-6">
      <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">RELEASE</p>
      <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">发布链路</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      ${releaseSteps
        .map(
          (s, i) => `
        <div class="tech-card p-4 flex gap-3">
          <span class="text-[11px] font-mono font-bold text-orange-500 mt-0.5">${String(i + 1).padStart(2, '0')}</span>
          <div class="min-w-0">
            <code class="text-xs font-mono font-bold text-gray-900">${s.k}</code>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">${s.v}</p>
          </div>
        </div>`
        )
        .join('')}
    </div>
  </section>
`;

// --- 5. 不做什么 ---
const notDoing = [
  {
    t: '不预制业务组件',
    d: 'ZBC 准入只有一条：同一模式在 ≥3 个真实场景出现。凑不够数量就由 AI 现场生成，不提前造轮子。'
  },
  {
    t: '不追组件数量',
    d: '不和通用组件库比 SKU。10 个组件覆盖 80% 页面，缺的按需补，宁可少而稳。'
  },
  {
    t: '不让文档手写',
    d: 'API 文档、llms.txt、图标清单全部从源码与资产生成，漂移由 CI 拦截。'
  },
  {
    t: '不存长期发布凭证',
    d: 'npm 发布走 OIDC 临时凭证；任何 token 都不进仓库、不进代码。'
  }
];

const renderNotDoing = () => `
  <section class="w-full mb-4 md:mb-8">
    <div class="mb-6">
      <p class="text-xs font-bold text-orange-500 tracking-widest mb-2">NON-GOALS</p>
      <h2 class="text-xl md:text-3xl font-extrabold text-gray-900">明确不做什么</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      ${notDoing
        .map(
          (n) => `
        <div class="tech-card p-5">
          <p class="font-bold text-gray-900 text-sm md:text-base">${n.t}</p>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">${n.d}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>
`;

// --- Hero ---
const renderHero = () => `
  <section class="mb-12 md:mb-16 relative">
    <div class="absolute -top-16 -left-16 w-72 h-72 bg-orange-100 rounded-full blur-[70px] pointer-events-none opacity-60"></div>
    <p class="relative z-10 text-xs font-bold text-orange-500 tracking-widest mb-4">ARCHITECTURE · ZDS</p>
    <h1 class="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight max-w-3xl">
      架构与治理：<span class="text-highlight">约束在前，生成在后</span>
    </h1>
    <p class="relative z-10 text-gray-500 text-base md:text-lg font-light leading-relaxed mt-5 max-w-3xl">
      ZDS 的架构目标只有一个——让「人写的页面」和「AI 生成的页面」共用同一套零件、走同一道验收，
      从而在不牺牲一致性的前提下，把页面生产效率提到 AI 的水平。
    </p>
  </section>
`;

// --- 渲染 ---
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
    ${renderHero()}
    ${renderFlow()}
    ${renderLayers()}
    ${renderGates()}
    ${renderRelease()}
    ${renderNotDoing()}
  </main>
  ${renderFooter()}
`;
