import { html, LitElement, PropertyValues, TemplateResult, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property, query, state } from "../../decorators";
import { ifDefined } from "lit/directives/if-defined.js";
import type { Placement } from "../popover";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * @tag zone-tooltip
 * @summary AIYAZONE Tooltip 组件
 * @dependency zone-popover
 *
 * @cssproperty [--zone-tooltip-trigger-display=inline-flex] 设置工具提示触发器的显示方式。
 */
@customElement("zone-tooltip")
export class ZoneTooltip extends LitElement {
  static styles = [unsafeCSS(styles)] as CSSResultGroup;
  private static _activeTouchTooltip: ZoneTooltip | null = null;
  private readonly _popoverArrowPadding = 14;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  @query(".trigger") private trigger!: HTMLElement;
  @query("zone-popover") private _popover!: any;

  /**
   * 设置工具提示的位置
   */
  @property({ type: String })
  placement: Placement = "top";

  @property() target!: string | HTMLElement;
  @state() private _timer!: ReturnType<typeof setTimeout> | null;

  private get _isTouchDevice() {
    return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  }

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
      target.addEventListener("touchstart", this._handleTouchStart, { passive: true });
      target.addEventListener("touchmove", this._handleTouchMove, { passive: true });
      target.addEventListener("touchend", this._handleTouch, { passive: false });
    } else {
      target.addEventListener("focus", this.show, { capture: true });
      target.addEventListener("mouseenter", this.show);
      target.addEventListener("blur", this.hide, { capture: true });
      target.addEventListener("mouseleave", this.hide);
    }
  }

  private _removeEvents(value: string | HTMLElement) {
    const target = this._getTargetFromValue(value);
    if (!target) return;

    target.removeEventListener("touchstart", this._handleTouchStart);
    target.removeEventListener("touchmove", this._handleTouchMove);
    target.removeEventListener("touchend", this._handleTouch);
    target.removeEventListener("focus", this.show, { capture: true });
    target.removeEventListener("mouseenter", this.show);
    target.removeEventListener("blur", this.hide, { capture: true });
    target.removeEventListener("mouseleave", this.hide);
  }

  private _getTarget(): HTMLElement | null {
    return this._getTargetFromValue(this.target);
  }

  private _getTargetFromValue(value: string | HTMLElement): HTMLElement | null {
    if (typeof value === 'string') {
      return document.getElementById(value) as HTMLElement || null;
    }
    return value as HTMLElement;
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
      // 全局监听：滑动时隐藏
      window.addEventListener('touchmove', this.hide, { passive: true });
      window.addEventListener('scroll', this.hide, { passive: true, capture: true });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._removeEvents(this.target);
    if (ZoneTooltip._activeTouchTooltip === this) {
      ZoneTooltip._activeTouchTooltip = null;
    }
    if (this._isTouchDevice) {
      window.removeEventListener('click', this._handleOutsideClick);
      window.removeEventListener('touchmove', this.hide);
      window.removeEventListener('scroll', this.hide, true);
    }
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

  private _isScrolling = false;

  private _handleTouchStart = () => {
    this._isScrolling = false;
  }

  private _handleTouchMove = () => {
    this._isScrolling = true;
  }

  /**
   * 移动端专用的触摸逻辑
   */
  private _handleTouch = (e: TouchEvent) => {
    if (this._isScrolling) {
      return;
    }
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
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._isTouchDevice && ZoneTooltip._activeTouchTooltip && ZoneTooltip._activeTouchTooltip !== this) {
      ZoneTooltip._activeTouchTooltip._hideImmediately();
    }
    if (this._popover) {
      this._popover.target = this.target ?? this.trigger;
      this._popover.show();
    }
    if (this._isTouchDevice) {
      ZoneTooltip._activeTouchTooltip = this;
    }
    this.dispatchEvent(new CustomEvent('zone-tooltip-show', { detail: "" }));
  }

  private _hideImmediately() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._hidePopover()
  }

  private _hidePopover() {
    if (this._popover) {
      this._popover.hide();
    }
    if (ZoneTooltip._activeTouchTooltip === this) {
      ZoneTooltip._activeTouchTooltip = null;
    }
    this.dispatchEvent(new CustomEvent('zone-tooltip-hide', { detail: "" }));
  }

  /**
   * 隐藏工具提示
   */
  hide = () => {
    // 移动端滑动或点击外部时，建议立即隐藏 (delay = 0)
    const delay = this._isTouchDevice ? 0 : 150;

    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this._timer = null;
      this._hidePopover()
    }, delay)
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
      @touchstart=${this._isTouchDevice ? this._handleTouchStart : null}
      @touchmove=${this._isTouchDevice ? this._handleTouchMove : null}
      @touchend=${this._isTouchDevice ? this._handleTouch : null}
    >
    </slot>`;
  }

  render(): TemplateResult {
    return html`
      ${this.target ? "" : this.triggerTemplate()}
      <zone-popover
        part="tooltip"
        .target="${this.target ?? this.trigger}"
        .arrowPadding="${this._popoverArrowPadding}"
        placement="${ifDefined(this.placement)}"
        @zone-popover-hide="${() => this.dispatchEvent(new CustomEvent('zone-tooltip-hide', { detail: "" }))}"
      >
        <slot
          class="content"
          id="tooltip"
          role="tooltip"
          @mouseenter=${() => this.show()}
          @mouseleave=${() => this.hide()}
        >
        </slot>
      </zone-popover>
    `;
  }
}

export default ZoneTooltip;

declare global {
  interface HTMLElementTagNameMap {
    "zone-tooltip": ZoneTooltip;
  }
}
