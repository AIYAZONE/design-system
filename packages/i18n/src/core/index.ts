// 类型导入
import { I18nInstance, I18nError } from '../types';
import { Language, SUPPORTED_LANGUAGES, messages } from '../types/languages';

// 配置和工具导入
import { config, I18N_LANGUAGE_CHANGE } from './config';
import { LRUCache } from '../utils/cache';
import { getCookie, setCookie } from '../utils/cookie';

// 常量定义
const PARAM_REGEX = /\{([^}]+)\}/g;

// 核心状态
let currentLanguage: Language = config.defaultLanguage || 'en';
const translationCache = new LRUCache<string, string>(config.cacheSize || 1000);

/**
 * 错误处理函数
 * @param error - 错误信息对象，包含错误类型、键值和消息
 * @returns 错误键值，用于显示给用户
 */
function handleTranslationError(error: I18nError): string {
  config?.errorHandler?.(error);
  return error.key;
}

/**
 * 获取当前语言
 * @returns 当前设置的语言标识
 */
export function getCurrLanguage(): Language {
  return currentLanguage;
}

/**
 * 设置当前语言
 * @param lang - 要设置的目标语言标识
 * @description 更新当前语言，清除缓存并触发语言变更事件
 */
export function setCurrLanguage(lang: Language): void {
  if (currentLanguage === lang) return;
  currentLanguage = lang;
  translationCache.clear();
  window.dispatchEvent(new CustomEvent(I18N_LANGUAGE_CHANGE, { detail: lang }));
}

/**
 * 翻译函数
 * @param key - 翻译键，支持点号分隔的嵌套键值，如 'common.button.submit'
 * @param params - 替换参数对象，用于替换翻译文本中的占位符，如 {name: 'John'}
 * @returns 翻译后的文本，如果翻译失败则返回键值
 * @description 支持缓存、嵌套键值、参数替换和错误处理
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  lang?: Language
): string {
  const effectiveLang = lang ?? currentLanguage;
  const cacheKey = params
    ? `${key}:${JSON.stringify(params)}:${effectiveLang}`
    : `${key}:${effectiveLang}`;
  try {
    const cachedTranslation = translationCache.get(cacheKey);
    if (cachedTranslation) return cachedTranslation;

    const keys = key.split('.');
    let value: any = messages[effectiveLang];

    value = keys.reduce((obj, k) => (obj && typeof obj === 'object' ? obj[k] : undefined), value);

    if (typeof value !== 'string') {
      if (effectiveLang !== config.fallbackLanguage) {
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

/**
 * 全局i18n实例
 * @description 提供全局可访问的i18n功能实例
 */
const globalI18n: I18nInstance = {
  t,
  getCurrLanguage,
  setCurrLanguage
};

/**
 * 获取i18n实例
 * @returns i18n实例，包含翻译和语言管理功能
 * @description 用于在组件中获取i18n功能实例
 */
export function useI18n(): I18nInstance {
  return globalI18n;
}

/**
 * 将任意语言标识归一化为系统支持的语言代码
 * @param input - 可能为 HTML `lang` 属性、地区码（en-US）、别名（jp）等
 * @returns 系统支持的语言代码，无法识别时回退到 fallbackLanguage
 * @description 兼容以下情况：
 *  - 直接匹配：'en' / 'zh-CN' / 'ja' ...
 *  - 地区后缀：'en-US' / 'zh-Hans' -> 取基础码
 *  - 繁简中文别名：'zh-Hans' -> 'zh-CN'，'zh-Hant' / 'zh-HK' -> 'zh-TW'
 *  - 日语别名：'jp' -> 'ja'
 */
const LANG_CANON = new Map<string, Language>(
  SUPPORTED_LANGUAGES.map((lang) => [lang.toLowerCase(), lang])
);

const LANG_ALIASES: Record<string, Language> = {
  'zh-hans': 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh-sg': 'zh-CN',
  'zh-hant': 'zh-TW',
  'zh-tw': 'zh-TW',
  'zh-hk': 'zh-TW',
  'zh-mo': 'zh-TW',
  jp: 'ja',
};

export function normalizeLanguage(input?: string): Language {
  const fallback: Language = (config.fallbackLanguage as Language) || 'en';
  if (!input) return fallback;
  const raw = input.trim().toLowerCase();
  if (LANG_CANON.has(raw)) return LANG_CANON.get(raw)!;
  if (LANG_ALIASES[raw]) return LANG_ALIASES[raw];
  const base = raw.split('-')[0];
  if (LANG_CANON.has(base)) return LANG_CANON.get(base)!;
  return fallback;
}

/**
 * 初始化i18n系统
 * @description 初始化i18n系统，设置默认语言，绑定事件监听，并挂载全局实例
 */
export function initialize(): void {
  const savedLanguage = getCookie('jds-language') as Language;
  const languageToUse = savedLanguage || config.defaultLanguage || 'en';

  setCurrLanguage(languageToUse);

  window.addEventListener(I18N_LANGUAGE_CHANGE, (event: Event) => {
    const lang = (event as CustomEvent<Language>).detail;
    setCookie('jds-language', lang);
  });

  if (typeof window !== 'undefined') {
    (window as any).i18n = globalI18n;
  }
}
