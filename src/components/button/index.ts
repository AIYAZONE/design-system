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
  form?: HTMLFormElement | string;

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

  // MutationObserver 实例
  private _slotObserver?: MutationObserver;

  // 组件连接到文档DOM时的回调
  connectedCallback() {
    super.connectedCallback();
    this._setupSlotObserver();
  }

  // 组件从文档DOM断开时的回调
  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupSlotObserver();
  }

  // 设置插槽内容变化监听器（优化：防抖处理）
  private _setupSlotObserver() {
    let timeoutId: number;

    this._slotObserver = new MutationObserver(() => {
      // 防抖处理，避免频繁更新
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        this._hasDefaultSlotCache = null;
        this.requestUpdate();
      }, 16); // 约1帧的延迟
    });

    this._slotObserver.observe(this, {
      childList: true,
      subtree: false, // 优化：只监听直接子节点
      characterData: true
    });
  }

  // 清理插槽内容监听器
  private _cleanupSlotObserver() {
    if (this._slotObserver) {
      this._slotObserver.disconnect();
      this._slotObserver = undefined;
    }
    this._hasDefaultSlotCache = null;
  }

  // 缓存iOS版本检测结果
  private _iosVersionCache: boolean | null = null;

  // 判断是否iOS版本低于指定版本（优化：添加缓存）
  private isIOSVersionBelow(major: number, minor: number): boolean {
    if (this._iosVersionCache !== null) {
      return this._iosVersionCache;
    }

    const userAgent = navigator.userAgent;
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);

    if (match) {
      const majorVersion = parseInt(match[1], 10);
      const minorVersion = parseInt(match[2], 10);

      // 比较主版本和次版本
      this._iosVersionCache = majorVersion < major ||
        (majorVersion === major && minorVersion < minor);
    } else {
      this._iosVersionCache = false; // 非iOS设备
    }

    return this._iosVersionCache;
  }

  // 处理按钮点击事件
  private _handleClick(event: Event) {
    // 如果按钮被禁用，阻止事件传播
    if (this.loading || this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.type === "submit") {
      this._handleFormSubmit();
    }

    // 触发自定义点击事件
    this.onClick("Click event fired!");
  }

  // 处理表单提交逻辑
  private _handleFormSubmit() {
    let targetForm: HTMLFormElement | null = null;

    // 根据form属性获取目标表单
    if (this.form instanceof HTMLFormElement) {
      targetForm = this.form;
    } else if (typeof this.form === "string" && this.form.trim()) {
      targetForm = document.getElementById(this.form) as HTMLFormElement;
    } else {
      targetForm = this.closest("form") as HTMLFormElement;
    }

    // 提交表单（增加安全检查）
    if (targetForm && targetForm.tagName === 'FORM') {
      try {
        submit(targetForm);
      } catch (error) {
        console.error('Form submission failed:', error);
      }
    }
  }

  // 处理键盘事件（无障碍访问）
  private _handleKeydown(event: KeyboardEvent) {
    // 空格键或回车键触发点击
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this._handleClick(event);
    }
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
  // 缓存默认插槽状态
  private _hasDefaultSlotCache: boolean | null = null;
  private _lastChildNodesVersion = 0;

  get _hasDefaultSlot() {
    // 检查子节点是否发生变化
    const currentVersion = this.childNodes.length;
    if (this._lastChildNodesVersion !== currentVersion) {
      this._hasDefaultSlotCache = null;
      this._lastChildNodesVersion = currentVersion;
    }

    // 如果缓存无效，重新计算
    if (this._hasDefaultSlotCache === null) {
      this._hasDefaultSlotCache = this._computeHasDefaultSlot();
    }

    return this._hasDefaultSlotCache;
  }

  // 计算是否有默认插槽内容（优化：更精确的检测）
  private _computeHasDefaultSlot(): boolean {
    // 使用 querySelector 快速检查是否有非 slot 元素
    const hasNonSlotElements = this.querySelector(':scope > :not([slot])') !== null;
    if (hasNonSlotElements) return true;

    // 检查文本节点（只在没有非slot元素时检查）
    for (const node of this.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        // 更严格的文本内容检查
        if (textContent && textContent.trim().length > 0) {
          return true;
        }
      }
    }

    return false;
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
            rel=${ifDefined(this.target === '_blank' ? 'noopener noreferrer' : undefined)}
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

// 扩展HTMLElementTagNameMap接口，以便在TypeScript中识别自定义元素
declare global {
  interface HTMLElementTagNameMap {
    "jds-button": JdsButton;
  }
}
