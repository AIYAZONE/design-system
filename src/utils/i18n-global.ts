/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 11:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 10:02:18
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\utils\i18n-global.ts
 * @Description: 全局i18n初始化和配置
 */

import { setLanguage, getCurrentLanguage, t } from './i18n';
import type { Language } from '../types/i18n.types';

// 标记i18n是否已初始化
let isI18nInitialized = false;

// 导出全局i18n函数，供所有组件使用
export const globalI18n = {
  t: (key: string, params?: Record<string, string | number>): string => {
    // 如果i18n未初始化完成，返回空字符串
    if (!isI18nInitialized) return '';
    return t(key, params);
  },
  getCurrentLanguage,
  setLanguage,
};

// 初始化全局i18n配置
export function initializeI18n() {
  // 从localStorage或其他配置中获取初始语言
  const initialLang = localStorage.getItem('language') as Language || 'en';

  // 设置初始语言
  setLanguage(initialLang);

  // 监听语言变化事件，保存到localStorage
  window.addEventListener('i18n-language-change', (event: Event) => {
    const lang = (event as CustomEvent<Language>).detail;
    localStorage.setItem('language', lang);
  });

  // 标记初始化完成
  isI18nInitialized = true;
}

// 初始化i18n配置
initializeI18n();

// 在全局对象上挂载i18n实例
window.i18n = globalI18n;