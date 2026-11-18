import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from '@aiyazone/utils';
import { I18nController } from '../core/controller';

@customElement('zone-i18n')
export class ZoneI18n extends LitElement {
  private i18n = new I18nController(this);

  @property({ type: String, reflect: true })
  key: string = '';

  private _params: Record<string, string | number> | undefined;

  @property({ type: String, reflect: true })
  set params(value: string) {
    try {
      this._params = value ? JSON.parse(value) : undefined;
    } catch {
      this._params = undefined;
    }
  }
  get params(): string {
    return this._params ? JSON.stringify(this._params) : '';
  }

  render() {
    const text = this.key ? this.i18n.t(this.key, this._params) : '';
    return html`${text}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zone-i18n': Pick<ZoneI18n, keyof ZoneI18n>;
  }
}
