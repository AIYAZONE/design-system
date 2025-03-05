/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 11:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 11:33:54
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\utils\i18n.ts
 * @Description: i18n核心实现
 */

import en from '../locales/en.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';
import { Language, MessageSchema, I18nInstance } from '../types/i18n.types';

// 定义错误类型
type I18nError = {
  type: 'MISSING_KEY' | 'INVALID_PARAMS' | 'INTERNAL_ERROR';
  key: string;
  message: string;
  params?: Record<string, string | number>;
};

// 错误处理函数类型
type ErrorHandler = (error: I18nError) => void;

// 配置接口
interface I18nConfig {
  defaultLanguage?: Language;
  fallbackLanguage?: Language;
  errorHandler?: ErrorHandler;
  cacheSize?: number;
}

// 语言变化事件名称
const I18N_LANGUAGE_CHANGE = 'i18n-language-change';

// 配置对象
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  cacheSize: 1000,
  errorHandler: (error: I18nError) => {
    console.warn(`[i18n] ${error.type}: ${error.message}`, error);
  }
};

// 当前语言
let _currentLanguage: Language = config.defaultLanguage || 'en';

const messages: Record<Language, MessageSchema> = {
  en,
  zh,
  ja,
};

// 缓存正则表达式以提高性能
const I18N_PATTERN = /\$\{window\.i18n\.t\(['"](.*?)['"](?:,\s*([^)]+))?\)\}/g;
const PARAM_REGEX = /\{([^}]+)\}/g;

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
      // 刷新位置
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      // 删除最早的项
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

// 翻译缓存
const translationCache = new LRUCache<string, string>(config.cacheSize || 1000);

// 导出一个getter函数来获取当前语言
export function getCurrentLanguage(): Language {
  return _currentLanguage;
}

// 用于更新DOM中的i18n文本
function updateI18nTextNodes() {
  let observer: MutationObserver | null = null;

  function processTextNode(node: Text): void {
    const text = node.textContent;
    if (!text || !text.includes('${window.i18n.t(')) return;

    const updatedText = text.replace(I18N_PATTERN, (_match, key, paramsStr) => {
      try {
        let params = {};
        if (paramsStr) {
          try {
            params = Function(`return ${paramsStr}`)();
          } catch (e) {
            console.warn(`无效的参数，key: ${key}`, e);
          }
        }
        return t(key, params);
      } catch (error) {
        console.warn(`翻译失败，key: ${key}`, error);
        return key;
      }
    });

    if (text !== updatedText) {
      node.textContent = updatedText;
    }
  }

  function processElement(element: HTMLElement): void {
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      processTextNode(node);
    }
  }

  function initObserver(): void {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              processElement(node as HTMLElement);
            } else if (node.nodeType === Node.TEXT_NODE) {
              processTextNode(node as Text);
            }
          });
        } else if (mutation.type === 'characterData' &&
                  mutation.target.nodeType === Node.TEXT_NODE) {
          processTextNode(mutation.target as Text);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // 初始化处理
  if (document.body) {
    processElement(document.body);
    initObserver();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      processElement(document.body);
      initObserver();
    }, { once: true });
  }

  return () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

/**
 * 设置当前语言
 * @param lang 要设置的语言
 */
export function setLanguage(lang: Language): void {
  if (_currentLanguage === lang) return;

  _currentLanguage = lang;
  translationCache.clear(); // 清除缓存
  updateI18nTextNodes();
  window.dispatchEvent(new CustomEvent(I18N_LANGUAGE_CHANGE, { detail: lang }));
}

/**
 * 翻译函数
 * @param key 翻译键
 * @param params 替换参数
 * @returns 翻译后的文本
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const cacheKey = params ? `${key}:${JSON.stringify(params)}` : key;
  try {
    // 检查缓存
    const cachedTranslation = translationCache.get(cacheKey);
    if (cachedTranslation) return cachedTranslation;

    const keys = key.split('.');
    let value: any = messages[_currentLanguage];

    value = keys.reduce((obj, k) => (obj && typeof obj === 'object' ? obj[k] : undefined), value);

    if (typeof value !== 'string') {
      // 尝试使用备用语言
      if (_currentLanguage !== config.fallbackLanguage) {
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
          // 确保 errorHandler 存在再调用
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

    // 缓存翻译结果
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
// 定义接口
interface I18nControllerInterface {
  hostDisconnected(): void;
  t(key: string, params?: Record<string, string | number>): string;
  readonly currentLanguage: Language;
}

// 实现接口
export class I18nController implements I18nControllerInterface {
  private host: HTMLElement;
  private onLanguageChange: () => void;
  private isConnected: boolean = false;
  constructor(host: HTMLElement) {
    this.host = host;
    this.onLanguageChange = () => {
      if (!this.isConnected) return;
      if ('requestUpdate' in this.host && typeof this.host.requestUpdate === 'function') {
        this.host.requestUpdate();
      }
    };
  this.connect();
  }
  private connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    window.addEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
  }
  public hostDisconnected(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    window.removeEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
  }
  public t(key: string, params?: Record<string, string | number>): string {
    return t(key, params);
  }
  public get currentLanguage(): Language {
    return _currentLanguage;
  }
}
// 初始化全局i18n实例
window.i18n = {
  t,
  getCurrentLanguage,
  setLanguage,
};

/**
 * 创建一个I18n实例，保持与Vue版本API兼容
 */
export function useI18n(): I18nInstance {
  return window.i18n;
}