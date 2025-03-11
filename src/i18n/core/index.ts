import { I18nInstance } from '../types';
import { config, I18N_LANGUAGE_CHANGE } from './config';
import { LRUCache } from '../utils/cache';
import { Language,messages } from '../types/languages';
import { getCookie, setCookie } from '../../utils/common';

// 核心翻译功能实现
let currentLanguage: Language = config.defaultLanguage || 'en';
const translationCache = new LRUCache<string, string>(config.cacheSize || 1000);
const PARAM_REGEX = /\{([^}]+)\}/g;

// 错误处理函数
function handleTranslationError(error: {
  type: "MISSING_KEY" | "INVALID_PARAMS" | "INTERNAL_ERROR";
  key: string;
  message: string;
  params?: Record<string, string | number>
}) {
  config?.errorHandler?.(error);
  return error.key;
}

/*
 * 获取当前语言
*/
export function getCurrLanguage(): Language {
  return currentLanguage;
}

/*
 * 设置当前语言
*/
export function setCurrLanguage(lang: Language): void {
  if (currentLanguage === lang) return;
  currentLanguage = lang;
  translationCache.clear();
  window.dispatchEvent(new CustomEvent(I18N_LANGUAGE_CHANGE, { detail: lang }));
}

/*
 * 翻译函数
*/
export function t(key: string, params?: Record<string, string | number>): string {
  const cacheKey = params ? `${key}:${JSON.stringify(params)}` : key;
  try {
    const cachedTranslation = translationCache.get(cacheKey);
    if (cachedTranslation) return cachedTranslation;

    const keys = key.split('.');
    let value: any = messages[currentLanguage];

    value = keys.reduce((obj, k) => (obj && typeof obj === 'object' ? obj[k] : undefined), value);

    if (typeof value !== 'string') {
      if (currentLanguage !== config.fallbackLanguage) {
        const fallbackValue = keys.reduce(
          (obj: any, k: string) => (obj && typeof obj === 'object' ? obj[k] : undefined),
          messages[config.fallbackLanguage || 'en']
        );
        if (fallbackValue !== undefined && typeof fallbackValue === 'string') {
          value = fallbackValue;
        } else {
          return handleTranslationError({
            type: 'MISSING_KEY',
            key,
            message: `Translation key not found: ${key}`
          });
        }
      } else {
        return handleTranslationError({
          type: 'MISSING_KEY',
          key,
          message: `Translation key not found: ${key}`
        });
      }
    }

    let result = value;
    if (params) {
      result = value.replace(PARAM_REGEX, (_match: string, k: string) => {
        if (!(k in params)) {
          return handleTranslationError({
            type: 'INVALID_PARAMS',
            key,
            message: `Missing parameter: ${k}`,
            params
          });
        }
        return String(params[k]);
      });
    }

    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    return handleTranslationError({
      type: 'INTERNAL_ERROR',
      key,
      message: error instanceof Error ? error.message : 'Unknown error',
      params
    });
  }
}

// 全局初始化
const globalI18n: I18nInstance = {
  t,
  getCurrLanguage,
  setCurrLanguage
};

export function useI18n(): I18nInstance {
  return globalI18n;
}

/*
 * 初始化函数
*/
export function initialize() {
  const savedLanguage = getCookie('jds-language') as Language;
  const languageToUse = savedLanguage || config.defaultLanguage || 'en';

  setCurrLanguage(languageToUse);

  window.addEventListener(I18N_LANGUAGE_CHANGE, (event: Event) => {
    const lang = (event as CustomEvent<Language>).detail;
    setCookie('jds-language', lang);
  });

  if (typeof window !== 'undefined') {
    window.i18n = globalI18n;
  }
}
