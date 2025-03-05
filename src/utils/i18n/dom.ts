import { t } from './core';
import { I18N_LANGUAGE_CHANGE } from './core';

const ORIGINAL_TEXT_ATTR = 'data-i18n-key';
const I18N_PATTERN = /\$\{window\.i18n\.t\(['"](.*?)['"](?:,\s*([^)]+))?\)\}/g;

function processTextNode(node: Text): void {
  const text = node.textContent;
  if (!text || !text.includes('${window.i18n.t(')) return;

  const updatedText = text.replace(I18N_PATTERN, (_match, key, paramsStr) => {
    try {
      let params = {};
      if (paramsStr) {
        try {
          params = Function(`return ${paramsStr}`)();
        } catch (e) {
          console.warn(`无效的参数，key: ${key}`, e);
        }
      }
      return t(key, params);
    } catch (error) {
      console.warn(`翻译失败，key: ${key}`, error);
      return key;
    }
  });

  if (text !== updatedText) {
    node.textContent = updatedText;
  }
}

function updateElementTranslation(element: HTMLElement) {
  const key = element.getAttribute(ORIGINAL_TEXT_ATTR);
  if (key) {
    element.textContent = t(key);
  }
}

function updateAllTranslations() {
  const elements = document.querySelectorAll(`[${ORIGINAL_TEXT_ATTR}]`);
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      updateElementTranslation(element);
    }
  });
}

export function initI18nDom() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' &&
          mutation.attributeName === ORIGINAL_TEXT_ATTR &&
          mutation.target instanceof HTMLElement) {
        updateElementTranslation(mutation.target);
      } else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute(ORIGINAL_TEXT_ATTR)) {
              updateElementTranslation(node);
            }
            const childElements = node.querySelectorAll(`[${ORIGINAL_TEXT_ATTR}]`);
            childElements.forEach(element => {
              if (element instanceof HTMLElement) {
                updateElementTranslation(element);
              }
            });
          } else if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node as Text);
          }
        });
      }
    });
  });

  const observerConfig = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: [ORIGINAL_TEXT_ATTR]
  };
  function processAllTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    processTextNode(node);
  }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, observerConfig);
      updateAllTranslations();
      processAllTextNodes(); // 添加对所有文本节点的处理
    });
  } else {
    observer.observe(document.body, observerConfig);
    updateAllTranslations();
    processAllTextNodes(); // 添加对所有文本节点的处理
  }
  // 语言变化时重新处理所有节点
  window.addEventListener(I18N_LANGUAGE_CHANGE, () => {
    updateAllTranslations();
    processAllTextNodes();
  });
  return () => observer.disconnect();
}