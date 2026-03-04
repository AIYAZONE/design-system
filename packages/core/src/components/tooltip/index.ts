import { html, LitElement, PropertyValues, TemplateResult, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property, query, state } from "../../decorators";
import { ifDefined } from "lit/directives/if-defined.js";
import type { Placement } from "../popover";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * @tag jds-tooltip
 * @summary Jackery Tooltip 组件
 * @dependency jds-popover
 *
 * @cssproperty [--jds-tooltip-trigger-display=inline-flex] 设置工具提示触发器的显示方式。
 */
@customElement("jds-tooltip")
export class JdsTooltip extends LitElement {
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  @query(".trigger") private trigger!: HTMLElement;
  @query("jds-popover") private _popover!: any;

  /**
   * 设置工具提示的位置
   */
  @property({ type: String })
  placement: Placement = "top";

  @property() target!: string | Element;
  @state() private _isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  @state() private _timer!: ReturnType<typeof setTimeout> | null;

  protected update(changedProperties: PropertyValues) {
    if (changedProperties.has("target")) {
      const prev = changedProperties.get("target");
      // 移除旧目标的事件
      if (prev) {
        this._removeEvents(prev);
      }
      // 添加新目标的事件
      this._addEvents();
    }
    super.update(changedProperties);
  }

  private _addEvents() {
    const target = this._getTarget();
    if (!target) return

    if (this._isTouchDevice) {
      // 移动端：仅绑定 touchend 切换显示/隐藏
      target.addEventListener("touchend", this._handleTouch, { passive: false });
    } else {
      target.addEventListener("focus", this.show, { capture: true });
      target.addEventListener("mouseenter", this.show);
      target.addEventListener("blur", this.hide, { capture: true });
      target.addEventListener("mouseleave", this.hide);
    }
  }

  private _removeEvents(value: string | Element) {
    const target = this._getTargetFromValue(value);
    if (!target) return;

    target.removeEventListener("touchend", this._handleTouch);
    target.removeEventListener("focus", this.show, { capture: true });
    target.removeEventListener("mouseenter", this.show);
    target.removeEventListener("blur", this.hide, { capture: true });
    target.removeEventListener("mouseleave", this.hide);
  }

  private _getTarget(): Element | null {
    return this._getTargetFromValue(this.target);
  }

  private _getTargetFromValue(value: string | Element): Element | null {
    if (typeof value === 'string') {
      return document.getElementById(value);
    }
    return value as Element;
  }

  connectedCallback() {
    super.connectedCallback?.();
    this._timer = null;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._addEvents();

    // 移动端：点击全局关闭工具提示
    if (this._isTouchDevice) {
      // 使用 click 监听全局，因为 touchend 在非交互元素上可能不冒泡
      window.addEventListener('click', this._handleOutsideClick);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._removeEvents(this.target);
  }

  /**
   * 移动端：点击全局关闭工具提示
   */
  private _handleOutsideClick = (e: Event) => {
    // 兼容性处理：如果不支持 composedPath，回退到原始 target 判断
    const path = e.composedPath ? e.composedPath() : [];
    
    // 如果点击目标不在组件内部，则关闭
    if (this.visible && !path.includes(this)) {
      this.hide();
    }
  }

  /**
   * 移动端专用的触摸逻辑
   */
  private _handleTouch = (e: TouchEvent) => {
    // 阻止冒泡到 document 触发 _handleOutsideClick
    e.preventDefault();
    
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * 显示工具提示
   */
  show = () => {
    if (this._popover) {
      this._popover.target = this.target ?? this.trigger;
      this._popover.show();
    }
    this.dispatchEvent(new CustomEvent('jds-tooltip-show', { detail: "" }));
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

  /**
   * 隐藏工具提示
   */
  hide = () => {
    this._timer = setTimeout(() => {
      if (this._popover) {
        this._popover.hide();
      }
      this.dispatchEvent(new CustomEvent('jds-tooltip-hide', { detail: "" }));
    }, 150)
  }

  /**
   * 获取工具提示的可见性状态
   */
  get visible(): boolean {
    return Boolean(this._popover?.visible);
  }

  private triggerTemplate() {
    return html`<slot
      class="trigger"
      name="tooltip-trigger"
      aria-describedby="tooltip"
      @focus=${{ handleEvent: () => this.show(), capture: true }}
      @blur=${{ handleEvent: () => this.hide(), capture: true }}
      @mouseenter=${() => this.show()}
      @mouseleave=${() => this.hide()}
      @touchend=${this._isTouchDevice ? this._handleTouch : null}
    >
    </slot>`;
  }

  render(): TemplateResult {
    return html`
      ${this.target ? "" : this.triggerTemplate()}
      <jds-popover
        part="tooltip"
        .target="${this.target ?? this.trigger}"
        placement="${ifDefined(this.placement)}"
        @jds-popover-hide="${() => this.dispatchEvent(new CustomEvent('jds-tooltip-hide', { detail: "" }))}"
      >
        <slot
          class="content"
          id="tooltip"
          role="tooltip"
          @mouseenter=${() => this.show()}
          @mouseleave=${() => this.hide()}
        >
        </slot>
      </jds-popover>
    `;
  }
}

export default JdsTooltip;

declare global {
  interface HTMLElementTagNameMap {
    "jds-tooltip": JdsTooltip;
  }
}
