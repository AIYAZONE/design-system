import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { event, EventDispatcher } from "../../utils/event.js";
import { stringBooleanConverter } from "../../utils/string-boolean.converter.js";

import { toastStyles } from "./styles.js";
import { ButtonVariant, ButtonKind, ButtonSize } from "../button/index.js";
import "../icon/index.js";
import { JackeryIcon } from "../icon/icon-list.js";

export type ToastVariant = "info" | "warning" | "success" | "danger";

/**
 * @tag jds-toast
 * @summary Jackery 轻提示组件
 */

@customElement("jds-toast")
export default class JdsToast extends LitElement {
  static styles = [toastStyles];

  /**
   * 设置轻提示变体
   */
  @property({ reflect: true })
  variant: ToastVariant = "info"; // 默认变体为信息

  /**
   * 设置轻提示描述
   */
  @property()
  description?: string; // 描述内容可选

  /**
   * 允许自定义轻提示图标
   */
  @property({ converter: stringBooleanConverter() })
  icon?: boolean | JackeryIcon; // 图标可选，支持布尔值和自定义图标

  /**
   * 显示关闭按钮
   */
  @property({ type: Boolean, reflect: true })
  closable = false; // 默认不可关闭

  /**
   * 设置轻提示标题
   */
  @property()
  caption?: string; // 标题内容可选

  /**
   * 设置轻提示组件的显示状态
   */
  @property({ type: Boolean, reflect: true })
  closed = false; // 默认未关闭

  /**
   * 倒计时时间（以秒为单位）
   */
  @property({ type: Number })
  countdownTime: number = 0; //默认倒计时为0秒

  private countdownInterval?: number; //存储倒计时的定时器

  /**
   * 打开轻提示组件
   */
  public open() {
    this.closed = false; // 设置为未关闭状态
  }

  /**
   * 关闭轻提示组件
   */
  public close() {
    this.closed = true; // 设置为关闭状态
  }
  connectedCallback() {
    super.connectedCallback();
    this.startCountdown(); // 组件连接后启动倒计时
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopCountdown(); // 组件断开时停止倒计时
  }

  /**
   * 启动倒计时
   */
  private startCountdown() {
    if (this.countdownTime > 0) {
      this.countdownInterval = window.setInterval(() => {
        this.countdownTime--; // 每秒减少 1
        if (this.countdownTime <= 0) {
          this.close(); // 倒计时结束，关闭警报
        }
      }, 1000);
    }
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
  @event("jds-close") private onClose!: EventDispatcher<boolean>;

  // 检查是否有轻提示标题插槽
  private get _hasToastCaptionSlot() {
    return this.querySelector(':scope > [slot="caption"]') !== null;
  }

  // 关闭处理事件
  private _closeHandler() {
    this.closed = true; // 设置为关闭状态
    this.onClose(true); // 触发关闭事件
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
  private _getIcon(): JackeryIcon | string {
    if (!this.icon) return ""; // 如果没有图标，返回空
    if (this.icon === true) return this._predefinedIcons(); // 返回预定义图标
    return this.icon; // 返回自定义图标
  }

  // 初始化轻提示操作插槽
  private _initToastActionSlot(event: Event) {
    const slotElement = event.target as HTMLSlotElement;
    const slotElements = slotElement.assignedElements({ flatten: true });

    slotElements.forEach((element) => {
      if (element.tagName !== "JDS-BUTTON") {
        element.parentNode?.removeChild(element); // 移除非按钮元素
        return;
      }

      // 显示操作区域
      (
        this.shadowRoot?.querySelector(".actions") as HTMLElement
      ).style.display = "flex";

      const variant =
        slotElement.name === "action-secondary" ? "secondary" : "primary"; // 确定按钮变体
      const buttonTypes: Record<ToastVariant, string> = {
        info: "neutral",
        warning: "neutral",
        success: "success",
        danger: "danger",
      };

      // 设置按钮属性
      element.setAttribute("variant", variant as ButtonVariant);
      element.setAttribute("kind", buttonTypes[this.variant] as ButtonKind);
      element.setAttribute("size", "medium" as ButtonSize);
      element.removeAttribute("icon");
    });
  }

  render(): TemplateResult {
    const caption =
      this.caption || this._hasToastCaptionSlot
        ? html`<span class="caption">
            <slot name="caption"> ${this.caption} </slot>
          </span>`
        : null;

    const icon = this._getIcon()
      ? html`<jds-icon
          class="icon"
          name=${ifDefined(this._getIcon())}
        ></jds-icon>`
      : null;

    const closable = this.closable
      ? html`<jds-button
          class="close"
          label="close"
          kind="neutral"
          icon="close"
          variant="tertiary"
          @click=${this._closeHandler}
        ></jds-button>`
      : null;

    const description = html`<span class="description">
      <slot> ${this.description} </slot>
    </span>`;

    return html`
      <div class="toast">
        ${icon}
        <div class="wrapper">
          <div class="content">
            <div class="text-content">${caption} ${description}</div>
          </div>
          <div class="actions">
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

declare global {
  interface HTMLElementTagNameMap {
    "jds-toast": JdsToast; // 定义全局标签
  }
}
