import { t, getCurrentLanguage, setLanguage, initialize } from './core';
import { initI18nDom } from './dom';
import { I18nController } from './controller';
import type { I18nInstance } from './types';

// 全局初始化
const globalI18n: I18nInstance = {
  t,
  getCurrentLanguage,
  setLanguage
};

// 只在这里初始化全局实例
if (typeof window !== 'undefined') {
  window.i18n = globalI18n;
}

export function useI18n(): I18nInstance {
  return globalI18n;
}

// 具体导出需要的功能
export {
  t,
  getCurrentLanguage,
  setLanguage,
  initialize,
  initI18nDom,
  I18nController,
  type I18nInstance
};