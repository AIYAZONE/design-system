/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 09:35:38
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-10 11:25:14
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\examples\i18n\i18n-example.ts
 * @Description: 国际化功能使用示例组件
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '../../i18n/decorators';
import { SUPPORTED_LANGUAGES, Language } from '../../i18n/types/languages';

@customElement('jds-i18n-example')
export default class JdsI18nExample extends LitElement {
  static styles = css`
    select{
      position: absolute;
      top: 20px;
      right: 40px;
    }
    `;

  @i18n()
  @property({ type: String })
  title = '';

  @i18n()
  @property({ type: String })
  message = '';

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
    const currentLang = window.i18n.getCurrLanguage();
    return html`
      <div>
        <select @change=${this._changeLanguage} .value=${currentLang}>
          ${this.languages.map(lang => html`
            <option value=${lang.value} ?selected=${currentLang === lang.value}>
              ${lang.label}
            </option>
          `)}
        </select>

        <h3>4. 模板字符串形式 —— 自定义Lit组件内部使用，可随语言切换自动更新翻译</h3>
        <p title="${window.i18n.t('common.ok')}">common.ok:${window.i18n.t('common.ok')}</p>

        <h3>5. @i18n()装饰器 —— 仅自定义Lit组件内部属性声明使用，可接收指定i18n key</h3>
        <p>title属性传参： ${this.title}</p>
        <p>message属性传参: ${this.message}</p>
      </div>
    `;
  }

  private _changeLanguage(e: Event) {
    const select = e.target as HTMLSelectElement;
    const newLang = select.value as Language;
    window.i18n.setCurrLanguage(newLang);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jds-i18n-example': JdsI18nExample;
  }
}