import {
  html,
  LitElement,
  TemplateResult,
  CSSResultGroup,
  unsafeCSS,
  type PropertyValues,
} from "lit";
import { customElement, property } from "../../decorators";
import { ifDefined } from "lit/directives/if-defined.js";

import { state } from "../../decorators";
import { I18nController } from "@aiyazone/i18n";
import { componentText } from "../component-text";
import styles from "./index.less?inline";

export type ToastVariant = "info" | "warning" | "success" | "danger";

/**
 * @tag zone-toast
 * @summary AIYAZONE 轻提示组件
 * @cssproperty [--zone-toast-max-width=560px] 通知最大宽度，不超过父容器
 * @cssproperty [--zone-toast-padding] 通知内边距
 * @cssproperty [--zone-toast-caption-font] 通知标题字体
 * @cssproperty [--zone-toast-icon-size=20px] 通知图标大小
 */

@customElement("zone-toast")
export class ZoneToast extends LitElement {
  static get observedAttributes() {
    return [...super.observedAttributes, "countdowntime"];
  }
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback?.(
      name === "countdowntime" ? "countdown-time" : name,
      oldValue,
      value,
    );
  }
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  /**
   * 设置轻提示变体
   */
  @property({ reflect: true })
  variant: ToastVariant = "info"; // 默认变体为信息

  /**
   * 设置轻提示描述
   */
  @property()
  description: string | undefined; // 描述内容可选

  /**
   * 允许自定义轻提示图标
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) =>
        value === null
          ? undefined
          : value === "" || value === "true"
            ? true
            : value === "false"
              ? false
              : value,
    },
  })
  icon: boolean | string | undefined; // 图标可选，支持布尔值和自定义图标

  /**
   * 显示关闭按钮
   */
  @property({ type: Boolean, reflect: true })
  closable: boolean = false; // 默认不可关闭

  /**
   * 设置轻提示标题
   */
  @property()
  caption: string | undefined; // 标题内容可选

  /**
   * 设置轻提示组件的显示状态（默认 false＝显示；初始隐藏必须设置 closed 属性）
   */
  @property({ type: Boolean, reflect: true })
  closed: boolean = false; // 默认未关闭

  /**
   * 倒计时时间（以秒为单位）
   */
  @property({ type: Number, attribute: "countdown-time" })
  countdownTime: number = 0; //默认倒计时为0秒

  private _i18n?: I18nController;
  private _remaining = 0;
  private _paused = false;
  @state() private _hasActions = false;
  /** 关闭按钮名称；默认跟随页面语言。 */
  @property({ attribute: "close-label" }) closeLabel?: string;

  private countdownInterval?: number; //存储倒计时的定时器

  /**
   * 打开轻提示组件
   */
  public open() {
    this.closed = false;
    this.startCountdown();
  }

  /**
   * 关闭轻提示组件
   */
  public close() {
    this.closed = true;
    this.stopCountdown();
  }
  connectedCallback() {
    super.connectedCallback?.();
    this._i18n = new I18nController(this, { observeHtmlLang: true });
    if (!this.closed) this.startCountdown();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.stopCountdown();
    this._i18n?.hostDisconnected();
    this._i18n = undefined;
  }

  /**
   * 启动倒计时
   */
  protected updated(changed: PropertyValues) {
    if (changed.has("closed") || changed.has("countdownTime")) {
      if (this.closed) this.stopCountdown();
      else this.startCountdown();
    }
  }

  private startCountdown() {
    this.stopCountdown();
    this._remaining = this.countdownTime;
    if (!this.isConnected || this.closed || this._remaining <= 0) return;
    this.countdownInterval = window.setInterval(() => {
      if (this._paused) return;
      if (--this._remaining <= 0) this.close();
    }, 1000);
  }

  /**
   * 停止倒计时
   */
  private stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); // 清除定时器
      this.countdownInterval = undefined; // 清空定时器引用
    }
  }

  /**
   * 当关闭按钮被点击时触发
   */
  private _closeHandler() {
    this.closed = true;
    this.stopCountdown();
    this.dispatchEvent(new CustomEvent("zone-close", { detail: true })); // 触发关闭事件
  }

  // 检查是否有轻提示标题插槽
  private get _hasToastCaptionSlot() {
    return this.querySelector(':scope > [slot="caption"]') !== null;
  }

  // 根据变体返回预定义图标
  private _predefinedIcons() {
    switch (this.variant) {
      case "info":
        return "info-fill"; // 提示图标
      case "warning":
        return "alert-fill"; // 警告图标
      case "success":
        return "check-fill"; // 成功图标
      case "danger":
        return "close-fill"; // 危险图标
      default:
        return this.variant; // 返回默认变体
    }
  }

  // 获取图标
  private _getIcon(): string {
    if (!this.icon) return ""; // 如果没有图标，返回空
    if (this.icon === true) return this._predefinedIcons(); // 返回预定义图标
    return this.icon; // 返回自定义图标
  }

  // 初始化轻提示操作插槽
  private _initToastActionSlot(event: Event) {
    const slotElement = event.target as HTMLSlotElement;
    const slotElements = slotElement.assignedElements({ flatten: true });
    // Supply defaults only; slotted content and explicit consumer choices belong to the caller.
    slotElements
      .filter((element) => element.tagName === "ZONE-BUTTON")
      .forEach((element) => {
        if (!element.hasAttribute("variant"))
          element.setAttribute(
            "variant",
            slotElement.name === "action-secondary" ? "secondary" : "primary",
          );
        if (!element.hasAttribute("kind"))
          element.setAttribute(
            "kind",
            ["success", "danger"].includes(this.variant)
              ? this.variant
              : "neutral",
          );
        if (!element.hasAttribute("size"))
          element.setAttribute("size", "medium");
      });
    this._hasActions =
      [...this.querySelectorAll('[slot="action"], [slot="action-secondary"]')]
        .length > 0;
  }

  render(): TemplateResult {
    const caption =
      this.caption || this._hasToastCaptionSlot
        ? html`<span class="caption">
            <slot name="caption"> ${this.caption} </slot>
          </span>`
        : null;

    const icon = this._getIcon()
      ? html`<zone-icon
          class="icon"
          name=${ifDefined(this._getIcon())}
        ></zone-icon>`
      : null;

    const closable = this.closable
      ? html`<zone-button
          class="close"
          label=${this.closeLabel ?? componentText(this.ownerDocument, "close")}
          kind="neutral"
          icon="close"
          variant="text"
          @click=${this._closeHandler}
        ></zone-button>`
      : null;

    const description = html`<span class="description">
      <slot> ${this.description} </slot>
    </span>`;

    return html`
      <div
        class="toast"
        role=${this.variant === "danger" ? "alert" : "status"}
        aria-atomic="true"
        @mouseenter=${() => {
          this._paused = true;
        }}
        @mouseleave=${() => {
          this._paused = false;
        }}
        @focusin=${() => {
          this._paused = true;
        }}
        @focusout=${(event: FocusEvent) => {
          this._paused = !!(
            event.relatedTarget && this.contains(event.relatedTarget as Node)
          );
        }}
      >
        ${icon}
        <div class="wrapper">
          <div class="content">
            <div class="text-content">${caption} ${description}</div>
          </div>
          <div
            class="actions"
            style=${this._hasActions ? "display:flex" : "display:none"}
          >
            <slot
              class="action"
              name="action"
              @slotchange=${this._initToastActionSlot}
            ></slot>
            <slot
              class="action-secondary"
              name="action-secondary"
              @slotchange=${this._initToastActionSlot}
            ></slot>
          </div>
        </div>
        ${closable}
      </div>
    `;
  }
}

export default ZoneToast;

declare global {
  interface HTMLElementTagNameMap {
    "zone-toast": Pick<ZoneToast, keyof ZoneToast>;
  }
}
