(async () => {
  const q = (selector) => document.querySelector(selector);
  const assert = (value, label) => { if (!value) throw new Error(label); };
  const result = { viewport: [innerWidth, innerHeight], modules: 0, views: [], scenarios: [] };
  q('[data-view="panorama"]').click();
  if (!q('[data-clear-selection]').closest('[hidden]')) q('[data-clear-selection]').click();
  const nodes = [...document.querySelectorAll('[data-module]')];
  for (const node of nodes) {
    node.click();
    assert(node.getAttribute('aria-pressed') === 'true', node.dataset.module + ' selection');
    assert(q('[data-detail-title]').textContent === node.querySelector('strong').textContent, node.dataset.module + ' detail');
    assert(q('[data-detail]').innerText.includes('输入输出与失败契约') && q('[data-detail]').innerText.includes('部署与故障边界'), 'detail sections');
    q('[data-read-detail]').click();
    assert(document.activeElement === q('[data-detail-title]'), 'detail focus');
    q('[data-return-module]').click();
    assert(document.activeElement === node, 'return focus');
    result.modules++;
  }
  q('[data-clear-selection]').click();
  for (const view of ['panorama', 'dependencies', 'data', 'deployment', 'validation']) {
    q('[data-view="' + view + '"]').click();
    assert(!q('[data-view-panel="' + view + '"]').hidden, view + ' visible');
    assert(document.documentElement.scrollWidth <= innerWidth, view + ' page overflow');
    const panel = q('[data-view-panel="' + view + '"]');
    assert(panel.scrollWidth <= panel.clientWidth + 1, view + ' panel overflow');
    result.views.push(view);
  }
  q('[data-view="dependencies"]').click();
  for (const mode of ['call', 'code']) {
    q('[data-relation-mode]').value = mode;
    q('[data-relation-mode]').dispatchEvent(new Event('change', { bubbles: true }));
    for (const perspective of ['target', 'current']) {
      q('[data-perspective]').value = perspective;
      q('[data-perspective]').dispatchEvent(new Event('change', { bubbles: true }));
      for (const scenario of ['visit', 'edit', 'publish', 'account', 'events', 'delivery']) {
        q('[data-scenario]').value = scenario;
        q('[data-scenario]').dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(requestAnimationFrame);
        const count = Number(q('[data-relation-count]').textContent.match(/\d+/)[0]);
        assert(q('[data-relation-list]').children.length > 0, 'relations or explicit empty state');
        if (mode === 'call' && perspective === 'target') assert(count > 0, 'target scenario incomplete ' + scenario);
        if (mode === 'code') assert([...q('[data-relation-list]').children].every((node) => node.innerText.includes('代码依赖') || count === 0), 'code view mixed with calls');
        if (innerWidth < 900) assert(getComputedStyle(q('[data-lines]')).display === 'none', 'mobile lines hidden');
        result.scenarios.push([mode, perspective, scenario, count]);
      }
    }
  }
  q('[data-view="panorama"]').click();
  window.scrollTo(0, 0);
  result.mapHeight = q('[data-map]').getBoundingClientRect().height;
  result.lastLayerBottom = q('.ap-layer--L1').getBoundingClientRect().bottom;
  if (innerWidth === 1440) assert(result.lastLayerBottom <= innerHeight, 'all seven layers visible on desktop');
  return JSON.stringify(result);
})()
