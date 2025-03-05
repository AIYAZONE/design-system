/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 11:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-04 17:59:18
 * @Description: HTML模板解析器，用于处理i18n表达式
 */

import { t } from './i18n';

// 匹配${window.i18n.t('key')}格式的正则表达式
const I18N_TEMPLATE_REGEX = /\$\{window\.i18n\.t\(['"](.*?)['"](?:,\s*({.*?}))?\)\}/g;

/**
 * 解析并更新DOM中的i18n表达式
 * @param element 要处理的DOM元素
 */
export function parseAndUpdateI18nTemplates(element: HTMLElement): void {
  // 遍历所有文本节点
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent || '';
    if (I18N_TEMPLATE_REGEX.test(text)) {
      // 重置正则表达式的lastIndex
      I18N_TEMPLATE_REGEX.lastIndex = 0;

      // 替换所有匹配的i18n表达式
      const newText = text.replace(I18N_TEMPLATE_REGEX, (match, key, paramsStr) => {
        try {
          const params = paramsStr ? JSON.parse(paramsStr) : undefined;
          return t(key, params);
        } catch (error) {
          console.warn(`Failed to parse i18n template: ${match}`, error);
          return match;
        }
      });

      if (newText !== text) {
        node.textContent = newText;
      }
    }
  }
}

/**
 * 监听语言变化事件，更新所有i18n模板
 */
export default function initializeTemplateParser(): void {
  // 初始解析当前页面
  parseAndUpdateI18nTemplates(document.body);

  // 监听语言变化事件
  window.addEventListener('i18n-language-change', () => {
    parseAndUpdateI18nTemplates(document.body);
  });

  // 监听DOM变化，处理动态添加的内容
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          parseAndUpdateI18nTemplates(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}