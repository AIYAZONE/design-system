import en from '../locales/en.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';
import { Language, MessageSchema,I18nInstance, I18nConfig, I18nError } from '../types';

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

// LRU缓存实现
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// 核心翻译功能实现
const messages: Record<Language, MessageSchema> = { en, zh, ja };
let currentLanguage: Language = config.defaultLanguage || 'en';
const translationCache = new LRUCache<string, string>(config.cacheSize || 1000);
const PARAM_REGEX = /\{([^}]+)\}/g;

/*
 * 获取当前语言
*/
export function getCurrentLanguage(): Language {
  return currentLanguage;
}

/*
 * 设置当前语言
*/
export function setLanguage(lang: Language): void {
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
          config?.errorHandler?.({
            type: 'MISSING_KEY',
            key,
            message: `Translation key not found: ${key}`
          });
          return key;
        }
      } else {
        config?.errorHandler?.({
          type: 'MISSING_KEY',
          key,
          message: `Translation key not found: ${key}`
        });
        return key;
      }
    }

    let result = value;
    if (params) {
      result = value.replace(PARAM_REGEX, (_match: string, k: string) => {
        if (!(k in params)) {
          config?.errorHandler?.({
            type: 'INVALID_PARAMS',
            key,
            message: `Missing parameter: ${k}`,
            params
          });
          return `{${k}}`;
        }
        return String(params[k]);
      });
    }

    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    config?.errorHandler?.({
      type: 'INTERNAL_ERROR',
      key,
      message: error instanceof Error ? error.message : 'Unknown error',
      params
    });
    return key;
  }
}

// 全局初始化
const globalI18n: I18nInstance = {
  t,
  getCurrentLanguage,
  setLanguage
};

export function useI18n(): I18nInstance {
  return globalI18n;
}
/*
 * 初始化函数
*/
export function initialize() {
  const savedLanguage = localStorage.getItem('language');
  const languageToUse = (savedLanguage as Language) || config.defaultLanguage;

  if (Object.keys(messages).includes(languageToUse) && config.defaultLanguage) {
    setLanguage(languageToUse);
  } else {
    setLanguage(config.defaultLanguage || 'en');
  }

  window.addEventListener(I18N_LANGUAGE_CHANGE, (event: Event) => {
    const lang = (event as CustomEvent<Language>).detail;
    localStorage.setItem('language', lang);
  });

  // 将 i18n 功能绑定到 window 对象
  if (typeof window !== 'undefined') {
    window.i18n = globalI18n;
  }
}
