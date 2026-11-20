import { html, LitElement, type PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "../../decorators";
import { ZonePopover, type Placement } from "../popover";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * @tag zone-tooltip
 * @summary 非交互说明；支持键盘、指针及触摸，触发器的主操作保持有效。
 * @slot tooltip-trigger - 提示触发器。
 * @slot - 提示内容。
 * @cssproperty [--zone-tooltip-trigger-display=inline-flex] 触发器显示方式。
 * @cssproperty [--zone-tooltip-background-color] 提示底色，默认跟随主题中性色，箭头使用同一颜色。
 * @cssproperty [--zone-tooltip-color] 提示文字色，默认白色；定制时需与底色一起检查对比度。
 * @cssproperty [--zone-tooltip-max-width=320px] 提示内容最大宽度。
 * @cssproperty [--zone-tooltip-padding=10px] 提示内容内边距。
 * @cssproperty [--zone-tooltip-font] 提示内容字体，默认14px与1.5倍行高。
 */
@customElement("zone-tooltip")
export class ZoneTooltip extends LitElement {
  static styles = [unsafeCSS(styles)];
  private static _activeTouchTooltip: ZoneTooltip | null = null;
  private static _nextId = 0;
  private _descriptionId = `zone-tooltip-description-${++ZoneTooltip._nextId}`;
  private _timer?: ReturnType<typeof setTimeout>;
  private _boundTarget?: HTMLElement;
  private _description?: HTMLSpanElement;
  private _control?: HTMLElement;
  private _observer?: MutationObserver;
  private _isScrolling = false;
  @query("zone-popover") private _popover!: ZonePopover;
  @property() placement: Placement = "top";
  /** 外部触发器的 ID，或通过 JavaScript 传入的元素。 */
  @property() target?: string | HTMLElement;

  private get _isTouchDevice() {
    return window.matchMedia?.("(pointer: coarse)").matches ?? false;
  }
  get visible(): boolean {
    return this._popover?.visible ?? false;
  }

  connectedCallback() {
    super.connectedCallback?.();
    window.addEventListener("click", this._outside);
    window.addEventListener("scroll", this._scroll, true);
    window.addEventListener("touchmove", this._scroll, { passive: true });
    this._observer = new MutationObserver(() => {
      this._bindTarget();
      this._syncDescription();
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    void this.updateComplete.then(() => {
      if (this.isConnected) this._bindTarget();
    });
  }
  protected firstUpdated() {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }
  protected updated(changed: PropertyValues) {
    if (changed.has("target")) this._bindTarget();
  }
  disconnectedCallback() {
    clearTimeout(this._timer);
    this._observer?.disconnect();
    this._hideImmediately();
    this._releaseTarget();
    window.removeEventListener("click", this._outside);
    window.removeEventListener("scroll", this._scroll, true);
    window.removeEventListener("touchmove", this._scroll);
    super.disconnectedCallback?.();
  }
  private _resolveTarget(): HTMLElement | undefined {
    if (typeof this.target === "string")
      return this.ownerDocument.getElementById(this.target) ?? undefined;
    return (
      this.target ??
      this.querySelector<HTMLElement>('[slot="tooltip-trigger"]') ??
      undefined
    );
  }
  private _releaseTarget() {
    const target = this._boundTarget;
    if (target) {
      target.removeEventListener("focusin", this.show);
      target.removeEventListener("focusout", this.hide);
      target.removeEventListener("mouseenter", this.show);
      target.removeEventListener("mouseleave", this.hide);
      target.removeEventListener("touchstart", this._touchStart);
      target.removeEventListener("touchmove", this._touchMove);
      target.removeEventListener("touchend", this._touchEnd);
    }
    if (this._control) {
      const ids = (this._control.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter((id) => id && id !== this._descriptionId);
      if (ids.length)
        this._control.setAttribute("aria-describedby", ids.join(" "));
      else this._control.removeAttribute("aria-describedby");
    }
    this._description?.remove();
    this._description = undefined;
    this._control = undefined;
    this._boundTarget = undefined;
  }
  private _bindTarget() {
    const target = this._resolveTarget();
    if (!this.isConnected || this._boundTarget === target) return;
    this._hideImmediately();
    this._releaseTarget();
    if (!target) return;
    this._boundTarget = target;
    target.addEventListener("focusin", this.show);
    target.addEventListener("focusout", this.hide);
    target.addEventListener("mouseenter", this.show);
    target.addEventListener("mouseleave", this.hide);
    target.addEventListener("touchstart", this._touchStart, { passive: true });
    target.addEventListener("touchmove", this._touchMove, { passive: true });
    target.addEventListener("touchend", this._touchEnd, { passive: true });
    void Promise.resolve(
      (target as HTMLElement & { updateComplete?: Promise<unknown> })
        .updateComplete,
    ).then(() => {
      if (!this.isConnected || this._boundTarget !== target) return;
      this._control =
        target.shadowRoot?.querySelector<HTMLElement>(
          "button, a, input, [tabindex]",
        ) ?? target;
      const description = this.ownerDocument.createElement("span");
      description.id = this._descriptionId;
      description.hidden = true;
      const root = this._control.getRootNode();
      (root instanceof ShadowRoot ? root : this.ownerDocument.body).append(
        description,
      );
      this._description = description;
      const ids = new Set(
        (this._control.getAttribute("aria-describedby") ?? "")
          .split(/\s+/)
          .filter(Boolean),
      );
      ids.add(this._descriptionId);
      this._control.setAttribute("aria-describedby", [...ids].join(" "));
      this._syncDescription();
    });
  }
  private _syncDescription() {
    if (this._description)
      this._description.textContent = [...this.childNodes]
        .filter(
          (node) =>
            !(
              node instanceof Element &&
              node.getAttribute("slot") === "tooltip-trigger"
            ),
        )
        .map((node) => node.textContent)
        .join(" ")
        .trim();
  }
  private _touchStart = () => {
    this._isScrolling = false;
  };
  private _touchMove = () => {
    this._isScrolling = true;
  };
  private _touchEnd = () => {
    if (!this._isScrolling) {
      if (this.visible) this.hide();
      else this.show();
    }
  };
  private _outside = (event: Event) => {
    const path = event.composedPath();
    if (
      this.visible &&
      !path.includes(this) &&
      !path.includes(this._boundTarget!)
    )
      this.hide();
  };
  private _scroll = () => {
    if (this.visible) this.hide();
  };

  show = () => {
    clearTimeout(this._timer);
    this._bindTarget();
    this._syncDescription();
    if (!this._popover || !this._boundTarget) return;
    if (this._isTouchDevice && ZoneTooltip._activeTouchTooltip !== this)
      ZoneTooltip._activeTouchTooltip?._hideImmediately();
    this._popover.manual = true;
    this._popover.target = this._boundTarget;
    const wasVisible = this.visible;
    this._popover.show();
    if (this._isTouchDevice) ZoneTooltip._activeTouchTooltip = this;
    if (!wasVisible && this.visible)
      this.dispatchEvent(new CustomEvent("zone-tooltip-show"));
  };
  private _onHide = () => {
    if (ZoneTooltip._activeTouchTooltip === this)
      ZoneTooltip._activeTouchTooltip = null;
    this.dispatchEvent(new CustomEvent("zone-tooltip-hide"));
  };
  private _hideImmediately() {
    clearTimeout(this._timer);
    this._popover?.hide();
    if (ZoneTooltip._activeTouchTooltip === this)
      ZoneTooltip._activeTouchTooltip = null;
  }
  hide = () => {
    clearTimeout(this._timer);
    this._timer = setTimeout(
      () => this._hideImmediately(),
      this._isTouchDevice ? 0 : 150,
    );
  };
  render() {
    return html` <slot
        class="trigger"
        name="tooltip-trigger"
        @slotchange=${this._bindTarget}
      ></slot>
      <zone-popover
        part="tooltip"
        .manual=${true}
        .target=${this._resolveTarget()}
        .arrowPadding=${14}
        .placement=${this.placement}
        @zone-popover-hide=${this._onHide}
      >
        <div
          class="content"
          role="tooltip"
          @mouseenter=${this.show}
          @mouseleave=${this.hide}
        >
          <slot @slotchange=${this._syncDescription}></slot>
        </div>
      </zone-popover>`;
  }
}
export default ZoneTooltip;
declare global {
  interface HTMLElementTagNameMap {
    "zone-tooltip": Pick<ZoneTooltip, keyof ZoneTooltip>;
  }
}
