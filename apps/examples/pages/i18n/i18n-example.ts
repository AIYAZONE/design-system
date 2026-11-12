/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 09:35:38
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-06-19 18:16:54
 * @FilePath: \zone-i18n\src\examples\i18n-example.ts
 * @Description: 国际化功能使用示例组件
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n, t } from '@aiyazone/i18n';

@customElement('zone-i18n-example')
export default class ZoneI18nExample extends LitElement {
  /** 增加自定义css样式 */
  static styles = css`
    pre {
      background-color: var(--zone-color-neutral-100);
      color: var(--zone-color-neutral-500);
      padding: var(--zone-size-16);
      border-radius: var(--zone-rounded-8);
      font-size: 0.875rem;
      line-height: 1.5;
      overflow-x: auto;
      border: 1px solid var(--zone-color-neutral-200);
      margin: var(--zone-size-16) 0;
    }
  `;

  @i18n()
  @property({ type: String })
  title = '';

  @i18n()
  @property({ type: String })
  message = '';

  render() {
    return html`
        <h3>4. 模板字符串形式 —— 自定义Lit组件内部使用，可随语言切换自动更新翻译</h3>
        <p title="${t('common.ok')}">common.ok:${t('common.ok')}</p>
        <pre>&lt;p title="&#36;{t('common.ok')}"&gt;common.ok:&#36;{t('common.ok')}&lt;/p&gt;</pre>

        <h3>5. @i18n()装饰器 —— 仅自定义Lit组件内部属性声明使用，可接收指定i18n key</h3>
        <p>title属性传参： ${this.title}</p>
        <p>message属性传参: ${this.message}</p>
        <pre>&lt;p&gt;title属性传参： &#36;{this.title}&lt;/p&gt;</pre>
        <pre>&lt;p&gt;message属性传参: &#36;{this.message}&lt;/p&gt;</pre>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zone-i18n-example': ZoneI18nExample;
  }
}
