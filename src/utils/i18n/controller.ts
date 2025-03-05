import { t, getCurrentLanguage } from './core';
import { I18N_LANGUAGE_CHANGE } from './core';
import type { Language } from './types';

export class I18nController {
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
    return getCurrentLanguage();
  }
}