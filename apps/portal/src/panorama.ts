import {
  archMeta, layers, modules, features, relations, contracts, dataAssets, deployments, evidence,
  externalNodes, scenarios, validationItems, architectureGaps, dependencyRules, reliabilityTargets,
  capacityInputs, statusLabels,
} from './architecture-data';
import type { Module, RelationKind, Perspective } from './architecture-data';

const html = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const views = [
  ['panorama', '分层全景'], ['dependencies', '依赖与调用'], ['data', '数据归属'],
  ['deployment', '区域部署'], ['validation', '设计与验证'],
] as const;
type View = typeof views[number][0];
const kindLabels: Record<RelationKind, string> = { code: '代码依赖', call: '同步调用', event: '事件', artifact: '产物交付', governance: '治理' };
const nodeTitle = (id: string) => modules.find((item) => item.id === id)?.title ?? externalNodes.find((item) => item.id === id)?.title ?? id;
const badge = (module: Module) => `<span class="ap-status ap-status--${module.implementationStatus}">${statusLabels[module.implementationStatus]}</span>`;
const button = (module: Module) => `<button type="button" class="ap-node" data-module="${module.id}" id="node-${module.id}" aria-pressed="false"><strong>${html(module.title)}</strong>${badge(module)}</button>`;
const table = (headers: string[], rows: string[][]) => `<div class="ap-table-wrap"><table class="ap-table"><thead><tr>${headers.map((value) => `<th scope="col">${html(value)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${html(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
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
    <aside class="ap-governance" aria-label="横切治理"><p>贯穿所有层</p><h3>横切治理</h3>
      ${modules.filter((item) => item.kind === 'governance').map((module) => `<div>${button(module)}<p>${features.filter((item) => item.moduleId === module.id).slice(0, 3).map((item) => html(item.title)).join(' · ')}</p></div>`).join('')}
      <small>规则需要证据与责任人，<br>不能仅凭模块名称判定成熟。</small>
    </aside>
  </div>`;

const renderData = () => `<div class="ap-view-heading"><h2>数据的权威所有者与写入边界</h2><p>个人与交易数据按 homeRegion 写入；全球共享允许流转的配置与汇总。</p></div>
  ${table(['数据 / 状态', '权威所有者', '存储与区域策略', '读写方', '生命周期'], dataAssets.map((asset) => [
    `${asset.title} · ${statusLabels[asset.status]}`, asset.sourceOfTruth, `${asset.store}；${asset.regionPolicy}`,
    `读：${asset.readers.map(nodeTitle).join('、')}；写：${asset.writers.map(nodeTitle).join('、')}`, asset.lifecycle,
  ]))}
  <p class="ap-callout">可信身份与站点注册表解析组织/站点权限；Repository 查询约束与可验证数据库策略共同隔离。共享连接池不能仅靠会话变量。搜索、缓存与报表均为可重建投影。</p>`;
const renderDeployment = () => `<div class="ap-view-heading"><h2>全球控制面 · 区域业务面 · 外部系统</h2><p>以下为部署建议，实际生产拓扑尚未核实。逻辑模块不等于独立微服务。</p></div>
  <div class="ap-deployment">${(['global', 'regional', 'external'] as const).map((scope) => `
    <section class="ap-deployment-group"><header><span>${scope === 'global' ? 'GLOBAL' : scope === 'regional' ? 'HOME REGION' : 'EXTERNAL'}</span><h3>${scope === 'global' ? '全球与边缘' : scope === 'regional' ? '每个所属区域' : '外部权威系统'}</h3></header>
      ${deployments.filter((item) => item.scope === scope).map((item) => `<article><h4>${item.title}</h4><span class="ap-status">${item.status === 'target' ? '部署建议 · 待验证' : '外部部署待核实'}</span><p>${html(item.technology)}</p><p class="ap-small">${item.moduleIds.map(nodeTitle).map(html).join(' · ')}</p><p class="ap-boundary">${html(item.failureBoundary)}</p></article>`).join('')}
    </section>`).join('')}</div>
  <p class="ap-callout">区域路由以 homeRegion 为准。跨区误路由返回可重试提示；所属区域故障不自动在另一地区创建同一实体写主库。local/dev/staging/prod 隔离实例、凭证与存储；灾备区域、法律依据与保留期上线前确认。</p>`;
const renderValidation = () => `<div class="ap-view-heading"><h2>有设计、有代码，仍需运行证据</h2><p>分层清楚只是蓝图的起点；契约、隔离、依赖门禁、容量与恢复均需独立验证。</p></div>
  <div class="ap-validation-grid">${validationItems.map((item) => `<article><span>${html(item.status)}</span><h3>${item.title}</h3><p>${html(item.detail)}</p>${evidenceList(item.evidenceIds)}</article>`).join('')}</div>
  <h3>现状到目标的关键缺口</h3>${renderGaps()}
  <h3>可靠性分级建议</h3><p class="ap-callout">待业务确认、待压测/演练；这些数字不是当前 SLA。</p>
  ${table(['能力', '建议目标', '验证与降级'], reliabilityTargets)}
  <h3>容量计算输入</h3>${table(['参数', '当前取数'], capacityInputs)}
  <h3>演进顺序与兼容</h3><ol class="ap-steps"><li>核实数据库、版本语义与真实生产拓扑。</li><li>补组织/站点授权、区域数据边界、内层端口与公开契约。</li><li>建设发布任务、完整 release 与可靠产物激活。</li><li>按独立负载、故障域与生命周期拆分身份、集成、分析，验证灾备。</li></ol>
  <p>现有 site code、pageId、版本 ID 和 URL 保持可解析；配置扩展先双读验证。Schema/Theme/Runtime 维护兼容矩阵；数据库迁移与边缘切换分步执行。</p>`;
const renderGaps = () => `<div class="ap-gaps">${architectureGaps.map((gap) => `<article><h4>${gap.title}</h4><p><b>现状</b> ${html(gap.current)}</p><p><b>目标</b> ${html(gap.target)}</p><small>责任：${gap.ownerRole}</small></article>`).join('')}</div>`;
const renderInventory = () => `<details class="ap-inventory"><summary>完整功能清单 · ${modules.length} 模块 / ${features.length} 子能力</summary>${layers.map((layer) => `<section><h3>${layer.id} · ${layer.title}</h3><p>${layer.summary}</p>${modules.filter((item) => item.layerId === layer.id).map((module) => `<article><h4>${html(module.title)} · ${statusLabels[module.implementationStatus]}</h4><p>${html(module.responsibility)}</p><ul>${features.filter((item) => item.moduleId === module.id).map((item) => `<li>${html(item.title)} <span class="ap-small">· ${statusLabels[item.implementationStatus]}</span></li>`).join('')}</ul></article>`).join('')}</section>`).join('')}</details>`;

export const renderPanorama = () => `<div class="ap-root" data-architecture>
  <nav class="ap-views" aria-label="架构视图">${views.map(([id, title]) => `<button type="button" data-view="${id}" aria-pressed="${id === 'panorama'}">${title}</button>`).join('')}<span>蓝图 ${archMeta.liveMapVersion} · 核对 ${archMeta.checkedAt}</span></nav>
  <div class="ap-surface">
    <div data-view-panel="panorama">
      <div class="ap-map-caption"><p><b>七层逻辑结构</b> 应用在上，基础设施在下；点击模块看职责与边界。</p><div class="ap-legend"><span class="ap-status ap-status--source-present">源码已有</span><span class="ap-status ap-status--partial">部分已有</span><span class="ap-status ap-status--proposed">候选设计</span></div></div>
      <div data-shared-map>${renderMap()}</div>
    </div>
    <div data-view-panel="dependencies" hidden>
      <div class="ap-relation-controls"><label>关系类型<select data-relation-mode><option value="call">运行调用</option><option value="code">代码依赖</option></select></label>
        <label>设计视角<select data-perspective><option value="target">目标蓝图</option><option value="current">源码现状</option></select></label>
        <label>场景<select data-scenario><option value="all">主关系概览</option>${scenarios.map((item) => `<option value="${item.id}">${item.title}</option>`).join('')}</select></label>
      </div><p class="ap-scenario-note" data-scenario-note></p>
      <div class="ap-relation-key">${(['call', 'code', 'event', 'artifact'] as RelationKind[]).map((kind) => `<span><i class="ap-key--${kind}"></i>${kindLabels[kind]}</span>`).join('')}</div>
      <div data-dependency-map></div>
      <div class="ap-external" aria-label="参与者与外部系统">${externalNodes.map((node) => `<span data-external="${node.id}">${html(node.title)}</span>`).join('')}</div>
      <h3 class="ap-relations-title">关系明细 <span data-relation-count></span></h3><ol class="ap-relation-list" data-relation-list></ol>
      <details class="ap-rules"><summary>目标代码依赖规则与禁止方向</summary>${table(['模块', '可依赖', '禁止 / 需经契约替代'], dependencyRules)}<p>运行时用例调用端口，适配执行存储/远程请求；代码中适配实现内层声明的端口。领域不 import 数据库 SDK。当前实体/ORM 耦合不代表端口分离已完成。</p></details>
    </div>
    <div data-view-panel="data" hidden>${renderData()}</div>
    <div data-view-panel="deployment" hidden>${renderDeployment()}</div>
    <div data-view-panel="validation" hidden>${renderValidation()}</div>
    <div class="ap-selection-bar" data-selection-bar hidden><span data-selection-label></span><button type="button" data-read-detail>阅读详情 ↓</button><button type="button" data-clear-selection>清除选择</button></div>
    <section class="ap-detail" data-detail hidden aria-label="选中模块详情"></section>
    <p class="ap-live sr-only" aria-live="polite" data-live></p>
  </div>
  <div class="ap-explainer"><div><h3>应用与多站点如何区分</h3><p>六类应用按人群与任务划分。一个电商应用可装配为“品牌 A 欧洲店面”和“品牌 A 日本店面”：各有域名、内容、主题、语言/币种、店铺绑定、发布版本和所属区域。</p></div><div><h3>组织 → 品牌 → 站点</h3><p>站点是访问入口与配置边界；主页、商品详情、文章、落地页、购物车是应用内部页面类型。手机/桌面是渠道，站点不是租户或数据库的同义词。</p><button type="button" data-select-site>查看站点域设计 →</button></div></div>
  ${renderInventory()}
</div>`;

const renderDetail = (module: Module) => {
  const connected = relations.filter((item) => item.from === module.id || item.to === module.id);
  const assets = dataAssets.filter((item) => module.dataIds.includes(item.id));
  return `<header><div><span>${module.layerId || '横切治理'} · ${module.ownerRole}</span><h2 tabindex="-1" data-detail-title>${html(module.title)}</h2></div><button type="button" data-return-module>返回模块 ↑</button></header>
    <p>${html(module.responsibility)}</p><div class="ap-detail-status">${badge(module)}<span>验证：${module.validationStatus === 'configured' ? '检查配置已有，运行待核实' : '待独立验证'}</span><span>部署：建议 / 生产待核实</span></div>
    <p class="ap-callout">${module.boundaries.map(html).join(' ')}</p>
    <div class="ap-detail-grid"><div><h3>功能与实现状态</h3><ul>${features.filter((item) => item.moduleId === module.id).map((feature) => `<li><b>${html(feature.title)}</b><span class="ap-status">${statusLabels[feature.implementationStatus]}</span><p class="ap-small">${html(feature.detail)} · ${html(feature.origin)}</p></li>`).join('')}</ul></div>
      <div><h3>依赖谁 / 谁调用它</h3>${connected.length ? `<ul>${connected.map((item) => `<li><span class="ap-small">${item.perspective === 'current' ? '源码现状' : '目标'} · ${kindLabels[item.kind]}</span><p>${html(nodeTitle(item.from))} → ${html(nodeTitle(item.to))}<br>${html(item.label)}</p></li>`).join('')}</ul>` : '<p>尚未登记具体链路；目标依赖规则适用，调用契约待业务确认。</p>'}</div></div>
    <h3>输入输出与失败契约</h3>${module.contractIds.length ? contracts.filter((item) => module.contractIds.includes(item.id)).map((contract) => `<details class="ap-contract"><summary>${contract.title} · ${contract.perspective === 'current' ? '现有源码接口' : '目标契约，待实施'}</summary><dl><dt>输入</dt><dd>${html(contract.input)}</dd><dt>输出</dt><dd>${html(contract.output)}</dd><dt>失败与一致性</dt><dd>${html(contract.errors)} ${html(contract.consistency)}</dd><dt>版本与兼容</dt><dd>${html(contract.versioning)}</dd></dl></details>`).join('') : `<p>${module.layerId === 'L6' || module.layerId === 'L7' ? '输入：公开 DTO、内容 Schema 与用户操作；输出：界面与公开客户端请求。具体 UI API 见源码/文档，目标兼容矩阵待建立。' : '能力输入输出需沿公开端口与契约定义；本节点暂未确认独立接口，不将逻辑模块等同独立服务。'}</p>`}
    <h3>数据所有权与读写</h3>${assets.length ? table(['数据', '所有者 / 存储', '区域与生命周期'], assets.map((asset) => [asset.title, `${asset.sourceOfTruth}；${asset.store}`, `${asset.regionPolicy}；${asset.lifecycle}`])) : '<p>本模块不声明独立权威数据；仅经公开契约读取能力，具体业务存储归对应领域。</p>'}
    <h3>部署与故障边界</h3><ul>${deployments.filter((item) => module.deploymentIds.includes(item.id)).map((item) => `<li><b>${item.title} · 部署建议</b><p>${html(item.technology)}；${html(item.failureBoundary)}</p></li>`).join('') || '<li>部署单元待确认，逻辑模块可与同生命周期能力合并部署。</li>'}</ul>
    <h3>事实依据 · ${archMeta.checkedAt}</h3>${evidenceList(module.evidenceIds)}`;
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
    svg.innerHTML = '<defs><marker id="ap-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#496783"/></marker></defs>';
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
    q('[data-relation-list]').innerHTML = active.length ? active.map((item) => `<li><span class="ap-status">${perspective === 'current' ? '源码现状' : '目标'} · ${kindLabels[item.kind]}</span><strong>${html(nodeTitle(item.from))} → ${html(nodeTitle(item.to))}</strong><p>${html(item.label)}</p></li>`).join('') : '<li>此场景在当前关系类型 / 视角下暂无已核对关系。可切换目标蓝图查看候选设计。</li>';
    q('[data-relation-count]').textContent = `· ${active.length} 条`;
    q('[data-scenario-note]').textContent = (scenario === 'all' ? '主关系概览仅展示八条以内；选择场景查看完整链路，选择模块查看直接上下游。' : scenarios.find((item) => item.id === scenario)!.description) +
      (mode === 'code' ? ' 代码依赖箭头指向被依赖模块，不等于线上调用顺序。' : ' 请求可直接命中 CDN，无需依次经过七层。') +
      (perspective === 'current' ? ' 当前仅绘制已有源码依据。' : ' 目标关系尚需实施与验证。');
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
    q('[data-selection-label]').textContent = `已选择 ${module.title} · 职责 / 功能 / 契约 / 数据 / 部署 / 证据`;
    q('[data-live]').textContent = `已选择${module.title}，可通过阅读详情按钮查看设计。`;
    updateRelations();
    if (sync) writeUrl();
  };
  root.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('button');
    if (!target) return;
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
    setView(next, false);
    const id = window.location.hash.replace(/^#module-/, '');
    if (window.location.hash.startsWith('#module-') && modules.some((item) => item.id === id)) {
      if (!['panorama', 'dependencies'].includes(next)) setView('panorama', false);
      selectModule(id, false);
      q(`[data-module="${id}"]`).scrollIntoView({ block: 'center' });
    }
  };
  window.addEventListener('popstate', restoreUrl);
  window.addEventListener('hashchange', restoreUrl);
  window.addEventListener('pagehide', () => { observer.disconnect(); cancelAnimationFrame(frame); }, { once: true });
  restoreUrl();
};
