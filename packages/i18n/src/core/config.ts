import { I18nConfig, I18nError } from '../types';

// 语言变化事件名称
export const I18N_LANGUAGE_CHANGE = 'i18n-language-change';

// 配置对象
export const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  cacheSize: 1000,
  errorHandler: (error: I18nError) => {
    console.warn(`[i18n] ${error.type}: ${error.message}`, error);
  }
};