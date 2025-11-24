/**
 * i18n-table.js
 * 为国际化多语言表格提供增强功能
 */

import { messages } from '@jackery/i18n/types/languages';

document.addEventListener('DOMContentLoaded', function() {
  fetchTranslationData();
});

function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function createToolbar() {
  const container = document.createElement('div');
  container.className = 'tools-container';
  container.style.marginBottom = '10px';

  const searchInput = document.createElement('input');
  searchInput.id = 'searchInput';
  searchInput.placeholder = '搜索翻译键或文案...';
  searchInput.style.width = '100%';
  searchInput.style.padding = '5px';
  searchInput.style.boxSizing = 'border-box';
  searchInput.oninput = debounce(filterTable, 300);
  container.appendChild(searchInput);

  const table = document.querySelector('table');
  table.parentNode.insertBefore(container, table);
}

function filterTable() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const table = document.querySelector('table');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const key = row.cells[0].textContent.toLowerCase();
    const text = row.cells[1].textContent.toLowerCase();
    const code = row.cells[2].textContent.toLowerCase();
    row.style.display = (key.includes(filter) || text.includes(filter) || code.includes(filter)) ? '' : 'none';
  });
}

function createCategoryButtons(categories) {
  const container = document.createElement('div');
  container.className = 'category-buttons';

  const allButton = document.createElement('button');
  allButton.textContent = '全部';
  allButton.className = 'active';
  allButton.onclick = () => {
    setActiveButton(allButton);
    filterByCategory('all');
  };
  container.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.onclick = () => {
      setActiveButton(button);
      filterByCategory(category);
    };
    container.appendChild(button);
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.parentNode.insertBefore(container, searchInput.nextSibling);
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('.category-buttons button');
  buttons.forEach(button => button.classList.remove('active'));
  activeButton.classList.add('active');
}

function filterByCategory(category) {
  const table = document.querySelector('table');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const key = row.cells[0].textContent;
    row.style.display = (category === 'all' || key.startsWith(category + '.')) ? '' : 'none';
  });
}

let sortDirection = 'asc';

function sortTable(table) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const sortIcon = table.querySelector('th:first-child span:last-child');
  sortIcon.innerHTML = sortDirection === 'asc' ? '↓' : '↑';
  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

  rows.sort((a, b) => {
    const keyA = a.cells[0].textContent.trim();
    const keyB = b.cells[0].textContent.trim();
    return sortDirection === 'asc' ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
  });

  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  rows.forEach(row => tbody.appendChild(row));
  addCopyButtons();
}

function addCopyButtons() {
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const existingButton = row.querySelector('.copy-btn');
    if (existingButton) existingButton.remove();
    const keyCell = row.cells[0];
    const key = keyCell.textContent;

    const copyButton = document.createElement('button');
    copyButton.textContent = '复制';
    copyButton.className = 'copy-btn';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(key);
      copyButton.textContent = '已复制';
      setTimeout(() => { copyButton.textContent = '复制'; }, 1000);
    };

    keyCell.appendChild(document.createTextNode(' '));
    keyCell.appendChild(copyButton);
  });
}

async function fetchTranslationData() {
  showLoadingState();
  try {
    const flattenedData = flattenObject(messages['en']);
    generateTable(flattenedData);
  } catch (error) {
    hideLoadingState();
    showErrorMessage(`加载翻译数据失败: ${error.message}`);
  }
}

function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    return acc;
  }, {});
}

function showLoadingState() {
  const existingError = document.querySelector('.error-message');
  if (existingError) existingError.remove();
  const existingLoading = document.querySelector('.loading-message');
  if (existingLoading) existingLoading.remove();
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'loading-message';
  loadingMsg.textContent = '正在加载翻译数据...';
  loadingMsg.style.padding = '10px';
  loadingMsg.style.margin = '10px 0';
  loadingMsg.style.backgroundColor = '#f8f9fa';
  loadingMsg.style.borderLeft = '4px solid #FD5000';
  const container = document.querySelector('body');
  const i18nChange = document.querySelector('jds-i18n-change');
  if (i18nChange && i18nChange.parentNode === container) {
    container.insertBefore(loadingMsg, i18nChange.nextSibling);
  } else {
    container.appendChild(loadingMsg);
  }
}

function hideLoadingState() {
  const loadingMsg = document.querySelector('.loading-message');
  if (loadingMsg) loadingMsg.remove();
}

function showErrorMessage(message) {
  const existingError = document.querySelector('.error-message');
  if (existingError) existingError.remove();
  const errorMsg = document.createElement('div');
  errorMsg.className = 'error-message';
  errorMsg.textContent = message;
  errorMsg.style.padding = '10px';
  errorMsg.style.margin = '10px 0';
  errorMsg.style.backgroundColor = '#fff8f8';
  errorMsg.style.borderLeft = '4px solid #ff3333';
  errorMsg.style.color = '#cc0000';
  const container = document.querySelector('body');
  const i18nChange = document.querySelector('jds-i18n-change');
  if (i18nChange && i18nChange.parentNode === container) {
    container.insertBefore(errorMsg, i18nChange.nextSibling);
  } else {
    container.appendChild(errorMsg);
  }
  const retryButton = document.createElement('button');
  retryButton.textContent = '重试';
  retryButton.style.marginLeft = '10px';
  retryButton.style.padding = '4px 8px';
  retryButton.style.backgroundColor = '#FD5000';
  retryButton.style.color = 'white';
  retryButton.style.border = 'none';
  retryButton.style.borderRadius = '4px';
  retryButton.style.cursor = 'pointer';
  retryButton.onclick = fetchTranslationData;
  errorMsg.appendChild(retryButton);
}

function addTableStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .table-container { margin: 20px; font-family: Arial, sans-serif; }
    .tools-container { margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 5px; overflow: hidden; }
    th { background-color: #f2f2f2; padding: 12px 15px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd; }
    td { padding: 10px 15px; border-bottom: 1px solid #ddd; }
    tr:hover { background-color: #f5f5f5; }
    .copy-btn { background-color: #4CAF50; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; margin: 2px 2px; cursor: pointer; border-radius: 3px; }
    .copy-btn:hover { background-color: #45a049; }
    .loading-container, .error-container { padding: 20px; text-align: center; margin: 20px; border-radius: 5px; }
    .loading-container { background-color: #e8f4f8; border: 1px solid #b8daff; }
    .error-container { background-color: #f8d7da; border: 1px solid #f5c6cb; }
    .retry-btn { background-color: #dc3545; color: white; border: none; padding: 8px 16px; margin-top: 10px; cursor: pointer; border-radius: 4px; }
    .retry-btn:hover { background-color: #c82333; }
  `;
  document.head.appendChild(style);
}

function generateTable(data) {
  hideLoadingState();
  const body = document.querySelector('body');
  const existingContainer = document.querySelector('.table-container');
  if (existingContainer) existingContainer.remove();
  const container = document.createElement('div');
  container.className = 'table-container';
  const i18nChange = document.querySelector('jds-i18n-change');
  if (i18nChange && i18nChange.parentNode === body) {
    body.insertBefore(container, i18nChange.nextSibling);
  } else {
    body.appendChild(container);
  }

  const table = document.createElement('table');
  table.id = 'translationTable';
  const thead = document.createElement('thead');
  thead.style.position = 'sticky';
  thead.style.top = '-1px';
  thead.style.zIndex = '1';
  thead.style.background = '#fff';
  const headerRow = document.createElement('tr');
  const keyHeader = document.createElement('th');
  keyHeader.style.cursor = 'pointer';
  const keyHeaderContent = document.createElement('div');
  keyHeaderContent.style.display = 'flex';
  keyHeaderContent.style.alignItems = 'center';
  keyHeaderContent.style.justifyContent = 'space-between';
  const keyHeaderText = document.createElement('span');
  keyHeaderText.textContent = '翻译键';
  keyHeaderContent.appendChild(keyHeaderText);
  const sortIcon = document.createElement('span');
  sortIcon.innerHTML = '↕️';
  sortIcon.style.fontSize = '14px';
  sortIcon.style.marginLeft = '5px';
  keyHeaderContent.appendChild(sortIcon);
  keyHeader.appendChild(keyHeaderContent);
  keyHeader.onclick = () => sortTable(table);
  const valueHeader = document.createElement('th');
  valueHeader.textContent = '文案';
  const codeHeader = document.createElement('th');
  codeHeader.textContent = '代码';
  headerRow.appendChild(keyHeader);
  headerRow.appendChild(valueHeader);
  headerRow.appendChild(codeHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  const categories = new Set();
  Object.entries(data).forEach(([key, value]) => {
    const category = key.split('.')[0];
    categories.add(category);
    const row = document.createElement('tr');
    const keyCell = document.createElement('td');
    keyCell.textContent = key;
    row.appendChild(keyCell);
    const valueCell = document.createElement('td');
    const i18nElement = document.createElement('jds-i18n');
    i18nElement.setAttribute('key', key);
    if (typeof value === 'string' && value.includes('{')) {
      const paramMatches = value.match(/\{([^}]+)\}/g);
      if (paramMatches) {
        const params = {};
        paramMatches.forEach(match => {
          const paramName = match.replace(/[{}]/g, '');
          params[paramName] = `{${paramName}}`;
        });
        i18nElement.setAttribute('params', JSON.stringify(params));
      }
    }
    valueCell.appendChild(i18nElement);
    row.appendChild(valueCell);
    const codeCell = document.createElement('td');
    const codeContainer = document.createElement('div');
    codeContainer.style.position = 'relative';
    codeContainer.style.display = 'flex';
    codeContainer.style.flexDirection = 'column';
    const codeExample = document.createElement('code');
    codeExample.style.display = 'block';
    codeExample.style.padding = '8px';
    codeExample.style.paddingRight = '40px';
    codeExample.style.backgroundColor = '#f5f5f5';
    codeExample.style.border = '1px solid #ddd';
    codeExample.style.borderRadius = '4px';
    codeExample.style.fontFamily = 'monospace';
    codeExample.style.whiteSpace = 'pre';
    codeExample.style.overflowX = 'auto';
    let codeText = `<jds-i18n key="${key}"></jds-i18n>`;
    if (typeof value === 'string' && value.includes('{')) {
      const paramMatches = value.match(/\{([^}]+)\}/g);
      if (paramMatches) {
        const params = {};
        paramMatches.forEach(match => {
          const paramName = match.replace(/[{}]/g, '');
          params[paramName] = `{${paramName}}`;
        });
        codeText = `<jds-i18n key="${key}" params='${JSON.stringify(params)}'></jds-i18n>`;
      }
    }
    codeExample.textContent = codeText;
    codeContainer.appendChild(codeExample);
    const copyCodeButton = document.createElement('button');
    copyCodeButton.textContent = '复制';
    copyCodeButton.className = 'copy-btn';
    copyCodeButton.style.position = 'absolute';
    copyCodeButton.style.right = '5px';
    copyCodeButton.style.top = '5px';
    copyCodeButton.style.padding = '3px 8px';
    copyCodeButton.style.fontSize = '12px';
    copyCodeButton.onclick = () => {
      navigator.clipboard.writeText(codeText);
      copyCodeButton.textContent = '已复制';
      setTimeout(() => { copyCodeButton.textContent = '复制'; }, 1000);
    };
    codeContainer.appendChild(copyCodeButton);
    codeCell.appendChild(codeContainer);
    row.appendChild(codeCell);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  container.appendChild(table);
  createToolbar();
  addCopyButtons();
  if (categories.size > 0) createCategoryButtons([...categories]);
  addCopyButtons();
}