/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 18:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 10:03:40
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\utils\i18n-dom.ts
 * @Description: i18n在非Lit组件环境下的DOM支持
 */

import { t } from './i18n';

// 用于存储原始文本的属性名
const ORIGINAL_TEXT_ATTR = 'data-i18n-key';

/**
 * 更新单个DOM元素的翻译
 * @param element 需要更新的DOM元素
 */
function updateElementTranslation(element: HTMLElement) {
  const key = element.getAttribute(ORIGINAL_TEXT_ATTR);
  if (key) {
    element.textContent = t(key);
  }
}

/**
 * 更新所有带有data-i18n-key属性的元素的翻译
 */
function updateAllTranslations() {
  const elements = document.querySelectorAll(`[${ORIGINAL_TEXT_ATTR}]`);
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      updateElementTranslation(element);
    }
  });
}

// 创建一个MutationObserver来监听DOM变化
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
        }
      });
    }
  });
});

// 配置观察器
const observerConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  attributeFilter: [ORIGINAL_TEXT_ATTR]
};

// 等待DOM加载完成后再启动观察器
document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.body, observerConfig);
  updateAllTranslations();
});

// 监听语言变化事件
window.addEventListener('i18n-language-change', () => {
  updateAllTranslations();
});

// 导出工具函数
export function initI18nDom() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllTranslations);
  } else {
    updateAllTranslations();
  }
}