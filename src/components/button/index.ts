import { html, LitElement, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { submit } from "@open-wc/form-helpers";
import { event, EventDispatcher } from "../../utils/event";

import styles from "./index.less?inline";
import "../spinner";

// 按钮变体的类型定义：主按钮-实心胶囊按钮、副按钮-空心胶囊按钮、文本按钮
export type ButtonVariant = "primary" | "secondary" | "text";
// 按钮种类的类型定义: 默认、中性、成功、危险、自定义(需配置`--jds-button-custom-color`)
export type ButtonKind = "default" | "neutral" | "success" | "danger" | "custom";
// 按钮大小的类型定义：特大、大、中、小
export type ButtonSize = "extra" | "large" | "medium" | "small";
// 目标类型的类型定义
export type TargetType = "_blank" | "_parent" | "_self" | "_top";

/**
 * @tag jds-button
 * @summary Jackery 按钮组件
 *
 * @cssproperty [--jds-button-display=inline-block] 设置按钮的显示属性
 * @cssproperty [--jds-button-custom-color=var(--jds-color-primary)] 设置自定义按钮的颜色（需设置`kind`为`custom`）
 * @cssproperty --jds-button-primary-custom-text-color 设置主类型自定义按钮的文字颜色（需设置`kind`为`custom`和`variant`为`primary`）
 *
 */
@customElement("jds-button")
export default class JdsButton extends LitElement {
  // 获取组件的CSS样式
  static styles = [unsafeCSS(styles)];

  /**
   * 设置按钮的变体
   */
  @property({ type: String, reflect: true })
  variant: ButtonVariant = "primary";

  /**
   * 设置按钮的种类
   */
  @property({ type: String, reflect: true })
  kind: ButtonKind = "default";

  /**
   * 设置按钮的大小
   */
  @property({ type: String, reflect: true })
  size: ButtonSize = "large";

  /**
   * 设置按钮的标签，用于无障碍访问
   */
  @property({ type: String })
  label?: string;

  /**
   * 设置按钮的加载状态
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * 设置按钮为禁用状态
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 设置链接URL，如果设置，按钮将渲染为锚标签
   */
  @property({ type: String })
  href?: string;

  /**
   * 设置图标名称，使用jds-icon组件显示图标
   */
  @property({ type: String })
  icon?: string;

  /**
   * 设置锚点的目标，当设置了`href`时使用
   */
  @property({ type: String })
  target?: TargetType = "_self";

  /**
   * 设置按钮的类型，设置`submit`以将按钮用作父表单的提交器
   */
  @property({ type: String })
  type?: "submit";

  /**
   * 设置按钮自动获取键盘焦点
   */
  @property({ type: Boolean, reflect: true })
  autofocus = false;

  /**
   * 设置按钮关联的表单，当`type`设置为`submit`且按钮不在目标表单内时使用
   */
  @property({ type: String })
  form!: HTMLFormElement | string;

  /**
   * 激活状态
   */
  @state({})
  active = false;

  // 查询按钮元素
  @query(".button")
  private button!: HTMLAnchorElement | HTMLButtonElement;

  /**
   * 当按钮被点击时触发
   */
  @event("jds-click") private onClick!: EventDispatcher<string>;

  // 获取按钮的激活状态
  private get _isActive() {
    return this.active;
  }

  // 组件连接到文档DOM时的回调
  connectedCallback() {
    super.connectedCallback();
  }

  // 判断是否iOS版本低于指定版本
  private isIOSVersionBelow(major: number, minor: number) {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);

    if (match) {
      const majorVersion = parseInt(match[1], 10);
      const minorVersion = parseInt(match[2], 10);

      // 比较主版本和次版本
      return majorVersion < major ||
        (majorVersion === major && minorVersion < minor);
    }
    return false; // 非iOS设备或无法解析版本
  }

  // 处理按钮点击事件
  private _handleClick() {
    if (this.type === "submit") {
      let targetForm: HTMLFormElement;

      // 根据form属性获取目标表单
      if (this.form instanceof HTMLFormElement) {
        targetForm = this.form;
      } else if (typeof this.form === "string") {
        targetForm = document.getElementById(this.form) as HTMLFormElement;
      } else {
        targetForm = this.closest("form") as HTMLFormElement;
      }

      // 提交表单
      if (targetForm) {
        submit(targetForm);
      }
    }
    // 触发点击事件
    this.onClick("Click event fired!");
  }

  // 使按钮获取焦点
  focus() {
    this.button?.focus();
  }

  // 获取是否有图标插槽
  get _hasIconSlot() {
    return this.querySelector(':scope > [slot="icon"]') !== null;
  }

  // 获取是否有默认插槽
  get _hasDefaultSlot() {
    const childNodes = [...this.childNodes];

    return childNodes.some((node) => {
      const nodeType = node.nodeType;

      // 只有文本节点
      if (nodeType === node.TEXT_NODE && node.textContent?.trim() !== "") {
        return true;
      }
      // 有元素节点，且不应有slot属性
      if (nodeType === node.ELEMENT_NODE) {
        if (!(node as HTMLElement).hasAttribute("slot")) {
          return true;
        }
      }
      return false;
    });
  }

  // 渲染组件的HTML模板
  render(): TemplateResult {
    const isDisabled = this.loading || this.disabled;
    const label = html`<slot></slot>`;
    const isAnchor = !!this.href;
    const icon = this.icon ? html`<jds-icon part="icon" name=${this.icon}></jds-icon>` : "";
    const loadingIcon = html`
      <jds-spinner
        class="loading-spinner"
        ?disabled="${isDisabled}"
        size="var(--jds-font-size-24)"
        color="var(--jds-color-white)"
      ></jds-spinner>
    `;
    const slots = html`
      <span class="label" part="label">${label}</span>
      <slot name="icon">${this.loading ? loadingIcon : icon}</slot>
    `;
    const classes = classMap({
      button: true,
      "ios-below-16_2": this.isIOSVersionBelow(16, 2), // 判断是否iOS版本低于16.2
      "has-icon": this.icon || this._hasIconSlot,
      "has-content": this._hasDefaultSlot,
      active: !isAnchor && this._isActive,
    });

    // 根据是否为锚点渲染不同的HTML结构
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
          >
            ${slots}
          </button>
        `;
  }
}

// 扩展HTMLElementTagNameMap接口，以便在TypeScript中识别自定义元素
declare global {
  interface HTMLElementTagNameMap {
    "jds-button": JdsButton;
  }
}
