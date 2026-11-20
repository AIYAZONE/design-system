import {
  html,
  LitElement,
  CSSResultGroup,
  unsafeCSS,
  type PropertyValues,
} from "lit";
import { customElement, property, query, state } from "../../decorators";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
  arrow as flArrow,
  Placement,
} from "@floating-ui/dom";

import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * AIYAZONE 气泡卡片组件
 * 点击 / 悬停触发浮层，支持自定义触发元素、箭头与定位方向
 *
 * @cssproperty [--zone-index-popover=100] - 浮层层级
 * @cssproperty [--zone-popover-color] - 浮层正文颜色，默认使用一级文字色
 * @cssproperty [--zone-popover-viewport-gutter=16px] - 视口两侧预留的总间距
 */
@customElement("zone-popover")
export class ZonePopover extends LitElement {
  private static _openPopovers: ZonePopover[] = [];
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  @property({ type: String })
  placement: Placement = "bottom";

  @property({ type: Boolean })
  fitSize = false;

  @property({ type: Number })
  offset = 8;

  @property({ type: Number, attribute: "arrow-padding" })
  arrowPadding = 8;

  @property({ type: String })
  target?: string | HTMLElement;

  /** 由 Tooltip 等上层组件管理触发，不自动绑定点击或菜单语义。 */
  @property({ type: Boolean }) manual = false;

  get visible(): boolean {
    return this._visible;
  }
  private _targetAttributes?: [string | null, string | null];
  private _positionVersion = 0;

  @state()
  private _visible = false;

  @query(".popover")
  private _popoverEl!: HTMLElement;

  @query(".arrow")
  private _arrowEl!: HTMLElement;

  private _targetEl?: HTMLElement;
  private _cleanup?: () => void;
  private readonly _viewportPadding = 8;

  connectedCallback() {
    super.connectedCallback?.();
    void this.updateComplete.then(() => {
      if (this.isConnected) this._setupTarget();
    });
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("target") || changed.has("manual")) this._setupTarget();
    if (
      this._visible &&
      (changed.has("placement") ||
        changed.has("offset") ||
        changed.has("arrowPadding"))
    )
      this.setPopover();
  }

  disconnectedCallback() {
    this.hide();
    this._releaseTarget();
    super.disconnectedCallback?.();
  }

  private _releaseTarget() {
    if (!this._targetEl) return;
    this._targetEl.removeEventListener("click", this._togglePopover);
    if (this._targetAttributes) {
      ["aria-haspopup", "aria-expanded"].forEach((name, index) => {
        const value = this._targetAttributes![index];
        if (value === null) this._targetEl!.removeAttribute(name);
        else this._targetEl!.setAttribute(name, value);
      });
    }
    this._targetAttributes = undefined;
    this._targetEl = undefined;
  }

  private _setupTarget() {
    const root = this.getRootNode() as Document | ShadowRoot;
    const next =
      typeof this.target === "string"
        ? (root.getElementById?.(this.target) ??
          this.ownerDocument.getElementById(this.target))
        : (this.target ?? this.previousElementSibling);
    if (this._targetEl === next && !!this._targetAttributes === !this.manual)
      return;
    this._releaseTarget();
    this._targetEl = next instanceof HTMLElement ? next : undefined;
    if (this._targetEl && !this.manual) {
      this._targetAttributes = [
        this._targetEl.getAttribute("aria-haspopup"),
        this._targetEl.getAttribute("aria-expanded"),
      ];
      this._targetEl.addEventListener("click", this._togglePopover);
      this._targetEl.setAttribute("aria-haspopup", "dialog");
      this._targetEl.setAttribute("aria-expanded", String(this._visible));
    }
    if (this._visible) {
      if (this._targetEl) this.setPopover();
      else this.hide();
    }
  }

  private _togglePopover = () => {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  };

  private getMiddleware() {
    const middleware = [
      offset(this.offset),
      flip({ padding: this._viewportPadding }),
      shift({ crossAxis: true, padding: this._viewportPadding }),
    ];

    if (this._arrowEl) {
      middleware.push(
        flArrow({ element: this._arrowEl, padding: this.arrowPadding }),
      );
    }

    return middleware;
  }

  private _handleClickOutside = (event: Event) => {
    if (!this._visible) return;

    const path = event.composedPath();
    if (!path.includes(this) && !path.includes(this._targetEl!)) {
      this.hide();
    }
  };

  private _handleKeydownEvent = (event: KeyboardEvent) => {
    if (
      event.key === "Escape" &&
      !event.defaultPrevented &&
      ZonePopover._openPopovers.at(-1) === this
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
    }
  };

  show() {
    this._setupTarget();
    if (this._visible || !this._targetEl || !this.isConnected) return;

    this._visible = true;
    ZonePopover._openPopovers.push(this);
    if (!this.manual) this._targetEl?.setAttribute("aria-expanded", "true");

    document.addEventListener("click", this._handleClickOutside);
    document.addEventListener("keydown", this._handleKeydownEvent);

    this.dispatchEvent(new CustomEvent("zone-popover-show"));

    this.updateComplete.then(() => {
      this.setPopover();
    });
  }

  hide() {
    if (!this._visible) return;

    let focus = this.ownerDocument.activeElement;
    while (focus?.shadowRoot?.activeElement)
      focus = focus.shadowRoot.activeElement;
    const restore =
      !this.manual &&
      !!focus &&
      (this.contains(focus) || this._popoverEl?.contains(focus));
    this._visible = false;
    ZonePopover._openPopovers = ZonePopover._openPopovers.filter(
      (popover) => popover !== this,
    );
    if (restore) this._targetEl?.focus();
    if (!this.manual) this._targetEl?.setAttribute("aria-expanded", "false");

    document.removeEventListener("click", this._handleClickOutside);
    document.removeEventListener("keydown", this._handleKeydownEvent);

    this.dispatchEvent(new CustomEvent("zone-popover-hide"));
    this._positionVersion++;
    this._cleanup?.();
    this._cleanup = undefined;
  }

  setPopover() {
    if (
      !this._visible ||
      !this.isConnected ||
      !this._targetEl ||
      !this._popoverEl
    )
      return;
    this._cleanup?.();
    const version = ++this._positionVersion;

    this._cleanup = autoUpdate(this._targetEl, this._popoverEl, () => {
      if (!this._targetEl || !this._popoverEl) return;

      computePosition(this._targetEl, this._popoverEl, {
        placement: this.placement,
        middleware: [
          ...this.getMiddleware(),
          size({
            padding: this._viewportPadding,
            apply({ availableHeight, elements }) {
              elements.floating.style.setProperty(
                "--_available-height",
                `${Math.max(0, availableHeight)}px`,
              );
            },
          }),
        ],
        strategy: "fixed",
      }).then(({ x, y, placement, middlewareData }) => {
        if (
          !this._popoverEl ||
          !this._visible ||
          version !== this._positionVersion
        )
          return;

        Object.assign(this._popoverEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        this._popoverEl.setAttribute("data-placement", placement);

        if (this._arrowEl && middlewareData?.arrow) {
          const { x: ax, y: ay } = middlewareData.arrow as {
            x?: number;
            y?: number;
          };
          Object.assign(this._arrowEl.style, {
            left: ax != null ? `${ax}px` : "",
            top: ay != null ? `${ay}px` : "",
          });
        }
      });
    });
  }

  render() {
    return html`
      <div
        class="popover ${this._visible ? "visible" : ""}"
        role=${this.manual ? "presentation" : "dialog"}
        aria-label=${this.manual ? "" : this.getAttribute("aria-label") || "Popover"}
      >
        <div class="popover__content"><slot></slot></div>
        <div class="arrow" part="arrow"></div>
      </div>
    `;
  }
}

export type { Placement };

declare global {
  interface HTMLElementTagNameMap {
    "zone-popover": Pick<ZonePopover, keyof ZonePopover>;
  }
}
