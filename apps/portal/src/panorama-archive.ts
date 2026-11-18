// 历史完整模型只供补充资料使用，新主图使用独立的能力组数据。
import {
  archMeta, layers, modules, features, relations, contracts, dataAssets, deployments, evidence,
  externalNodes, scenarios, validationItems, architectureGaps, dependencyRules, reliabilityTargets,
  capacityInputs, statusLabels,
} from './architecture-data';
import type { Module, RelationKind, Perspective } from './architecture-data';

const html = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const views = [
  ['panorama', '分层全景'], ['dependencies', '谁调用谁'], ['data', '数据存在哪'],
  ['deployment', '跑在哪里'], ['validation', '做到哪一步'],
] as const;
type View = typeof views[number][0];
const kindLabels: Record<RelationKind, string> = { code: '代码依赖', call: '同步调用', event: '事件', artifact: '产物交付', governance: '治理' };
const kindHelp: Record<RelationKind, string> = {
  code: '代码里引用了对方', call: '发出请求并等结果', event: '异步通知，不等结果',
  artifact: '文件或安装包', governance: '规则上的约束',
};
const perspectiveLabels: Record<Perspective, string> = { current: '现在怎么做', target: '打算怎么做' };
const statusHelp = '“源码已有”＝代码里能找到；“部分已有”＝只做了一部分；“候选设计”＝还没写代码，只是计划。';
const nodeTitle = (id: string) => modules.find((item) => item.id === id)?.title ?? externalNodes.find((item) => item.id === id)?.title ?? id;
const badge = (module: Module) => `<span class="ap-status ap-status--${module.implementationStatus}">${statusLabels[module.implementationStatus]}</span>`;
const button = (module: Module) => `<button type="button" class="ap-node" data-module="${module.id}" id="node-${module.id}" aria-pressed="false"><strong>${html(module.title)}</strong>${badge(module)}</button>`;
const table = (headers: string[], rows: string[][]) => `<div class="ap-table-wrap"><table class="ap-table"><thead><tr>${headers.map((value) => `<th scope="col">${html(value)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${html(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const lead = (what: string, why: string) => `<div class="ap-lead"><p><b>这是什么</b>${what}</p><p><b>为什么重要</b>${why}</p></div>`;
const evidenceList = (ids: string[]) => `<ul class="ap-evidence">${ids.map((id) => {
  const item = evidence.find((value) => value.id === id)!;
  return `<li><strong>${html(item.path)}</strong><p>${html(item.note)}</p><span>${item.kind} · 核对 ${item.checkedAt}</span>${item.publicHref ? ` · <a href="${item.publicHref}">公开参考</a>` : ''}</li>`;
}).join('')}</ul>`;
const renderMap = () => `
  <div class="ap-map" data-map>
    <svg class="ap-lines" aria-hidden="true" data-lines></svg>
    <div class="ap-layer-stack">
      ${layers.map((layer) => `<section class="ap-layer ap-layer--${layer.id}" aria-label="${layer.id} ${layer.title}">
        <div class="ap-layer-label"><span>${layer.id}</span><div><h3>${layer.title}</h3><p>${layer.question}</p></div></div>
        <div class="ap-layer-nodes" style="--module-count:${modules.filter((item) => item.layerId === layer.id).length}">
          ${modules.filter((item) => item.layerId === layer.id).map(button).join('')}
        </div>
      </section>`).join('')}
    </div>
    <aside class="ap-governance" aria-label="横切治理"><p>每一层都要遵守</p><h3>通用规则</h3>
      ${modules.filter((item) => item.kind === 'governance').map((module) => `<div>${button(module)}<p>${features.filter((item) => item.moduleId === module.id).slice(0, 3).map((item) => html(item.title)).join(' · ')}</p></div>`).join('')}
      <small>这些规则要落到责任人和自动检查，<br>不能因为写了文档就当作已经生效。</small>
    </aside>
  </div>`;

const renderData = () => `<div class="ap-view-heading"><h2>数据存在哪、谁说了算</h2><p>每一类数据都要有唯一的负责人；个人和交易数据放在它所属的地区，全球只共享允许流转的配置和汇总。</p></div>
  ${lead('下表每一行是一类数据，列出「谁有权拍板」「存在哪里」「谁能读、谁能写」「什么时候该清理」。', '这决定了数据会不会存错地方、被不该看的人看到，或者出现两份互相矛盾的“真相”。')}
  ${table(['数据 / 状态', '谁说了算', '存在哪里', '谁能读 / 谁能写', '什么时候清理'], dataAssets.map((asset) => [
    `${asset.title} · ${statusLabels[asset.status]}`, asset.sourceOfTruth, `${asset.store}；${asset.regionPolicy}`,
    `读：${asset.readers.map(nodeTitle).join('、')}；写：${asset.writers.map(nodeTitle).join('、')}`, asset.lifecycle,
  ]))}
  <p class="ap-callout">判断权限靠可信的身份和站点登记表，不能只靠数据库连接里的一个变量。搜索、缓存、报表都是「随时可以重建的副本」，不能当成主数据。</p>`;
const renderDeployment = () => `<div class="ap-view-heading"><h2>东西跑在哪里</h2><p>分成三类：全球与 CDN 边缘、每个地区内部、外部第三方系统。以下都是部署建议，真实生产环境还没核实。</p></div>
  ${lead('每个方块说明一类要部署的东西，列出用什么技术、包含哪些模块、以及“坏了会怎样”。', '逻辑上的一个模块，不等于要单独部署成一个服务；同生共死的功能可以放在一起。')}
  <div class="ap-deployment">${(['global', 'regional', 'external'] as const).map((scope) => `
    <section class="ap-deployment-group"><header><span>${scope === 'global' ? '全球' : scope === 'regional' ? '区域' : '外部'}</span><h3>${scope === 'global' ? '全球与 CDN 边缘' : scope === 'regional' ? '每个数据所属地区' : '外部第三方系统'}</h3></header>
      ${deployments.filter((item) => item.scope === scope).map((item) => `<article><h4>${item.title}</h4><span class="ap-status">${item.status === 'target' ? '部署建议 · 待验证' : '外部部署待核实'}</span><p>${html(item.technology)}</p><p class="ap-small">${item.moduleIds.map(nodeTitle).map(html).join(' · ')}</p><p class="ap-boundary">${html(item.failureBoundary)}</p></article>`).join('')}
    </section>`).join('')}</div>
  <p class="ap-callout">请求按「数据属于哪个地区」来路由。走错地区会返回可重试的提示；某个地区出故障时，不会自动在别的地区凭空创建同一份数据。开发、测试、预发、生产各自隔离；灾备地区、法律依据和保留期要在上线前确认。</p>`;
const renderValidation = () => `<div class="ap-view-heading"><h2>做到哪一步了</h2><p>图分得清楚只是起点。契约、隔离、依赖门禁、容量和恢复，每一项都要单独验证。</p></div>
  ${lead('每一项列出当前状态和对应的依据（源码、配置或文档）。', '没有运行证据的能力，这里一律标成“待核实”，不会写成“已完成”；也不会给出一个笼统的“整体成熟度”分数。')}
  <div class="ap-validation-grid">${validationItems.map((item) => `<article><span>${html(item.status)}</span><h3>${item.title}</h3><p>${html(item.detail)}</p>${evidenceList(item.evidenceIds)}</article>`).join('')}</div>
  <h3>现在和目标的关键差距</h3>${renderGaps()}
  <h3>可靠性建议目标</h3><p class="ap-callout">下面的百分比、P95、RPO、RTO 都是“建议”，不是现在的实际承诺：P95＝95% 的请求在这个时间内完成；RPO＝最多能容忍丢多少数据；RTO＝最多能容忍中断多久。</p>
  ${table(['能力', '建议目标', '怎么验证 / 出问题怎么办'], reliabilityTargets)}
  <h3>容量计算需要的输入</h3><p class="ap-callout">这些数字目前没有可靠来源，因此直接写“未取数”，不编造。</p>${table(['参数', '当前取数'], capacityInputs)}
  <h3>推进顺序与兼容</h3><ol class="ap-steps"><li>先核实数据库、版本语义和真实生产环境到底长什么样。</li><li>补上组织/站点授权、地区数据边界，以及各层之间明确的接口。</li><li>把发布做成可重试、可回滚、保留完整产物的流程。</li><li>按真实负载拆分身份、集成、分析能力，并演练灾备。</li></ol>
  <p>现有的 URL 和 ID 保持能打开；改配置时先同时读新、旧两处、确认一致再切换。Schema、Theme、Runtime 维护兼容矩阵；数据库迁移和边缘切换分步做，不一次全上。</p>`;
const renderGaps = () => `<div class="ap-gaps">${architectureGaps.map((gap) => `<article><h4>${gap.title}</h4><p><b>现在</b> ${html(gap.current)}</p><p><b>目标</b> ${html(gap.target)}</p><small>责任人：${gap.ownerRole}</small></article>`).join('')}</div>`;
export const renderInventory = () => `<details class="ap-inventory"><summary>展开完整清单：${modules.length} 个模块、${features.length} 项子能力</summary>${layers.map((layer) => `<section><h3>${layer.id} · ${layer.title}</h3><p>${layer.summary}</p>${modules.filter((item) => item.layerId === layer.id).map((module) => `<article><h4>${html(module.title)} · ${statusLabels[module.implementationStatus]}</h4><p>${html(module.responsibility)}</p><ul>${features.filter((item) => item.moduleId === module.id).map((item) => `<li>${html(item.title)} <span class="ap-small">· ${statusLabels[item.implementationStatus]}</span></li>`).join('')}</ul></article>`).join('')}</section>`).join('')}</details>`;

const renderOverview = () => `<section class="ap-overview" aria-label="架构简明总览">
  <div class="ap-overview-caption"><p>先看整体，再看模块</p><span>以下为规划蓝图 · 部分能力还没开始做</span></div>
  <p class="ap-overview-lead">用三段话讲清整体：<b>业务应用</b>是用户直接用到的功能，<b>平台能力</b>支撑这些功能，<b>技术底座</b>是它们跑在上面的数据和机器。每段各配一句说明；细节在下面的「查看详细架构」里。</p>
  <div class="ap-overview-band ap-overview-band--apps">
    <header><span>01</span><h2>业务应用</h2><p>用户用什么</p></header>
    <ul class="ap-overview-apps">${modules.filter((module) => module.kind === 'application').map((module) => `<li><strong>${html(module.title)}</strong><p>${html(module.responsibility)}</p></li>`).join('')}</ul>
  </div>
  <p class="ap-overview-connector"><span>↑</span> 界面与业务能力支撑应用</p>
  <div class="ap-overview-band">
    <header><span>02</span><h2>平台能力</h2><p>应用靠什么</p></header>
    <ul class="ap-overview-platform">
      <li><strong>界面与渲染</strong><p>ZDS 组件、页面搭建、站点渲染</p></li>
      <li><strong>接口与接入</strong><p>公共 API、管理 API、外部事件</p></li>
      <li><strong>业务流程</strong><p>编辑、预览、发布、交易与后台任务</p></li>
      <li><strong>业务规则</strong><p>站点、内容、版本、会员与营销</p></li>
    </ul>
  </div>
  <p class="ap-overview-connector"><span>↑</span> 存储、集成与运行环境支撑平台</p>
  <div class="ap-overview-band ap-overview-band--base">
    <header><span>03</span><h2>技术底座</h2><p>能力如何运行</p></header>
    <ul class="ap-overview-base">
      <li><strong>数据与系统连接</strong><p>数据库、文件存储、消息、缓存、搜索与外部系统适配</p></li>
      <li><strong>运行与运维</strong><p>服务计算、网络与 CDN、区域部署、配置、备份与恢复</p></li>
    </ul>
  </div>
  <p class="ap-overview-governance"><b>三段都适用的通用规则</b> 身份与安全 · 工程交付 · 监控与可靠性 · 数据治理</p>
  <div class="ap-overview-notes">
    <p><b>Atlas</b> 管理内容、搭建和发布页面。<b>ZDS</b> 提供基础界面。<b>Shopify</b> 负责交易数据与结账。</p>
    <p><b>多站点</b> = 同一个应用的多个访问入口，例如欧洲店面和日本店面，各有域名、语言、主题和店铺配置。</p>
  </div>
</section>`;

export const renderPanorama = () => `<div class="ap-root" data-architecture>
  ${renderOverview()}
  <details class="ap-advanced" data-advanced id="architecture-details">
  <summary><span>查看详细架构</span><small>七层 · 谁调用谁 · 数据 · 部署 · 做到哪一步</small></summary>
  <nav class="ap-views" aria-label="架构视图">${views.map(([id, title]) => `<button type="button" data-view="${id}" aria-pressed="${id === 'panorama'}">${title}</button>`).join('')}<span>蓝图 ${archMeta.liveMapVersion} · 核对 ${archMeta.checkedAt}</span></nav>
  <div class="ap-surface">
    <div data-view-panel="panorama">
      ${lead('一张总图：系统从上面的“用户界面”到下面的“机器”排成七层（L7 在上、L1 在下），右侧是每一层都要遵守的通用规则。层号只是编号，L7 并不比 L1 “高级”。', '点任意方块，下面会展开它负责什么、依赖谁、数据归谁、跑在哪里。')}
      <p class="ap-small">三个状态词：${statusHelp}</p>
      <div class="ap-map-caption"><p><b>七层逻辑结构</b></p><div class="ap-legend"><span class="ap-status ap-status--source-present">源码已有</span><span class="ap-status ap-status--partial">部分已有</span><span class="ap-status ap-status--proposed">候选设计</span></div></div>
      <div data-shared-map>${renderMap()}</div>
    </div>
    <div data-view-panel="dependencies" hidden>
      ${lead('这里画的是模块之间的调用与依赖，也就是“谁用到谁”。', '默认看的是「打算怎么做」（目标蓝图），可以切到「现在怎么做」对照当前源码。请求不一定逐层穿过七层，例如静态页面会直接命中 CDN。')}
      <div class="ap-relation-controls"><label>看哪种关系<select data-relation-mode><option value="call">同步调用</option><option value="code">代码依赖</option></select></label>
        <label>看哪一版<select data-perspective><option value="target">打算怎么做</option><option value="current">现在怎么做</option></select></label>
        <label>业务场景<select data-scenario><option value="all">主要关系概览</option>${scenarios.map((item) => `<option value="${item.id}">${item.title}</option>`).join('')}</select></label>
      </div><p class="ap-scenario-note" data-scenario-note></p>
      <div class="ap-relation-key">${(['call', 'code', 'event', 'artifact'] as RelationKind[]).map((kind) => `<span><i class="ap-key--${kind}"></i>${kindLabels[kind]}（${kindHelp[kind]}）</span>`).join('')}</div>
      <div data-dependency-map></div>
      <div class="ap-external" aria-label="参与者与外部系统">${externalNodes.map((node) => `<span data-external="${node.id}">${html(node.title)}</span>`).join('')}</div>
      <h3 class="ap-relations-title">关系明细 <span data-relation-count></span></h3><ol class="ap-relation-list" data-relation-list></ol>
      <details class="ap-rules"><summary>各层允许 / 禁止依赖谁（目标规则）</summary>${table(['这一层', '可以用', '不能直接用 / 要换成接口'], dependencyRules)}<p>一句话：外层可以依赖内层，内层不能反过来依赖外层。领域代码不认识数据库和第三方 SDK，这些细节留在“适配层”。</p></details>
    </div>
    <div data-view-panel="data" hidden>${renderData()}</div>
    <div data-view-panel="deployment" hidden>${renderDeployment()}</div>
    <div data-view-panel="validation" hidden>${renderValidation()}</div>
    <div class="ap-selection-bar" data-selection-bar hidden><span data-selection-label></span><button type="button" data-read-detail>阅读详情 ↓</button><button type="button" data-clear-selection>清除选择</button></div>
    <section class="ap-detail" data-detail hidden aria-label="选中模块详情"></section>
    <p class="ap-live sr-only" aria-live="polite" data-live></p>
  </div>
  <div class="ap-explainer"><div><h3>“应用”和“多站点”怎么区分</h3><p>六类应用按“服务谁、完成什么任务”来分。同一个电商应用可以装配成“品牌 A 欧洲店面”和“品牌 A 日本店面”：各有自己的域名、内容、主题、语言和币种、绑定的店铺、发布版本和所在地区。</p></div><div><h3>组织 → 品牌 → 站点</h3><p>站点只是“一个访问入口 + 一套配置”。主页、商品详情、文章、落地页、购物车是应用内部的页面类型；手机/桌面是渠道。站点不等于一家公司，也不等于一个数据库。</p><button type="button" data-select-site>查看站点设计 →</button></div></div>
  <button type="button" class="ap-back-overview" data-back-overview>收起详情，返回总览 ↑</button>
  </details>
</div>`;

const renderDetail = (module: Module) => {
  const connected = relations.filter((item) => item.from === module.id || item.to === module.id);
  const assets = dataAssets.filter((item) => module.dataIds.includes(item.id));
  return `<header><div><span>${module.layerId || '通用规则'} · ${module.ownerRole}</span><h2 tabindex="-1" data-detail-title>${html(module.title)}</h2></div><button type="button" data-return-module>返回模块 ↑</button></header>
    <div class="ap-lead"><p><b>这是什么</b>${html(module.responsibility)}</p><p><b>它不做什么 / 边界</b>${module.boundaries.map(html).join(' ')}</p></div>
    <div class="ap-detail-status">${badge(module)}<span>验证：${module.validationStatus === 'configured' ? '有检查配置，但缺运行证据' : '还没有独立验证'}</span><span>部署：只是建议，生产未核实</span></div>
    <h3>细节</h3>
    <div class="ap-detail-grid"><div><h4>功能清单（含做到哪一步）</h4><ul>${features.filter((item) => item.moduleId === module.id).map((feature) => `<li><b>${html(feature.title)}</b><span class="ap-status">${statusLabels[feature.implementationStatus]}</span><p class="ap-small">${html(feature.detail)}</p></li>`).join('')}</ul></div>
      <div><h4>依赖谁 / 谁调用它</h4>${connected.length ? `<ul>${connected.map((item) => `<li><span class="ap-small">${perspectiveLabels[item.perspective]} · ${kindLabels[item.kind]}（${kindHelp[item.kind]}）</span><p>${html(nodeTitle(item.from))} → ${html(nodeTitle(item.to))}<br>${html(item.label)}</p></li>`).join('')}</ul>` : '<p>还没登记具体链路；上面的通用依赖规则适用，具体接口待业务确认。</p>'}</div></div>
    <h4>对外接口：输入、输出、失败怎么办</h4>${module.contractIds.length ? contracts.filter((item) => module.contractIds.includes(item.id)).map((contract) => `<details class="ap-contract"><summary>${contract.title} · ${contract.perspective === 'current' ? '现有接口' : '目标接口，待实施'}</summary><dl><dt>输入</dt><dd>${html(contract.input)}</dd><dt>输出</dt><dd>${html(contract.output)}</dd><dt>失败与一致性</dt><dd>${html(contract.errors)} ${html(contract.consistency)}</dd><dt>版本与兼容</dt><dd>${html(contract.versioning)}</dd></dl></details>`).join('') : `<p>${module.layerId === 'L6' || module.layerId === 'L7' ? '输入是公开的数据结构和用户操作；输出是界面和发往服务端的请求。具体接口见源码和文档，跨版本兼容矩阵待建立。' : '这一层需要对外提供明确的接口，本节点暂时没有确认独立接口；逻辑模块不等于独立服务。'}</p>`}
    <h4>涉及的数据：谁负责、存在哪</h4>${assets.length ? table(['数据', '谁负责 / 存在哪', '地区与清理'], assets.map((asset) => [asset.title, `${asset.sourceOfTruth}；${asset.store}`, `${asset.regionPolicy}；${asset.lifecycle}`])) : '<p>这个模块没有自己的“权威数据”；它只通过公开接口读取别人负责的数据。</p>'}
    <h4>跑在哪里、坏了会怎样</h4><ul>${deployments.filter((item) => module.deploymentIds.includes(item.id)).map((item) => `<li><b>${item.title} · 部署建议</b><p>${html(item.technology)}；${html(item.failureBoundary)}</p></li>`).join('') || '<li>部署单元还没确认；可以和生命周期相同的功能合并部署。</li>'}</ul>
    <h4>依据（核对日期 ${archMeta.checkedAt}）</h4><p class="ap-small">下面是判断该模块状态时实际看过的源码、配置或文档。</p>${evidenceList(module.evidenceIds)}`;
};

export const setupPanorama = () => {
  const root = document.querySelector<HTMLElement>('[data-architecture]');
  if (!root) return;
  let view: View = 'panorama';
  let selected = '';
  let mode = 'call';
  let perspective: Perspective = 'target';
  let scenario = 'all';
  let frame = 0;
  const q = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const advanced = q<HTMLDetailsElement>('[data-advanced]');
  const map = q('[data-shared-map]');
  const observer = new ResizeObserver(() => scheduleLines());
  observer.observe(q('[data-map]'));
  const matchingRelations = () => {
    const candidates = relations.filter((item) => item.perspective === perspective &&
      (mode === 'code' ? item.kind === 'code' : item.kind !== 'code') &&
      (scenario === 'all' || item.scenarioIds.includes(scenario)) &&
      (!selected || item.from === selected || item.to === selected));
    return scenario === 'all' && !selected ? candidates.slice(0, 8) : candidates;
  };
  const scheduleLines = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(drawLines);
  };
  const drawLines = () => {
    const svg = q<SVGSVGElement>('[data-lines]');
    svg.innerHTML = '';
    if (view !== 'dependencies' || window.innerWidth < 900) return;
    const bounds = q('[data-map]').getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    svg.innerHTML = '<defs><marker id="ap-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#496783"></path></marker></defs>';
    matchingRelations().forEach((item, i) => {
      const from = root.querySelector(`[data-module="${item.from}"]`);
      const to = root.querySelector(`[data-module="${item.to}"]`);
      if (!from || !to) return;
      const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const x1 = a.left + a.width / 2 - bounds.left, y1 = a.top - bounds.top - 4;
      const x2 = b.left + b.width / 2 - bounds.left, y2 = b.top - bounds.top - 4;
      const stack = q('.ap-layer-stack').getBoundingClientRect();
      const channel = stack.right - bounds.left + 12 + (i % 6) * 5;
      const d = Math.abs(y1 - y2) < 2
        ? `M${x1},${a.top - bounds.top} V${y1} H${x2} V${b.top - bounds.top}`
        : `M${x1},${a.top - bounds.top} V${y1} H${channel} V${y2} H${x2} V${b.top - bounds.top}`;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d); path.setAttribute('class', `ap-line ap-line--${item.kind}`);
      path.setAttribute('marker-end', 'url(#ap-arrow)');
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${nodeTitle(item.from)} → ${nodeTitle(item.to)}：${item.label}`;
      path.append(title); svg.append(path);
      if (Math.abs(y1 - y2) > 2) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(channel + 3));
        label.setAttribute('y', String((y1 + y2) / 2 + (i % 3) * 10));
        label.setAttribute('class', 'ap-line-number');
        label.textContent = String(i + 1);
        svg.append(label);
      }
    });
  };
  const updateRelations = () => {
    const active = matchingRelations();
    const neighbors = new Set(active.flatMap((item) => [item.from, item.to]));
    root.querySelectorAll<HTMLElement>('[data-module]').forEach((node) => {
      node.classList.toggle('is-related', view === 'dependencies' && neighbors.has(node.dataset.module!));
      node.classList.toggle('is-selected', node.dataset.module === selected);
      node.setAttribute('aria-pressed', String(node.dataset.module === selected));
    });
    root.querySelectorAll<HTMLElement>('[data-external]').forEach((node) => node.classList.toggle('is-related', neighbors.has(node.dataset.external!)));
    q('[data-relation-list]').innerHTML = active.length ? active.map((item) => `<li><span class="ap-status">${perspectiveLabels[item.perspective]} · ${kindLabels[item.kind]}</span><strong>${html(nodeTitle(item.from))} → ${html(nodeTitle(item.to))}</strong><p>${html(item.label)}</p></li>`).join('') : '<li>这个组合下暂时没有已核对的关系。可以切到“打算怎么做”看看候选设计。</li>';
    q('[data-relation-count]').textContent = `· ${active.length} 条`;
    q('[data-scenario-note]').textContent = (scenario === 'all' ? '这里默认只显示八条主要关系；选一个业务场景可以看完整链路，选中模块可以看它的直接上下游。' : scenarios.find((item) => item.id === scenario)!.description) +
      (mode === 'code' ? ' 代码依赖的箭头指向“被依赖的一方”，不代表线上调用顺序。' : ' 请求不一定逐层穿过七层，例如静态页面会直接命中 CDN。') +
      (perspective === 'current' ? ' 现在只画代码里能找到的关系。' : ' 目标是打算这么做，还需要真正实施和验证。');
    scheduleLines();
  };
  const writeUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    if (selected) url.hash = `module-${selected}`;
    else if (url.hash.startsWith('#module-')) url.hash = 'panorama';
    history.replaceState(null, '', url);
  };
  const setView = (next: View, sync = true) => {
    view = next;
    root.querySelectorAll<HTMLElement>('[data-view-panel]').forEach((panel) => panel.hidden = panel.dataset.viewPanel !== view);
    root.querySelectorAll('[data-view]').forEach((node) => node.setAttribute('aria-pressed', String(node.getAttribute('data-view') === view)));
    if (view === 'panorama') q('[data-view-panel="panorama"]').append(map);
    if (view === 'dependencies') q('[data-dependency-map]').append(map);
    q('[data-map]').classList.toggle('ap-map--relations', view === 'dependencies');
    if (sync) writeUrl();
    updateRelations();
  };
  const selectModule = (id: string, sync = true) => {
    const module = modules.find((item) => item.id === id);
    if (!module) return;
    selected = id;
    q('[data-detail]').innerHTML = renderDetail(module);
    q('[data-detail]').hidden = false;
    q('[data-selection-bar]').hidden = false;
    q('[data-selection-label]').textContent = `已选择 ${module.title} · 往下看它做什么、依赖谁、数据归谁、跑在哪。`;
    q('[data-live]').textContent = `已选择${module.title}，可用“阅读详情”按钮查看。`;
    updateRelations();
    if (sync) writeUrl();
  };
  root.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('button');
    if (!target) return;
    if (target.hasAttribute('data-back-overview')) {
      advanced.open = false;
      q('.ap-advanced > summary').focus();
      root.scrollIntoView({ block: 'start' });
    }
    if (target.dataset.view) setView(target.dataset.view as View);
    if (target.dataset.module) selectModule(target.dataset.module);
    if (target.hasAttribute('data-select-site')) { setView('panorama'); selectModule('domain-sites'); q('[data-selection-bar]').scrollIntoView({ block: 'center' }); }
    if (target.hasAttribute('data-read-detail')) {
      q('[data-detail-title]').focus(); q('[data-detail]').scrollIntoView({ block: 'start' });
    }
    if (target.hasAttribute('data-return-module')) {
      if (!['panorama', 'dependencies'].includes(view)) setView('panorama');
      q(`[data-module="${selected}"]`).focus(); q(`[data-module="${selected}"]`).scrollIntoView({ block: 'center' });
    }
    if (target.hasAttribute('data-clear-selection')) {
      const previous = selected; selected = '';
      q('[data-detail]').hidden = true; q('[data-selection-bar]').hidden = true;
      updateRelations(); writeUrl();
      if (['panorama', 'dependencies'].includes(view) && previous) q(`[data-module="${previous}"]`).focus();
      else q(`[data-view="${view}"]`).focus();
      q('[data-live]').textContent = '已清除模块选择。';
    }
  });
  root.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    if (target.hasAttribute('data-relation-mode')) mode = target.value;
    if (target.hasAttribute('data-perspective')) perspective = target.value as Perspective;
    if (target.hasAttribute('data-scenario')) scenario = target.value;
    updateRelations();
  });
  const restoreUrl = () => {
    const requested = new URL(window.location.href).searchParams.get('view');
    const next = views.some(([id]) => id === requested) ? requested as View : 'panorama';
    const hasModule = window.location.hash.startsWith('#module-') && modules.some((item) => `#module-${item.id}` === window.location.hash);
    advanced.open = views.some(([id]) => id === requested) || hasModule || window.location.hash === '#architecture-details';
    setView(next, false);
    const id = window.location.hash.replace(/^#module-/, '');
    if (window.location.hash.startsWith('#module-') && modules.some((item) => item.id === id)) {
      if (!['panorama', 'dependencies'].includes(next)) setView('panorama', false);
      selectModule(id, false);
      q(`[data-module="${id}"]`).scrollIntoView({ block: 'center' });
    }
  };
  advanced.addEventListener('toggle', () => {
    if (advanced.open) scheduleLines();
    else {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      if (url.hash.startsWith('#module-') || url.hash === '#architecture-details') url.hash = 'panorama';
      history.replaceState(null, '', url);
    }
  });
  window.addEventListener('popstate', restoreUrl);
  window.addEventListener('hashchange', restoreUrl);
  window.addEventListener('pagehide', () => { observer.disconnect(); cancelAnimationFrame(frame); }, { once: true });
  restoreUrl();
};
