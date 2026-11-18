import {
  capabilityBands, capabilities, capabilityStatusLabels, externalSystem,
  keyRelations, mainChains, resolveGroupHash,
} from './architecture-overview-data';
import type { Capability, ChainId } from './architecture-overview-data';

const html = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const title = (id: string) => capabilities.find((item) => item.id === id)?.title ?? externalSystem.title;
const arrow = '<svg viewBox="0 0 32 12" aria-hidden="true"><path d="M1 6H29M24 1l5 5-5 5" /></svg>';
const renderGroup = (item: Capability) => `<button type="button" class="ov-group" id="group-${item.id}"
  data-group="${item.id}" aria-haspopup="dialog">
  <span class="ov-group-heading"><strong>${html(item.title)}</strong><span class="ov-status ov-status--${item.status}">${capabilityStatusLabels[item.status]}</span></span>
  <span class="ov-summary">${html(item.summary)}</span>
  <span class="ov-tags">${item.tags.map((tag) => `<span>${html(tag)}</span>`).join('')}</span>
</button>`;

export const renderPanorama = () => `<div class="ov-root" data-architecture>
  <div class="ov-toolbar">
    <div><span class="ov-kicker">全景 / OVERVIEW</span><p>七类能力，三条主链路</p></div>
    <nav class="ov-chains" aria-label="突出主要协作链路">
      <button type="button" data-chain="all" aria-pressed="true">全部能力</button>
      ${mainChains.map((chain) => `<button type="button" data-chain="${chain.id}" aria-pressed="false">${chain.title}</button>`).join('')}
    </nav>
  </div>
  <p class="ov-chain-description" data-chain-description aria-live="polite">箭头表达主要协作，能力带不是严格执行顺序。点击能力组可查看简短说明。</p>
  <div class="ov-layout">
    <div class="ov-bands">
      ${capabilityBands.map((band, index) => `<section class="ov-band ov-band--${band.id}" data-band="${band.id}" aria-labelledby="band-${band.id}">
        <header><span class="ov-number">0${index + 1}</span><h2 id="band-${band.id}">${band.title}</h2><p>${band.caption}</p></header>
        <div class="ov-groups" style="--group-count:${band.groups.length}">${band.groups.map(renderGroup).join('')}</div>
      </section>`).join('')}
    </div>
    <aside class="ov-relations" aria-label="主要协作关系">
      <header><span class="ov-kicker">连接 / CONNECTIONS</span><h2>主要协作</h2><p>只保留关键关系</p></header>
      <ol>${keyRelations.map((relation) => `<li data-relation="${relation.id}">
        <div class="ov-relation-nodes"><span>${html(title(relation.from))}</span>${arrow}<span>${html(title(relation.to))}</span></div>
        <p>${html(relation.label)}</p>
      </li>`).join('')}</ol>
      <div class="ov-external" data-external="shopify"><span>外部边界</span><h3>${externalSystem.title}</h3><p>${externalSystem.summary}</p></div>
    </aside>
  </div>
  <div class="ov-footnote"><span><b>颜色</b> 表达能力分类</span><span><b>状态</b> 按已核对源码与配置标记，不代表生产已部署</span><span>ZBC 规划且可选 · 页面可直接使用 ZDS</span></div>
  <dialog class="ov-dialog" data-capability-dialog aria-labelledby="capability-title">
    <div class="ov-dialog-heading"><div><span data-detail-band class="ov-kicker"></span><h2 id="capability-title" data-detail-title></h2></div><button type="button" data-close-detail aria-label="关闭能力说明">关闭 <span aria-hidden="true">×</span></button></div>
    <dl data-detail-fields></dl>
  </dialog>
</div>`;

export function setupPanorama() {
  const root = document.querySelector<HTMLElement>('[data-architecture]');
  if (!root) return;
  const dialog = root.querySelector<HTMLDialogElement>('[data-capability-dialog]')!;
  let selected: string | undefined;
  let activeChain: ChainId | 'all' = 'all';
  const defaultDescription = root.querySelector('[data-chain-description]')!.textContent!;

  const syncURL = () => {
    const url = new URL(location.href);
    url.searchParams.delete('view');
    if (activeChain === 'all') url.searchParams.delete('chain');
    else url.searchParams.set('chain', activeChain);
    url.hash = selected ? `group-${selected}` : '';
    history.replaceState(null, '', url);
  };
  const setChain = (id: ChainId | 'all') => {
    activeChain = id;
    const chain = mainChains.find((item) => item.id === id);
    root.querySelectorAll<HTMLButtonElement>('[data-chain]').forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.chain === id)));
    root.querySelector('[data-chain-description]')!.textContent = chain?.description ?? defaultDescription;
    root.querySelectorAll<HTMLElement>('[data-group], [data-external]').forEach((node) => {
      const relevant = !chain || chain.nodes.includes(node.dataset.group ?? node.dataset.external!);
      node.classList.toggle('is-muted', !relevant);
      node.classList.toggle('is-highlighted', Boolean(chain) && relevant);
    });
    root.querySelectorAll<HTMLElement>('[data-relation]').forEach((node) => {
      const relation = keyRelations.find((item) => item.id === node.dataset.relation)!;
      const relevant = !chain || (relation.chains as ChainId[]).includes(chain.id);
      node.classList.toggle('is-muted', !relevant);
      node.classList.toggle('is-highlighted', Boolean(chain) && relevant);
    });
  };
  const showDetail = (id: string) => {
    const item = capabilities.find((value) => value.id === id);
    if (!item) return;
    selected = id;
    const band = capabilityBands.find((value) => value.groups.includes(item))!;
    root.querySelector('[data-detail-band]')!.textContent = band.title;
    root.querySelector('[data-detail-title]')!.textContent = item.title;
    root.querySelector('[data-detail-fields]')!.innerHTML = [
      ['负责什么', item.summary], ['主要包含', item.includes], ['与谁协作', item.collaboration],
      ['当前状态', `${capabilityStatusLabels[item.status]}。${item.statusNote}`],
    ].map(([label, value]) => `<div><dt>${label}</dt><dd>${html(value)}</dd></div>`).join('');
    if (!dialog.open) dialog.showModal();
    syncURL();
  };
  root.querySelectorAll<HTMLButtonElement>('[data-group]').forEach((button) =>
    button.addEventListener('click', () => showDetail(button.dataset.group!)));
  root.querySelectorAll<HTMLButtonElement>('[data-chain]').forEach((button) =>
    button.addEventListener('click', () => { setChain(button.dataset.chain as ChainId | 'all'); syncURL(); }));
  root.querySelector('[data-close-detail]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      root.querySelector<HTMLButtonElement>('[data-close-detail]')!.focus();
    }
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  } });
  dialog.addEventListener('close', () => {
    const previous = selected;
    selected = undefined;
    syncURL();
    if (previous) root.querySelector<HTMLButtonElement>(`[data-group="${previous}"]`)?.focus({ preventScroll: true });
  });
  const readURL = () => {
    const chain = new URL(location.href).searchParams.get('chain');
    setChain(mainChains.some((item) => item.id === chain) ? chain as ChainId : 'all');
    const id = resolveGroupHash(location.hash);
    if (id) showDetail(id);
    else {
      if (dialog.open) dialog.close();
      selected = undefined;
      syncURL();
    }
  };
  window.addEventListener('popstate', readURL);
  window.addEventListener('hashchange', readURL);
  readURL();
}
