/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-07 18:46:21
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-11 14:22:23
 * @FilePath: \AIYAZONE-F2E-Team\zone-design-system\src\i18n\core\controller.ts
 * @Description:
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { t, getCurrLanguage } from './index';
import { I18N_LANGUAGE_CHANGE } from './config';
import { Language } from '../types/languages';

/**
 * i18n控制器，用于自动翻译属性
 */
export class I18nController {
  private host: HTMLElement;
  private onLanguageChange: () => void;
  private isConnected: boolean = false;
  private _htmlLangObserver?: MutationObserver;

  /**
   * 构造函数
   * @param host 宿主元素
   * @param options.observeHtmlLang 是否监听 <html lang> 属性变化（用于自动跟随页面语言）
   */
  constructor(host: HTMLElement, options?: { observeHtmlLang?: boolean }) {
    this.host = host;
    this.onLanguageChange = () => {
      if (!this.isConnected) return;
      if ('requestUpdate' in this.host && typeof this.host.requestUpdate === 'function') {
        this.host.requestUpdate();
      }
    };
    this.connect();
    if (options?.observeHtmlLang) this._observeHtmlLang();
  }

  /**
   * 连接到宿主元素
   */
  private connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    window.addEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
  }

  /**
   * 监听页面 <html lang> 属性变化，变化时触发宿主重渲染
   */
  private _observeHtmlLang(): void {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    this._htmlLangObserver = new MutationObserver(() => this.onLanguageChange());
    this._htmlLangObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  }

  /**
   * 断开与宿主元素的连接
   */
  public hostDisconnected(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    window.removeEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
    this._htmlLangObserver?.disconnect();
    this._htmlLangObserver = undefined;
  }

  /**
   * 翻译函数
   * @param key 翻译键
   * @param params 参数
   * @returns 翻译后的字符串
   */
  public t(key: string, params?: Record<string, string | number>): string {
    return t(key, params);
  }

  /**
   * 当前语言
   * @returns 当前语言
   */
  public get currentLanguage(): Language {
    return getCurrLanguage();
  }
}