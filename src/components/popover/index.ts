import { html, LitElement, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  inline,
  Middleware,
  MiddlewareState,
  offset,
  shift,
  size,
} from "@floating-ui/dom";
import { getTarget } from "../../utils/elements";
import { event, EventDispatcher } from "../../utils/event";
import styles from "./index.less?inline";

export type Placement =
  | "top-start"
  | "top"
  | "top-end"
  | "bottom-start"
  | "bottom"
  | "bottom-end"
  | "left-start"
  | "left"
  | "left-end"
  | "right-start"
  | "right"
  | "right-end";

/**
 * @tag jds-popover
 * @summary Jackery Popover 组件
 *
 * @cssproperty [--jds-popover-arrow-display=none] - 设置弹出框箭头的显示。设置为 `block` 以使箭头可见。
 * @cssproperty [--jds-popover-background-color=--bl-color-neutral-full] - 设置弹出框的背景颜色。
 * @cssproperty [--jds-popover-border-color=--bl-color-primary-highlight] - 设置弹出框的边框颜色。
 * @cssproperty [--jds-popover-border-size=1px] - 设置弹出框的边框大小。可以设置为 `0px` 以去掉边框（如果使用自定义背景颜色）。始终使用长度单位。
 * @cssproperty [--jds-popover-padding=--bl-size-m] - 设置弹出框的内边距。
 * @cssproperty [--jds-popover-border-radius=--bl-size-3xs] - 设置弹出框的边框圆角。
 * @cssproperty [--jds-popover-max-width=100vw] - 设置弹出框的最大宽度（包括边框和内边距）。
 * @cssproperty [--jds-popover-position=fixed] - 设置弹出框的位置。可以设置为 `absolute` 如果父元素是固定定位的元素，如抽屉或对话框。
 */
@customElement("jds-popover")
export default class JdsPopover extends LitElement {
  static styles = [unsafeCSS(styles)];

  @query(".popover") private _popover!: HTMLElement;
  @query(".arrow") private arrow!: HTMLElement;

  /**
   * 设置弹出框的位置
   */
  @property({ type: String })
  placement: Placement = "bottom";

  /**
   * 目标元素的状态
   */
  @state() _target!: string | Element;

  /**
   * 设置弹出框与触发元素相同的大小
   */
  @property({ type: Boolean, attribute: "fit-size" })
  fitSize = false;

  /**
   * 设置弹出框与目标/触发元素之间的距离
   */
  @property({ type: Number })
  offset = 8;

  /**
   * 可见性状态
   */
  @state() private _visible = false;

  /**
   * 当弹出框显示时触发
   */
  @event("jds-popover-show") private onJdsPopoverShow!: EventDispatcher<string>;

  /**
   * 当弹出框隐藏时触发
   */
  @event("jds-popover-hide") private onJdsPopoverHide!: EventDispatcher<string>;

  connectedCallback() {
    super.connectedCallback();

    this._handlePopoverShowEvent = this._handlePopoverShowEvent.bind(this);
    this._handleKeydownEvent = this._handleKeydownEvent.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.popoverAutoUpdateCleanup && this.popoverAutoUpdateCleanup();
  }

  private getMiddleware(): Middleware[] {
    const middlewareParams: Middleware[] = [];

    middlewareParams.push(
      offset(this.offset),
      inline(),
      flip(),
      shift({ padding: 4 })
    );

    if (this.fitSize) {
      middlewareParams.push(
        size({
          apply(args: MiddlewareState) {
            if (args.elements.floating && args.elements.reference) {
              Object.assign(args.elements.floating.style, {
                "min-width": `${
                  args.elements.reference.getBoundingClientRect().width
                }px`,
              });
            }
          },
        })
      );
    }

    middlewareParams.push(arrow({ element: this.arrow, padding: 5 }));

    return middlewareParams;
  }

  private _handleClickOutside = (event: MouseEvent) => {
    const eventPath = event.composedPath() as HTMLElement[];

    if (
      !eventPath.includes(this._target as HTMLElement) &&
      !eventPath.includes(this)
    ) {
      this.hide();
    }
  };

  private popoverAutoUpdateCleanup?: () => void;

  private setPopover() {
    if (this.target) {
      this.popoverAutoUpdateCleanup = autoUpdate(
        this.target as Element,
        this._popover,
        () => {
          computePosition(this.target as Element, this._popover, {
            placement: this.placement,
            strategy: "fixed",
            middleware: this.getMiddleware(),
          }).then(({ x, y, placement, middlewareData }) => {
            Object.assign(this._popover.style, {
              left: `${x}px`,
              top: `${y}px`,
            });

            this._popover.dataset.placement = placement;

            if (middlewareData.arrow) {
              const { x: arrowX, y: arrowY } = middlewareData.arrow;

              Object.assign(this.arrow.style, {
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
              });
            }
          });
        }
      );
    }
  }

  /**
   * 设置弹出框的目标元素以对齐和触发。
   * 目标可以是目标元素的字符串 ID 或直接的 Element 引用。
   */
  @property()
  get target(): string | Element {
    return this._target;
  }

  set target(value: string | Element) {
    const target = getTarget(value);

    if (!target) {
      console.warn(
        "JdsPopover 的目标仅接受 Element 实例或 DOM 元素的字符串 ID。"
      );
      return;
    }

    this._target = target;
  }

  /**
   * 显示弹出框
   */
  show() {
    this._visible = true;
    this.setPopover();
    this.onJdsPopoverShow("");
    document.addEventListener("click", this._handleClickOutside);
    document.addEventListener("keydown", this._handleKeydownEvent);
    document.addEventListener("jds-popover-show", this._handlePopoverShowEvent);
  }

  /**
   * 隐藏弹出框
   */
  hide() {
    this._visible = false;
    document.removeEventListener("click", this._handleClickOutside);
    document.removeEventListener("keydown", this._handleKeydownEvent);
    document.removeEventListener(
      "jds-popover-show",
      this._handlePopoverShowEvent
    );
    this.onJdsPopoverHide("");
  }

  /**
   * 获取弹出框的可见性状态
   */
  get visible(): boolean {
    return this._visible;
  }

  private _handlePopoverShowEvent(event: Event) {
    if (event.target !== this) {
      const { parentElement } = event.target as HTMLElement;
      const isNestedPopover = this.contains(parentElement);

      if (
        !isNestedPopover &&
        (event.target as HTMLElement).tagName === this.tagName
      ) {
        this.hide();
      }
    }
  }

  private _handleKeydownEvent(event: KeyboardEvent) {
    if (event.key === "Escape" && this.visible) {
      event.preventDefault();
      this.hide();
    }
  }

  render(): TemplateResult {
    const classes = classMap({
      popover: true,
      visible: this._visible,
    });

    return html`<div part="popover" class=${classes}>
      <slot id="popover" aria-live=${this._visible ? "polite" : "off"}></slot>
      <div class="arrow" aria-hidden="true"></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jds-popover": JdsPopover;
  }
}
