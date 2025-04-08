/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-05 11:03:32
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-10 13:40:50
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\components\i18n\index.ts
 * @Description: 国际化组件
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '../../i18n/core/controller.js';

@customElement('jds-i18n')
export default class JdsI18n extends LitElement {
  @property({ type: String })
  key = '';

  @property({ type: Object })
  params = {};

  private i18n: I18nController;

  constructor() {
    super();
    this.i18n = new I18nController(this);
  }

  protected render() {
    return html`${this.i18n.t(this.key, this.params) || this.key}`;
  }

  protected updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('key') || changedProperties.has('params')) {
      this.requestUpdate();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.i18n.hostDisconnected();
  }

  protected createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jds-i18n': JdsI18n;
  }
}