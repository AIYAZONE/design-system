import { html, LitElement, PropertyValues, TemplateResult, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property, query, state } from "../../decorators";
import { ifDefined } from "lit/directives/if-defined.js";
import type { Placement } from "../popover";
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
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  @query(".trigger") private trigger!: HTMLElement;
  @query("jds-popover") private _popover!: any;

  /**
   * 设置工具提示的位置
   */
  @property({ type: String })
  placement: Placement = "top";

  @property() target!: string | Element;
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
    if (target) {
      target.addEventListener("focus", this.show, { capture: true });
      target.addEventListener("mouseenter", this.show);
      target.addEventListener("blur", this.hide, { capture: true });
      target.addEventListener("mouseleave", this.hide);
    }
  }

  private _removeEvents(value: string | Element) {
    const target = this._getTargetFromValue(value);
    if (target) {
      target.removeEventListener("focus", this.show, { capture: true });
      target.removeEventListener("mouseenter", this.show);
      target.removeEventListener("blur", this.hide, { capture: true });
      target.removeEventListener("mouseleave", this.hide);
    }
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

declare global {
  interface HTMLElementTagNameMap {
    "jds-tooltip": JdsTooltip;
  }
}
