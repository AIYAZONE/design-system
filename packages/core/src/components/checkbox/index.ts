import {
  html,
  LitElement,
  unsafeCSS,
  TemplateResult,
  CSSResultGroup,
} from "lit";
import { customElement, property } from "../../decorators";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * ZONE Checkbox 组件
 * @cssproperty [--zone-checkbox-font-size=16px] 标签字号，与视口缩放分离
 */
@customElement("zone-checkbox")
export class ZoneCheckbox extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals?.();
  private _formDisabled = false;
  private _defaultChecked = false;

  connectedCallback() {
    super.connectedCallback?.();
    if (!this.hasUpdated) this._defaultChecked = this.checked;
  }

  protected updated() {
    this._internals?.setFormValue?.(
      this.checked && !this.disabled && !this._formDisabled ? this.value : null,
      String(this.checked),
    );
  }

  formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    this.requestUpdate();
  }

  formResetCallback() {
    this.checked = this._defaultChecked;
    this.indeterminate = false;
  }
  formStateRestoreCallback(state: string) {
    this.checked = state === "true";
  }
  get form() {
    return this._internals?.form ?? null;
  }
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector("input")?.focus(options);
  }

  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  /**
   * 是否选中
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** 部分选中状态；用户切换后恢复为确定状态，不单独影响表单值。 */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /**
   * 是否禁用
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 表单值
   */
  @property()
  value = "on";

  /**
   * 表单名称
   */
  @property()
  name = "";

  /**
   * 标签文本
   */
  @property()
  label = "";

  /**
   * 输入变更处理：禁用态阻止；派发 change 事件（detail: { checked }）
   */
  private _handleChange(event: Event) {
    if (this.disabled || this._formDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const target = event.target as HTMLInputElement;
    this.indeterminate = false;
    this.checked = target.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    const classes = classMap({
      checkbox: true,
      "checkbox--disabled": this.disabled || this._formDisabled,
      "checkbox--checked": this.checked || this.indeterminate,
    });

    const uncheckedIcon = html`
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.30775 20.5C4.80258 20.5 4.375 20.325 4.025 19.975C3.675 19.625 3.5 19.1974 3.5 18.6923V5.30775C3.5 4.80258 3.675 4.375 4.025 4.025C4.375 3.675 4.80258 3.5 5.30775 3.5H18.6923C19.1974 3.5 19.625 3.675 19.975 4.025C20.325 4.375 20.5 4.80258 20.5 5.30775V18.6923C20.5 19.1974 20.325 19.625 19.975 19.975C19.625 20.325 19.1974 20.5 18.6923 20.5H5.30775ZM5.30775 19H18.6923C18.7692 19 18.8398 18.9679 18.9038 18.9038C18.9679 18.8398 19 18.7692 19 18.6923V5.30775C19 5.23075 18.9679 5.16025 18.9038 5.09625C18.8398 5.03208 18.7692 5 18.6923 5H5.30775C5.23075 5 5.16025 5.03208 5.09625 5.09625C5.03208 5.16025 5 5.23075 5 5.30775V18.6923C5 18.7692 5.03208 18.8398 5.09625 18.9038C5.16025 18.9679 5.23075 19 5.30775 19Z"
        />
      </svg>
    `;

    const checkedIcon = html`
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.6 15.8538L17.323 9.13075L16.2693 8.077L10.6 13.7463L7.75 10.8962L6.69625 11.95L10.6 15.8538ZM5.30775 20.5C4.80258 20.5 4.375 20.325 4.025 19.975C3.675 19.625 3.5 19.1974 3.5 18.6923V5.30775C3.5 4.80258 3.675 4.375 4.025 4.025C4.375 3.675 4.80258 3.5 5.30775 3.5H18.6923C19.1974 3.5 19.625 3.675 19.975 4.025C20.325 4.375 20.5 4.80258 20.5 5.30775V18.6923C20.5 19.1974 20.325 19.625 19.975 19.975C19.625 20.325 19.1974 20.5 18.6923 20.5H5.30775Z"
        />
      </svg>
    `;

    const mixedIcon = html`<svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.3 3.5A1.8 1.8 0 0 0 3.5 5.3v13.4a1.8 1.8 0 0 0 1.8 1.8h13.4a1.8 1.8 0 0 0 1.8-1.8V5.3a1.8 1.8 0 0 0-1.8-1.8H5.3ZM7 11.25v1.5h10v-1.5H7Z"
      />
    </svg>`;
    const icon = this.indeterminate
      ? mixedIcon
      : this.checked
        ? checkedIcon
        : uncheckedIcon;

    return html`
      <label class=${classes}>
        <input
          class="input"
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled || this._formDisabled}
          name=${ifDefined(this.name)}
          value=${ifDefined(this.value)}
          @change=${this._handleChange}
        />
        <span class="icon" part="icon" aria-hidden="true"> ${icon} </span>
        <span class="label" part="label">
          <slot>${this.label}</slot>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zone-checkbox": Pick<ZoneCheckbox, keyof ZoneCheckbox>;
  }
}
