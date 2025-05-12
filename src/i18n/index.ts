import { t, getCurrLanguage, setCurrLanguage, useI18n, initialize } from './core/index.js';
import { initI18nDom } from './core/dom';
import { I18nController } from './core/controller';
import { I18nInstance } from './types/index'

// 具体导出需要的功能
export {
  t,
  getCurrLanguage,
  setCurrLanguage,
  useI18n,
  initialize,
  initI18nDom,
  I18nController,
  type I18nInstance
};