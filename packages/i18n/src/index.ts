import { t, getCurrLanguage, setCurrLanguage, useI18n, initialize } from './core/index.js';
import { initI18nDom } from './core/dom';
import { I18nController } from './core/controller';
import { I18nInstance } from './types/index'
import { i18n } from './decorators';
import { SUPPORTED_LANGUAGES, Language, getSupportedLanguages, isLanguageSupported } from './types/languages';

// 具体导出需要的功能
export {
  t,
  getCurrLanguage,
  setCurrLanguage,
  useI18n,
  initialize,
  initI18nDom,
  I18nController,
  i18n,
  SUPPORTED_LANGUAGES,
  getSupportedLanguages,
  isLanguageSupported,
  type Language,
  type I18nInstance
};