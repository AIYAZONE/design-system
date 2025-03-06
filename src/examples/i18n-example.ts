/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 09:35:38
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-06 11:46:52
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\examples\i18n-example.ts
 * @Description:
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '../i18n/decorators';
import { SUPPORTED_LANGUAGES, Language } from '../i18n/core/languages';

/**
 * @tag jds-i18n-example
 * @summary 国际化功能使用示例组件
 */
@customElement('jds-i18n-example')
export default class JdsI18nExample extends LitElement {
  @i18n()
  @property({ type: String })
  title = 'i18n:common.welcome';

  @i18n()
  @property({ type: String })
  message = 'i18n:common.hello';

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
    const currentLang = window.i18n.getCurrentLanguage();
    return html`
      <div>
        <h1 title="${window.i18n.t('common.ok')}">${window.i18n.t('common.ok')}</h1>
        <h2>${this.title}</h2>
        <p>${this.message}</p>
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
    window.i18n.setLanguage(newLang);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jds-i18n-example': JdsI18nExample;
  }
}