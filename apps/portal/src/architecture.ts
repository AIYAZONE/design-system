import './style.css';
import { renderPanorama, setupPanorama } from './panorama';

// --- 站点骨架 ---
const renderSiteHeaderSlot = () => `<div data-site-header data-app="portal"></div>`;
const renderFooter = () => `<div data-site-footer></div>`;

// --- Hero ---
const renderHero = () => `
  <section class="pt-6 pb-10 md:pt-10 md:pb-14">
    <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">架构与治理</h1>
    <p class="text-gray-600 text-base leading-relaxed mt-4 max-w-2xl">
      全景图说明这套体系由哪些部分组成、各层如何依赖；生成流水线说明页面今天是如何被生产出来的。
    </p>
  </section>
`;

// --- AI 生成流水线 ---
interface FlowNode {
  step: string;
  title: string;
  desc: string;
  actor: '人' | 'AI' | 'CI';
}

const flow: FlowNode[] = [
  { step: '01', title: '需求', desc: '页面要解决什么、给谁用。', actor: '人' },
  {
    step: '02',
    title: '读规范',
    desc: 'llms.txt / llms-full.txt 进上下文：组件、属性、图标名、验收清单。',
    actor: 'AI'
  },
  {
    step: '03',
    title: '生成页面',
    desc: '只用 zone-* 组件与 --zone-* 令牌，不发明颜色、间距、图标。',
    actor: 'AI'
  },
  {
    step: '04',
    title: '验收',
    desc: '六条清单逐项过：令牌化、键盘可达、层级、响应式、主题适配。',
    actor: '人'
  },
  { step: '05', title: 'CI 门禁', desc: '七道门禁自动执行，不过则无法合并。', actor: 'CI' },
  { step: '06', title: '上线', desc: 'PR 合入即部署；组件改动走 tag 触发 OIDC 发版。', actor: 'CI' }
];

const actorClass = (actor: FlowNode['actor']) =>
  actor === '人'
    ? 'bg-gray-100 text-gray-600'
    : actor === 'AI'
      ? 'bg-orange-50 text-orange-600'
      : 'bg-emerald-50 text-emerald-700';

const renderFlow = () => `
  <section class="pt-8 md:pt-10 pb-10 md:pb-14 border-t border-gray-200">
    <h2 class="text-lg md:text-xl font-bold text-gray-900">AI 生成流水线</h2>
    <p class="text-sm text-gray-500 mt-2 mb-6 max-w-2xl leading-relaxed">
      AI 接管了「写」这个环节，标准、验收与发布仍由人与 CI 把住。人的介入点只有三个：定需求、收敛验收、异常决策。
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
      ${flow
        .map(
          (n) => `
        <div class="bg-white p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-xs text-gray-400">${n.step}</span>
            <span class="text-[11px] font-bold rounded px-1.5 py-0.5 ${actorClass(n.actor)}">${n.actor}</span>
          </div>
          <p class="font-bold text-gray-900 text-sm">${n.title}</p>
          <p class="text-gray-500 text-sm leading-relaxed mt-1.5">${n.desc}</p>
        </div>`
        )
        .join('')}
    </div>
    <p class="text-xs text-gray-400 mt-4 leading-relaxed">
      模型只能在 llms.txt 给出的词汇表内选择——组件名、属性名、令牌名、图标名均有白名单，编造即报错。
    </p>
  </section>
`;

// --- 不做什么 ---
const notDoing = [
  {
    t: '不预制业务组件',
    d: '同一模式在 ≥3 个真实场景出现才立项（ZBC），凑不够由 AI 现场生成。'
  },
  { t: '不追组件数量', d: '10 个组件覆盖大部分页面，缺的按需补，宁可少而稳。' },
  { t: '不让文档手写', d: 'API 文档、llms.txt、图标清单全部从源码生成，漂移由 CI 拦截。' },
  { t: '不存长期发布凭证', d: 'npm 发布走 OIDC 临时凭证，仓库内不存任何 token。' }
];

const renderNotDoing = () => `
  <section class="pt-8 md:pt-10 pb-8 border-t border-gray-200">
    <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-5">明确不做什么</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
      ${notDoing
        .map(
          (n) => `
        <div>
          <p class="font-bold text-gray-900 text-sm">${n.t}</p>
          <p class="text-sm text-gray-500 mt-1 leading-relaxed">${n.d}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>
`;

// --- 渲染：纵向顺序（全景图 → 流水线 → Non-goals），无 Tab ---
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  ${renderSiteHeaderSlot()}
  <main class="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6">
    ${renderHero()}
    <section class="pb-4">
      ${renderPanorama()}
    </section>
    ${renderFlow()}
    ${renderNotDoing()}
  </main>
  ${renderFooter()}
`;

setupPanorama();
