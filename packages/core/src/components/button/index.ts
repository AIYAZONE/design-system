/// <reference path="../../types/less-inline.d.ts" />
import { html, LitElement, unsafeCSS, TemplateResult, CSSResultGroup} from "lit";
import { customElement, property, state } from "../../decorators";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { submit } from "@jackery/utils";

import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonKind = "default" | "neutral" | "success" | "danger" | "custom";
export type ButtonSize = "extra" | "large" | "medium" | "small";

/**
 * JDS Button 组件
 * 支持变体、种类、尺寸、加载、禁用、链接等配置
 */
@customElement("jds-button")
export class JdsButton extends LitElement {
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  /**
   * 按钮变体
   */
  @property({ reflect: true })
  variant: ButtonVariant = "primary";

  /**
   * 按钮种类
   */
  @property({ reflect: true })
  kind: ButtonKind = "default";

  /**
   * 按钮尺寸
   */
  @property({ reflect: true })
  size: ButtonSize = "large";

  /**
   * 按钮标签（无障碍访问）
   */
  @property()
  label?: string;

  /**
   * 是否加载中
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * 是否禁用
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 链接地址，设置后渲染为 <a>
   */
  @property()
  href?: string;

  /**
   * 图标名称
   */
  @property()
  icon?: string;

  /**
   * 链接目标
   */
  @property()
  target?: string;

  /**
   * 按钮类型
   */
  @property()
  type: "button" | "submit" | "reset" = "button";

  /**
   * 是否自动聚焦
   */
  @property({ type: Boolean })
  autofocus = false;

  /**
   * 关联的表单
   */
  @property()
  form?: string | HTMLFormElement;

  /**
   * 是否激活（内部状态）
   */
  @state()
  private _isActive = false;

  /**
   * 按钮元素引用
   */
  private button?: HTMLButtonElement | HTMLAnchorElement;

  /**
   * 插槽观察器
   */
  private _slotObserver?: MutationObserver;

  /**
   * 点击事件回调（供 Storybook 使用）
   */
  onClick = (detail: any) => {
    this.dispatchEvent(new CustomEvent("jds-click", { detail, bubbles: true, composed: true }));
  };

  connectedCallback() {
    super.connectedCallback();
    this._setupSlotObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupSlotObserver();
  }

  private _setupSlotObserver() {
    this._slotObserver = new MutationObserver(() => {
      this._hasDefaultSlotCache = null;
    });
    this._slotObserver.observe(this, { childList: true, subtree: true });
  }

  private _cleanupSlotObserver() {
    if (this._slotObserver) {
      this._slotObserver.disconnect();
      this._slotObserver = undefined;
    }
    this._hasDefaultSlotCache = null;
  }

  private _iosVersionCache: boolean | null = null;

  private isIOSVersionBelow(major: number, minor: number): boolean {
    if (this._iosVersionCache !== null) {
      return this._iosVersionCache;
    }
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      const majorVersion = parseInt(match[1], 10);
      const minorVersion = parseInt(match[2], 10);
      this._iosVersionCache = majorVersion < major || (majorVersion === major && minorVersion < minor);
    } else {
      this._iosVersionCache = false;
    }
    return this._iosVersionCache;
  }

  private _handleClick(event: Event) {
    if (this.loading || this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.type === "submit") {
      this._handleFormSubmit();
    }
    this.onClick("Click event fired!");
  }

  private _handleFormSubmit() {
    let targetForm: HTMLFormElement | null = null;
    if (this.form instanceof HTMLFormElement) {
      targetForm = this.form;
    } else if (typeof this.form === "string" && this.form.trim()) {
      targetForm = document.getElementById(this.form) as HTMLFormElement;
    } else {
      targetForm = this.closest("form") as HTMLFormElement;
    }
    if (targetForm && targetForm.tagName === "FORM") {
      try {
        submit(targetForm);
      } catch (error) {
        console.error("Form submission failed:", error);
      }
    }
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      this._handleClick(event);
    }
  }

  focus() {
    this.button?.focus();
  }

  get _hasIconSlot() {
    return this.querySelector(":scope > [slot='icon']") !== null;
  }

  private _hasDefaultSlotCache: boolean | null = null;
  private _lastChildNodesVersion = 0;

  get _hasDefaultSlot() {
    const currentVersion = this.childNodes.length;
    if (this._lastChildNodesVersion !== currentVersion) {
      this._hasDefaultSlotCache = null;
      this._lastChildNodesVersion = currentVersion;
    }
    if (this._hasDefaultSlotCache === null) {
      this._hasDefaultSlotCache = this._computeHasDefaultSlot();
    }
    return this._hasDefaultSlotCache;
  }

  private _computeHasDefaultSlot(): boolean {
    const hasNonSlotElements = this.querySelector(":scope > :not([slot])") !== null;
    if (hasNonSlotElements) return true;
    for (const node of this.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        if (textContent && textContent.trim().length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  render(): TemplateResult {
    const isDisabled = this.loading || this.disabled;
    const label = html`<slot></slot>`;
    const isAnchor = !!this.href;
    const icon = this.icon ? html`<jds-icon part="icon" name=${this.icon}></jds-icon>` : "";
    const loadingIcon = html`
      <jds-spinner
        class="loading-spinner"
        ?disabled="${isDisabled}"
        size=${this.size === "small" ? "var(--jds-font-size-16)" : "var(--jds-font-size-24)"}
        color="var(--jds-color-white)"
      ></jds-spinner>
    `;
    const slots = html`
      <span class="label" part="label">${label}</span>
      <slot name="icon">${this.loading ? loadingIcon : icon}</slot>
    `;
    const classes = classMap({
      button: true,
      "ios-below-16_2": this.isIOSVersionBelow(16, 2),
      "has-icon": this.icon || this._hasIconSlot,
      "has-content": this._hasDefaultSlot,
      active: !isAnchor && this._isActive,
    });

    return isAnchor
      ? html`
          <a
            part="button"
            class=${classes}
            ?autofocus=${this.autofocus}
            aria-disabled="${ifDefined(isDisabled)}"
            aria-label="${ifDefined(this.label)}"
            href=${ifDefined(this.href)}
            target=${ifDefined(this.target)}
            rel=${ifDefined(this.target === "_blank" ? "noopener noreferrer" : undefined)}
            role="button"
          >
            ${slots}
          </a>
        `
      : html`
          <button
            part="button"
            class=${classes}
            ?autofocus=${this.autofocus}
            aria-disabled="${ifDefined(isDisabled)}"
            aria-label="${ifDefined(this.label)}"
            ?disabled=${isDisabled}
            @click="${this._handleClick}"
            @keydown="${this._handleKeydown}"
          >
            ${slots}
          </button>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jds-button': JdsButton;
  }
}
