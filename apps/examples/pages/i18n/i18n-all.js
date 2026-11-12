import { messages, SUPPORTED_LANGUAGES } from '@zone/i18n/types/languages';
import { getCurrLanguage } from '@zone/i18n';

function flattenObject(obj, prefix = '') {
  return Object.keys(obj || {}).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = value;
    }
    return acc;
  }, {});
}

function buildUnionKeySet() {
  const set = new Set();
  SUPPORTED_LANGUAGES.forEach(lang => {
    const flat = flattenObject(messages[lang]);
    Object.keys(flat).forEach(k => set.add(k));
  });
  return Array.from(set).sort();
}

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #table-root { overflow: auto; max-height: 70vh; border: 1px solid #eee; border-radius: 8px; }
    #tools { margin: 16px 0; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    #tools .mode-select { box-sizing: border-box; padding: 8px 12px; border:1px solid #d7d9e0; border-radius:6px; outline: none; height: 36px; line-height: 20px; font-size: 14px; background: #fff; }
    #tools .mode-select:focus { border-color:#0a67d1; box-shadow: 0 0 0 3px rgba(10,103,209,0.12); }
    .category-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .category-buttons button { padding: 6px 10px; border: 1px solid #ddd; background:#f7f7f7; border-radius:4px; cursor:pointer; }
    .category-buttons button.active { background:#FD5000; color:#fff; border-color:#FD5000; }
    table { width: 100%; border-collapse: collapse; border-top: 1px solid #e6e6ef; border-bottom: 1px solid #e6e6ef; }
    thead th { position: sticky; top: 0; background: #f9f9fb; z-index: 1; padding: 6px 12px; border: 1px solid #e6e6ef; }
    td { text-align: left; vertical-align: top; }
    tbody tr { border-bottom: 1px solid #e6e6ef; }
    tbody tr:nth-child(odd) { background: #fcfcfe; }
    tbody tr:hover { background: #f5f7ff; }
    .missing { background: #fff8f8; color: #cc0000; }
    .copy-btn, .export-btn { border: none; border-radius:6px; cursor:pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
    .copy-btn { padding: 4px 8px; font-size: 12px; line-height: 18px; }
    .export-btn { padding: 6px 10px; }
    .copy-btn:hover { background:#45a049; color:#fff; }
    .export-btn { background:#0a67d1; color:#fff; }
    .export-btn:hover { background:#0055b0; }
    .search-input { padding: 8px 12px; border:1px solid #d7d9e0; border-radius:6px; outline: none; }
    .search-input:focus { border-color:#0a67d1; box-shadow: 0 0 0 3px rgba(10,103,209,0.12); }
    .key-col { cursor:pointer; position: sticky; left: 0; z-index: 3; background: #f9f9fb; min-width: 240px; border-right: 1px solid #e6e6ef; }
    tbody td:first-child { position: sticky; left: 0; z-index: 2; background: #fff; border-right: 1px solid #e6e6ef; white-space: nowrap; }
    tbody td { min-width: 180px; padding: 6px; }
  `;
  document.head.appendChild(style);
}

function createToolbar(keys, onFilterChanged, onExport, onSort) {
  const tools = document.getElementById('tools');
  tools.innerHTML = '';
  const modeSelect = document.createElement('select');
  modeSelect.className = 'mode-select';
  const optSingle = document.createElement('option'); optSingle.value = 'single'; optSingle.textContent = '单语言';
  const optFull = document.createElement('option'); optFull.value = 'full'; optFull.textContent = '全量';
  modeSelect.appendChild(optSingle); modeSelect.appendChild(optFull);
  modeSelect.value = mode;
  tools.appendChild(modeSelect);
  let langSwitcherEl = null;
  if (mode === 'single') { langSwitcherEl = document.createElement('zone-i18n-change'); tools.appendChild(langSwitcherEl); }
  const search = document.createElement('input');
  search.className = 'search-input';
  search.placeholder = '搜索键或文案...';
  search.oninput = () => onFilterChanged({ query: search.value, category: currentCategory });

  const exportBtn = document.createElement('button');
  exportBtn.className = 'export-btn';
  exportBtn.textContent = '导出 CSV';
  exportBtn.onclick = onExport;
  if (mode !== 'full') exportBtn.style.display = 'none';

  const categories = new Set(keys.map(k => k.split('.')[0]));
  const catWrap = document.createElement('div');
  catWrap.className = 'category-buttons';
  const allBtn = document.createElement('button');
  allBtn.textContent = '全部';
  allBtn.className = 'active';
  allBtn.onclick = () => setCategory('all');
  catWrap.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = () => setCategory(cat);
    catWrap.appendChild(btn);
  });

  tools.appendChild(search);
  tools.appendChild(exportBtn);
  tools.appendChild(catWrap);
  modeSelect.onchange = () => {
    mode = modeSelect.value;
    exportBtn.style.display = mode === 'full' ? '' : 'none';
    const existingLang = tools.querySelector('zone-i18n-change');
    if (mode === 'single' && !existingLang) {
      const el = document.createElement('zone-i18n-change');
      tools.insertBefore(el, search);
    } else if (mode === 'full' && existingLang) {
      existingLang.remove();
    }
    onFilterChanged({ query: search.value, category: currentCategory });
  };

  function setCategory(cat) {
    currentCategory = cat;
    [...catWrap.querySelectorAll('button')].forEach(b => b.classList.remove('active'));
    const target = [...catWrap.querySelectorAll('button')].find(b => b.textContent === (cat === 'all' ? '全部' : cat));
    if (target) target.classList.add('active');
    onFilterChanged({ query: search.value, category: currentCategory });
  }
}

function exportCSV(rows, langs) {
  const header = ['key', ...langs];
  const lines = [header.join(',')];
  rows.forEach(({ key, values }) => {
    const line = [key, ...langs.map(l => JSON.stringify(values[l] ?? ''))];
    lines.push(line.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'i18n-all.csv'; a.click();
  URL.revokeObjectURL(url);
}

let sortDir = 'asc';
let currentCategory = 'all';
let mode = 'single';

function renderTable(keys) {
  const root = document.getElementById('table-root');
  root.innerHTML = '';

  // 预处理：扁平化所有语言
  const flatByLang = {};
  SUPPORTED_LANGUAGES.forEach(lang => { flatByLang[lang] = flattenObject(messages[lang]); });

  // 构建行数据
  const rows = keys.map(key => ({
    key,
    values: Object.fromEntries(SUPPORTED_LANGUAGES.map(l => [l, flatByLang[l][key]]))
  }));

  // 容错过滤器：按分类与搜索
  function applyFilter({ query = '', category = 'all' }) {
    const q = (query || '').toLowerCase();
    const filtered = rows.filter(row => {
      const byCat = category === 'all' ? true : row.key.startsWith(category + '.');
      const byText = q
        ? (row.key.toLowerCase().includes(q) || SUPPORTED_LANGUAGES.some(l => String(row.values[l] || '').toLowerCase().includes(q)))
        : true;
      return byCat && byText;
    });
    draw(filtered);
  }

  function draw(data) {
    root.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trH = document.createElement('tr');
    const keyTh = document.createElement('th');
    keyTh.className = 'key-col';
    const keyHeaderContent = document.createElement('div');
    keyHeaderContent.style.display = 'flex';
    keyHeaderContent.style.alignItems = 'center';
    keyHeaderContent.style.justifyContent = 'space-between';
    const keyHeaderText = document.createElement('span');
    keyHeaderText.textContent = '键';
    const sortIcon = document.createElement('span');
    sortIcon.className = 'sort-icon';
    sortIcon.textContent = '↕️';
    keyHeaderContent.appendChild(keyHeaderText);
    keyHeaderContent.appendChild(sortIcon);
    keyTh.appendChild(keyHeaderContent);
    keyTh.onclick = () => { sortDir = sortDir === 'asc' ? 'desc' : 'asc'; data.sort((a,b) => sortDir === 'asc' ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key)); draw(data); };
    trH.appendChild(keyTh);
    const langs = mode === 'full' ? SUPPORTED_LANGUAGES : [getCurrLanguage()];
    langs.forEach(l => { const th = document.createElement('th'); th.textContent = l; trH.appendChild(th); });
    if (mode === 'single') { const codeTh = document.createElement('th'); codeTh.textContent = '代码'; trH.appendChild(codeTh); }
    thead.appendChild(trH);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
      const tr = document.createElement('tr');
      const tdKey = document.createElement('td');
      tdKey.dataset.key = row.key;
      const keyText = document.createElement('span');
      keyText.className = 'key-text';
      keyText.textContent = row.key;
      tdKey.appendChild(keyText);
      tr.appendChild(tdKey);
      const langsRow = mode === 'full' ? SUPPORTED_LANGUAGES : [getCurrLanguage()];
      langsRow.forEach(l => {
        const td = document.createElement('td');
        const val = row.values[l];
        if (typeof val !== 'string') { td.textContent = '—'; td.className = 'missing'; }
        else { td.textContent = val; }
        tr.appendChild(td);
      });
      if (mode === 'single') {
    const tdCode = document.createElement('td');
    tdCode.className = 'code-cell';
    const codeContainer = document.createElement('div');
    codeContainer.style.position = 'relative';
    codeContainer.style.display = 'flex';
    codeContainer.style.flexDirection = 'row';
    codeContainer.style.alignItems = 'center';
    codeContainer.style.minWidth = '0';
    const codeExample = document.createElement('code');
    codeExample.style.minWidth = '0';
    codeExample.style.flex = '1';
        let codeText = `<zone-i18n key="${row.key}"></zone-i18n>`;
        const enVal = flatByLang['en'][row.key];
        if (typeof enVal === 'string' && enVal.includes('{')) {
          const paramMatches = enVal.match(/\{([^}]+)\}/g);
          if (paramMatches) {
            const params = {};
            paramMatches.forEach(match => {
              const paramName = match.replace(/[{}]/g, '');
              params[paramName] = `{${paramName}}`;
            });
            codeText = `<zone-i18n key="${row.key}" params='${JSON.stringify(params)}'></zone-i18n>`;
          }
        }
        codeExample.textContent = codeText;
        codeContainer.appendChild(codeExample);
        const copyCodeButton = document.createElement('button');
        copyCodeButton.className = 'copy-btn';
    copyCodeButton.style.marginTop = '0';
    copyCodeButton.style.marginLeft = '8px';
        copyCodeButton.textContent = '复制代码';
        copyCodeButton.onclick = () => { navigator.clipboard.writeText(codeText); copyCodeButton.textContent = '已复制'; setTimeout(() => copyCodeButton.textContent = '复制代码', 1000); };
        codeContainer.appendChild(copyCodeButton);
        tdCode.appendChild(codeContainer);
        tr.appendChild(tdCode);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    root.appendChild(table);

    // 复制按钮（可选：为每行键提供复制）
    [...tbody.querySelectorAll('tr')].forEach(tr => {
      const keyCell = tr.firstChild;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = '复制键';
      btn.onclick = () => {
        const k = keyCell.dataset.key || '';
        navigator.clipboard.writeText(k);
        btn.textContent = '已复制';
        setTimeout(() => btn.textContent = '复制键', 1000);
      };
      keyCell.appendChild(document.createTextNode(' '));
      keyCell.appendChild(btn);
    });
  }

  // 工具栏
  createToolbar(keys,
    applyFilter,
    () => exportCSV(rows, SUPPORTED_LANGUAGES),
    () => {}
  );

  applyFilter({ query: '', category: 'all' });
}

// 启动
addStyles();
const keys = buildUnionKeySet();
renderTable(keys);
// 语言变化轮询刷新（仅单语言模式）
let lastLang = getCurrLanguage();
setInterval(() => {
  const curr = getCurrLanguage();
  if (curr !== lastLang && mode === 'single') {
    lastLang = curr;
    renderTable(keys);
  } else {
    lastLang = curr;
  }
}, 500);