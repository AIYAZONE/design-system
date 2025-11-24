import { t } from '.';
import { I18N_LANGUAGE_CHANGE } from './config';

// 自定义属性名
const ORIGINAL_TEXT_ATTR = 'data-i18n-key';
const PARAMS_ATTR = 'data-i18n-params';

// 匹配 ${window.i18n.t('key', params)} 的正则表达式
const I18N_PATTERN = /\$\{window\.i18n\.t\(['"](.*?)['"](?:,\s*([^)]+))?\)\}/g;

// 处理文本节点（跳过 <pre>/<code> 内部）
function processTextNode(node: Text): void {
  let p: Node | null = node.parentNode;
  while (p) {
    if (p.nodeType === Node.ELEMENT_NODE) {
      const tag = (p as Element).tagName;
      if (tag === 'PRE' || tag === 'CODE') return;
    }
    p = p.parentNode;
  }

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

// 更新元素的翻译
function updateElementTranslation(element: HTMLElement) {
  const key = element.getAttribute(ORIGINAL_TEXT_ATTR);
  if (!key) return;

  try {
    // 获取并解析参数
    const paramsAttr = element.getAttribute(PARAMS_ATTR);
    let params = {};

    if (paramsAttr) {
      try {
        params = JSON.parse(paramsAttr);
      } catch (e) {
        console.warn(`无效的参数格式，key: ${key}`, e);
      }
    }

    element.textContent = t(key, params);
  } catch (error) {
    console.warn(`翻译更新失败，key: ${key}`, error);
    element.textContent = key;
  }
}

// 更新所有元素的翻译
function updateAllTranslations() {
  const elements = document.querySelectorAll(`[${ORIGINAL_TEXT_ATTR}]`);
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      updateElementTranslation(element);
    }
  });
}

// 初始化i18n dom
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
    attributeFilter: [ORIGINAL_TEXT_ATTR, PARAMS_ATTR] // 添加对参数属性的监听
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