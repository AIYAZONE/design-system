import { t, getCurrentLanguage, setLanguage,useI18n, initialize } from './core/index.js';
import { initI18nDom } from './core/dom';
import { I18nController } from './core/controller';

// 具体导出需要的功能
export {
  t,
  getCurrentLanguage,
  setLanguage,
  useI18n,
  initialize,
  initI18nDom,
  I18nController
};