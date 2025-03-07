import { t, getCurrentLanguage } from './index';
import { I18N_LANGUAGE_CHANGE } from './config';
import { Language } from '../types/languages';

/**
 * i18n控制器，用于自动翻译属性
 */
export class I18nController {
  private host: HTMLElement;
  private onLanguageChange: () => void;
  private isConnected: boolean = false;

  /**
   * 构造函数
   * @param host 宿主元素
   */
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

  /**
   * 连接到宿主元素
   */
  private connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    window.addEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
  }

  /**
   * 断开与宿主元素的连接
   */
  public hostDisconnected(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    window.removeEventListener(I18N_LANGUAGE_CHANGE, this.onLanguageChange as EventListener);
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
    return getCurrentLanguage();
  }
}