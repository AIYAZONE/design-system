/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 11:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 10:02:18
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\utils\i18n.ts
 * @Description: i18n核心实现
 */

import en from '../locales/en.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';
import { Language, MessageSchema } from '../types/i18n.types';

// 语言变化事件名称
const I18N_LANGUAGE_CHANGE = 'i18n-language-change';

// 当前语言（默认为英语）
let _currentLanguage: Language = 'en';

const messages: Record<Language, MessageSchema> = {
  en,
  zh,
  ja,
};

// 缓存正则表达式以提高性能
const I18N_PATTERN = /\$\{window\.i18n\.t\(['"](.*?)['"](?:,\s*([^)]+))?\)\}/g;
const PARAM_REGEX = /\{([^}]+)\}/g;

// 缓存翻译结果
const translationCache = new Map<string, string>();

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
  try {
    // 如果没有参数且存在缓存，直接返回缓存的结果
    if (!params) {
      const cachedTranslation = translationCache.get(key);
      if (cachedTranslation) return cachedTranslation;
    }

    const keys = key.split('.');
    let value: any = messages[_currentLanguage];

    value = keys.reduce((obj, k) => (obj && typeof obj === 'object' ? obj[k] : undefined), value);

    if (typeof value !== 'string') {
      console.warn(`未找到翻译，key: ${key}`);
      return key;
    }

    let result = value;
    if (params) {
      result = value.replace(PARAM_REGEX, (_, k) => String(params[k] ?? `{${k}}`));
    } else {
      // 只缓存没有参数的翻译结果
      translationCache.set(key, value);
    }

    return result;
  } catch (error) {
    console.warn(`翻译失败，key: ${key}`, error);
    return key;
  }
}

/**
 * i18n控制器类，用于在Lit组件中管理国际化
 */
export class I18nController {
  private host: HTMLElement;
  private onLanguageChange: () => void;
  private isConnected: boolean = false;

  constructor(host: HTMLElement) {
    interface UpdateableElement extends HTMLElement {
      requestUpdate?: () => void;
    }

    this.host = host as UpdateableElement;
    this.onLanguageChange = () => {
      if (!this.isConnected) return;
      const updateableHost = this.host as UpdateableElement;
      if (typeof updateableHost.requestUpdate === 'function') {
        updateableHost.requestUpdate();
      }
    };

    this.connect();
  }

  /**
   * 连接控制器，开始监听语言变化事件
   */
  private connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    window.addEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
  }

  /**
   * 断开控制器，停止监听语言变化事件
   */
  public hostDisconnected(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    window.removeEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
  }

  /**
   * 翻译指定的键值
   * @param key 翻译键
   * @param params 替换参数
   * @returns 翻译后的文本
   */
  public t(key: string, params?: Record<string, string | number>): string {
    return t(key, params);
  }

  /**
   * 获取当前语言
   */
  public get currentLanguage(): Language {
    return _currentLanguage;
  }
}

/**
 * 创建一个I18n实例，保持与Vue版本API兼容
 */
export function useI18n() {
  return {
    currentLanguage: getCurrentLanguage(),
    t,
    setLanguage,
  };
}