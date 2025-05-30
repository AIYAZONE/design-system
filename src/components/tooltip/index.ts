import { html, LitElement, PropertyValues, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ReferenceElement } from "@floating-ui/core";
import { getTarget } from "../../utils/elements";
import { event, EventDispatcher } from "../../utils/event";
import "../popover";
import JdsPopover, { Placement } from "../popover";
import styles from "./index.less?inline";

/**
 * @tag jds-tooltip
 * @summary Jackery Tooltip 组件
 * @dependency jds-popover
 *
 * @cssproperty [--jds-tooltip-trigger-display=inline-flex] 设置工具提示触发器的显示方式。
 */
@customElement("jds-tooltip")
export default class JdsTooltip extends LitElement {
  static styles = [unsafeCSS(styles)];

  @query(".trigger") private trigger: ReferenceElement;
  @query("jds-popover") private _popover!: JdsPopover;

  /**
   * 设置工具提示的位置
   */
  @property({ type: String })
  placement: Placement = "top";

  /**
   * 当鼠标悬停在触发器上时触发
   */
  @event("jds-tooltip-show") private onShow!: EventDispatcher<string>;

  /**
   * 当离开触发器时触发
   */
  @event("jds-tooltip-hide") private onHide!: EventDispatcher<string>;
  @property() target!: string | Element;
  @property() private _timer!: ReturnType<typeof setTimeout> | null;

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
    const target = getTarget(this.target);
    if (target) {
      target.addEventListener("focus", this.show, { capture: true });
      target.addEventListener("mouseenter", this.show);
      target.addEventListener("blur", this.hide, { capture: true });
      target.addEventListener("mouseleave", this.hide);
    }
  }

  private _removeEvents(value: string | Element) {
    const target = getTarget(value);
    if (target) {
      target.removeEventListener("focus", this.show, { capture: true });
      target.removeEventListener("mouseenter", this.show);
      target.removeEventListener("blur", this.hide, { capture: true });
      target.removeEventListener("mouseleave", this.hide);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._timer = null;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._addEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEvents(this.target);
  }

  /**
   * 显示工具提示
   */
  show() {
    this._popover.target = this.target ?? this.trigger;
    this._popover.show();
    this.onShow("");
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

  /**
   * 隐藏工具提示
   */
  hide() {
    this._timer = setTimeout(() => {
      this._popover.hide();
      this.onHide("");
    }, 150)
  }

  /**
   * 获取工具提示的可见性状态
   */
  get visible(): boolean {
    return this._popover.visible;
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
        @jds-popover-hide="${() => this.onHide("")}"
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

declare global {
  interface HTMLElementTagNameMap {
    "jds-tooltip": JdsTooltip;
  }
}
