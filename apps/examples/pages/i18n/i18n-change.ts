/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 09:35:38
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-31 14:53:23
 * @FilePath: \Jackery-F2E-Team\jackery-i18n\src\components\change\index.ts
 * @Description: 语言切换示例组件
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SUPPORTED_LANGUAGES, Language, getCurrLanguage, setCurrLanguage } from '@jackery/i18n';

@customElement('jds-i18n-change')
export default class JdsI18nChange extends LitElement {
  static styles = css`
    :host{
      display: inline-flex;
      align-items: center;
    }
    select{
      position: static;
      box-sizing: border-box;
      padding: 8px 12px;
      border: 1px solid #d7d9e0;
      border-radius: 6px;
      outline: none;
      font-size: 14px;
      height: 36px;
      line-height: 20px;
      background: #fff;
    }
    select:focus{
      border-color:#0a67d1;
      box-shadow: 0 0 0 3px rgba(10,103,209,0.12);
    }
    `;

  private languages = SUPPORTED_LANGUAGES.map(lang => ({
    value: lang,
    label: this.getLanguageLabel(lang)
  }));

  private getLanguageLabel(lang: Language): string {
    const labelMap: Record<Language, string> = {
      'zh-CN': '中文',
      'en': 'English',
      'ja': '日本語',
      'de': 'Deutsch',
      'it': 'Italiano',
      'fr': 'Français',
      'es': 'Español',
      'ko': '한국어',
      'zh-TW': '繁體中文'
    };
    return labelMap[lang];
  }

  render() {
    const currentLang = getCurrLanguage();
    return html`
      <div>
        <select @change=${this._changeLanguage} .value=${currentLang}>
          ${this.languages.map(lang => html`
            <option value=${lang.value} ?selected=${currentLang === lang.value}>
              ${lang.label}
            </option>
          `)}
        </select>
      </div>
    `;
  }

  private _changeLanguage(e: Event) {
    const select = e.target as HTMLSelectElement;
    const newLang = select.value as Language;
    setCurrLanguage(newLang);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jds-i18n-change': JdsI18nChange;
  }
}