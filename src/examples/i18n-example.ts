/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 09:35:38
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 09:01:44
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\examples\i18n-example.ts
 * @Description:
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '../decorators/i18n';

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

  @i18n()
  @property({ type: String })
  buttonText = 'i18n:common.changeLanguage';

  private languages = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' }
  ];

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
    const newLang = select.value as 'zh' | 'en' | 'ja';
    window.i18n.setLanguage(newLang);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jds-i18n-example': JdsI18nExample;
  }
}