import { t, getCurrLanguage, setCurrLanguage, useI18n, initialize, normalizeLanguage } from './core/index.js';
import { initI18nDom } from './core/dom';
import { I18nController } from './core/controller';
import { I18nInstance } from './types/index'
import { i18n } from './decorators';
import { SUPPORTED_LANGUAGES, Language, getSupportedLanguages, isLanguageSupported } from './types/languages';
import { ZoneI18n } from './components/zone-i18n';

/**
 * 扩展Window接口，添加全局i18n实例
 */
declare global {
  interface Window {
    /**
     * 全局i18n实例
     */
    i18n: I18nInstance;
  }
}

// 自动初始化 i18n
initialize();
initI18nDom();

// 具体导出需要的功能
export {
  ZoneI18n,
  t,
  getCurrLanguage,
  setCurrLanguage,
  useI18n,
  initialize,
  initI18nDom,
  I18nController,
  i18n,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  getSupportedLanguages,
  isLanguageSupported,
  type Language,
  type I18nInstance
};
