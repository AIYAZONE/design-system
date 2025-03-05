import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '../../utils/i18n';

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