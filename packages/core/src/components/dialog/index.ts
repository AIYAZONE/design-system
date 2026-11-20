import {
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
  CSSResultGroup,
  unsafeCSS,
} from "lit";
import { customElement, property, query, state } from "../../decorators";
import { classMap } from "lit/directives/class-map.js";
import { event, EventDispatcher } from "@aiyazone/utils";
import { I18nController } from "@aiyazone/i18n";
import { componentText } from "../component-text";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

import "../button";

export type DialogSize = "extra" | "large";

/**
 * @tag zone-dialog
 * @summary AIYAZONE 对话框组件
 *
 * @cssproperty [--zone-dialog-width=640px] - 设置对话框内容的宽度
 * @cssproperty [--zone-dialog-title-align=left] - 设置对话框标题的对齐方式
 * @cssproperty [--zone-dialog-index=500] - 设置对话框的z-index值
 * @cssproperty [--zone-dialog-close-icon-size=24px] - 关闭图标大小，点击区域至少为 44px
 */
@customElement("zone-dialog")
export class ZoneDialog extends LitElement {
  // Retain legacy HTML spellings while exposing the documented kebab-case attributes.
  private static readonly _attributeAliases: Record<string, string> = {
    showclose: "show-close",
    disablebodyscroll: "disable-body-scroll",
    arialabeltext: "aria-label-text",
    initialfocus: "initial-focus",
    closeicon: "close-icon",
  };
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...Object.keys(this._attributeAliases),
    ];
  }
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    value: string | null,
  ) {
    const canonical = ZoneDialog._attributeAliases[name];
    super.attributeChangedCallback?.(canonical ?? name, oldValue, value);
  }

  static styles = [unsafeCSS(styles)] as CSSResultGroup;
  private static _bodyScrollLockCount = 0;
  private static _rootStyleSnapshot: {
    overflow: string;
    paddingRight: string;
  } | null = null;
  private static _openDialogs: ZoneDialog[] = [];
  private static _inertSnapshots = new Map<HTMLElement, boolean>();
  private static _backgroundObserver?: MutationObserver;
  private _i18n?: I18nController;
  private _closeReason = "programmatic";
  @state() private _hasHeader = false;
  /** 关闭操作名称，默认跟随页面语言。 */
  @property({ attribute: "close-label" }) closeLabel?: string;

  connectedCallback() {
    super.connectedCallback?.();
    this._i18n = new I18nController(this, { observeHtmlLang: true });
    if (this.hasUpdated && this.open)
      void this.updateComplete.then(() => {
        if (this.isConnected) this.toggleDialogHandler();
      });
  }

  private static syncBackground() {
    for (const [element, wasInert] of this._inertSnapshots)
      element.toggleAttribute("inert", wasInert);
    this._inertSnapshots.clear();
    const active = this._openDialogs.at(-1);
    if (!active) {
      this._backgroundObserver?.disconnect();
      this._backgroundObserver = undefined;
      return;
    }
    let branch: Element = active;
    while (branch.parentNode) {
      const parent = branch.parentNode;
      if (parent instanceof Element || parent instanceof ShadowRoot) {
        for (const sibling of Array.from(parent.children)) {
          if (
            sibling === branch ||
            !(sibling instanceof HTMLElement) ||
            sibling.matches("script, style, link")
          )
            continue;
          this._inertSnapshots.set(sibling, sibling.hasAttribute("inert"));
          sibling.setAttribute("inert", "");
        }
      }
      if (parent instanceof ShadowRoot) branch = parent.host;
      else if (
        parent instanceof Element &&
        parent !== active.ownerDocument.documentElement
      )
        branch = parent;
      else break;
    }
    if (!this._backgroundObserver) {
      this._backgroundObserver = new MutationObserver(() =>
        this.syncBackground(),
      );
      this._backgroundObserver.observe(active.ownerDocument.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  private _focusTimer?: ReturnType<typeof setTimeout>;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);

    this.appendToTarget();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    window?.removeEventListener("keydown", this.onKeydown);
    clearTimeout(this._focusTimer);
    this._i18n?.hostDisconnected();
    ZoneDialog._openDialogs = ZoneDialog._openDialogs.filter(
      (dialog) => dialog !== this,
    );
    ZoneDialog.syncBackground();
    if (this._isBodyScrollLockedByThisDialog) {
      this.unlockBodyScroll();
    }
  }

  /**
   * 对话框尺寸
   */
  @property({
    type: String,
    reflect: true,
    hasChanged(newVal: DialogSize, oldVal: DialogSize) {
      const validSizes: DialogSize[] = ["extra", "large"];
      if (!validSizes.includes(newVal)) {
        console.warn(`Invalid dialog size: ${newVal}. Using 'large' instead.`);
        return false;
      }
      return newVal !== oldVal;
    },
  })
  size: DialogSize = "large";

  /**
   * 设置对话框的打开/关闭状态
   */
  @property({
    type: Boolean,
    reflect: true,
    hasChanged(newVal: boolean, oldVal: boolean | undefined) {
      if (newVal === false && oldVal === undefined) {
        return false;
      }
      return newVal !== oldVal;
    },
  })
  open = false;

  /**
   * 对话框标题文本；也可通过 header 插槽覆盖标题区域
   */
  @property({ type: String })
  caption?: string;

  /**
   * 关键对话框：屏蔽 ESC 与遮罩点击关闭，仅允许显式按钮或编程方式关闭
   */
  @property({ type: Boolean, reflect: true })
  critical = false;

  /**
   * 是否隐藏右上角关闭按钮（强制隐藏）
   */
  @property({ attribute: "no-close", type: Boolean, reflect: true })
  noClose = false;
  /**
   * 是否显示右上角关闭按钮（默认显示）
   */
  @property({ type: Boolean, reflect: true, attribute: "show-close" })
  showClose = true;
  /**
   * 打开时是否禁用页面滚动（body overflow: hidden）
   */
  @property({ type: Boolean, reflect: true, attribute: "disable-body-scroll" })
  disableBodyScroll = true;
  /**
   * 无标题时用于可访问性的 aria-label 文本
   */
  @property({ type: String, attribute: "aria-label-text" })
  ariaLabelText?: string;
  /**
   * 初始聚焦选择器（打开后首先聚焦的元素），支持匹配插槽内容或 Shadow 内部元素
   */
  @property({ type: String, attribute: "initial-focus" })
  initialFocus?: string;
  /**
   * 关闭图标
   */
  @property({ type: String, attribute: "close-icon" })
  closeIcon = "close-fill";

  /**
   * Dialog 挂载目标
   *
   * 支持 CSS Selector，例如：
   * - body
   * - #app
   * - .modal-root
   */
  @property({ attribute: "append-to", type: String, reflect: true })
  appendTo?: string;

  @query(".container")
  private container!: HTMLElement;
  /**
   * 打开前的触发源，用于关闭后恢复焦点
   */
  private _lastFocus?: Element | null;
  private _isBodyScrollLockedByThisDialog = false;

  /**
   * 对话框打开时触发（detail: { isOpen: true }）
   */
  @event("zone-dialog-open")
  private onOpen!: EventDispatcher<object>;

  /**
   * 请求关闭事件（可取消），detail.source 表示关闭来源：'close-button' | 'keyboard' | 'backdrop'
   */
  @event("zone-dialog-request-close")
  private onRequestClose!: EventDispatcher<{
    source: "close-button" | "keyboard" | "backdrop";
  }>;

  /**
   * 对话框关闭时触发（detail: { reason }），用于外部监听关闭完成
   */
  @event("zone-dialog-close")
  private onClose!: EventDispatcher<object>;
  // 统一仅使用 zone-dialog-* 事件，移除冗余别名

  /**
   * 属性变更生命周期：当 open 变化时处理打开/关闭
   */
  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("appendTo")) {
      this.appendToTarget();
    }

    if (changedProperties.has("open")) {
      this.toggleDialogHandler();
    }
  }

  /**
   * 将 Dialog 自身移动到指定 DOM 节点
   */
  private appendToTarget() {
    if (!this.appendTo) return;

    let target: Element | null = null;

    try {
      target = document.querySelector(this.appendTo);
    } catch {
      console.warn(
        `[zone-dialog] Invalid append-to selector: ${this.appendTo}`,
      );
      return;
    }

    if (!target) {
      console.warn(`[zone-dialog] Cannot find append target: ${this.appendTo}`);
      return;
    }

    if (this.parentElement !== target) {
      target.appendChild(this);
    }
  }

  /**
   * 打开/关闭统一入口：管理滚动锁、键盘监听、初始焦点设置与关闭后焦点恢复
   */
  private toggleDialogHandler() {
    try {
      if (this.open) {
        this.onOpen({ isOpen: true });
        this._lastFocus = this.deepActiveElement();
        ZoneDialog._openDialogs = ZoneDialog._openDialogs.filter(
          (dialog) => dialog !== this,
        );
        ZoneDialog._openDialogs.push(this);
        ZoneDialog.syncBackground();
        if (this.disableBodyScroll) this.lockBodyScroll();
        window?.addEventListener("keydown", this.onKeydown);
        this._focusTimer = setTimeout(() => {
          if (!this.open || !this.isConnected) return;
          const root = this.shadowRoot;
          if (!root) return;
          let target: HTMLElement | null = null;
          if (this.initialFocus) {
            target =
              (root.querySelector(this.initialFocus) as HTMLElement) ||
              (this.querySelector(this.initialFocus) as HTMLElement);
          }
          if (!target) {
            const content = root.querySelector<HTMLElement>(".content");
            if (content) content.scrollTop = 0;
            const focusables = this.focusableElements();
            // Read long content from its beginning instead of jumping to a footer action.
            target = content && content.scrollHeight > content.clientHeight
              ? this.container
              : focusables[0] || this.container;
          }
          target?.focus();
        }, 0);
      } else {
        clearTimeout(this._focusTimer);
        ZoneDialog._openDialogs = ZoneDialog._openDialogs.filter(
          (dialog) => dialog !== this,
        );
        ZoneDialog.syncBackground();
        this.onClose(
          { isOpen: false, reason: this._closeReason },
          { bubbles: false },
        );
        this._closeReason = "programmatic";
        this.unlockBodyScroll();
        this.restoreLastFocus();
        window?.removeEventListener("keydown", this.onKeydown);
        this.dispatchEvent(new Event("closed", { bubbles: true }));
      }
    } catch (error) {
      console.error("Dialog toggle error:", error);
    }
  }

  /**
   * 锁定页面滚动
   *
   * 仅对根元素设置 overflow: hidden，不改变 body 的定位与文档流位置，
   * 因此不会引起页面位移或重排；文档滚动位置由浏览器原样保留
   */
  private lockBodyScroll() {
    if (this._isBodyScrollLockedByThisDialog) return;

    if (ZoneDialog._bodyScrollLockCount === 0) {
      const root = document.documentElement;
      const scrollX = window.scrollX || window.pageXOffset || 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      ZoneDialog._rootStyleSnapshot = {
        overflow: root.style.overflow,
        paddingRight: root.style.paddingRight,
      };

      const widthBeforeLock = root.clientWidth;
      root.style.overflow = "hidden";
      // 只有滚动条真正消失，视口可用宽度才会变大，据此补偿等宽内边距以消除页面横向抖动
      const scrollbarWidth = root.clientWidth - widthBeforeLock;
      if (scrollbarWidth > 0) {
        const currentPadding =
          parseFloat(getComputedStyle(root).paddingRight) || 0;
        root.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }

      // 兼容个别浏览器隐藏滚动条时重置滚动位置的实现（如部分 iOS Safari 版本）
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) {
        window.scrollTo(scrollX, scrollY);
      }
    }

    ZoneDialog._bodyScrollLockCount += 1;
    this._isBodyScrollLockedByThisDialog = true;
  }

  private unlockBodyScroll() {
    if (!this._isBodyScrollLockedByThisDialog) return;

    ZoneDialog._bodyScrollLockCount = Math.max(
      0,
      ZoneDialog._bodyScrollLockCount - 1,
    );
    this._isBodyScrollLockedByThisDialog = false;

    if (ZoneDialog._bodyScrollLockCount > 0) return;

    const root = document.documentElement;
    const snapshot = ZoneDialog._rootStyleSnapshot;
    root.style.overflow = snapshot?.overflow ?? "";
    root.style.paddingRight = snapshot?.paddingRight ?? "";
    ZoneDialog._rootStyleSnapshot = null;
  }

  private restoreFocus(target?: HTMLElement | null) {
    if (!target?.focus) return;

    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  }

  private restoreLastFocus() {
    const last = this._lastFocus as HTMLElement | null;
    this._lastFocus = null;
    this.restoreFocus(last);
  }

  private deepActiveElement(): Element | null {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement)
      active = active.shadowRoot.activeElement;
    return active;
  }

  private focusableElements(): HTMLElement[] {
    const result: HTMLElement[] = [];
    const visit = (element: Element) => {
      if (element.hasAttribute("hidden") || element.hasAttribute("inert"))
        return;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return;
      if (element instanceof HTMLSlotElement) {
        element.assignedElements({ flatten: true }).forEach(visit);
        return;
      }
      if (element.shadowRoot) {
        Array.from(element.shadowRoot.children).forEach(visit);
        return;
      }
      if (
        element instanceof HTMLElement &&
        element.tabIndex >= 0 &&
        !element.matches(
          ':disabled, [aria-disabled="true"], input[type="hidden"]',
        )
      ) {
        result.push(element);
      }
      Array.from(element.children).forEach(visit);
    };
    visit(this.container);
    return result;
  }

  /**
   * 触发可取消的关闭请求；未被阻止则设置 open=false 并派发关闭事件
   * @param source 关闭来源（按钮、键盘 ESC、遮罩点击）
   */
  private closeDialog(source: "close-button" | "keyboard" | "backdrop") {
    const requestCloseEvent = this.onRequestClose(
      { source },
      { cancelable: true },
    );

    if (requestCloseEvent.defaultPrevented) {
      return;
    }

    this._closeReason = source;
    this.open = false;
  }

  /**
   * 遮罩点击处理：点击容器外即认为遮罩点击；critical=true 时不生效
   */
  private clickOutsideHandler = (event: MouseEvent) => {
    if (this.critical) return;
    const eventPath = event.composedPath() as HTMLElement[];
    if (!eventPath.includes(this.container)) {
      this.closeDialog("backdrop");
    }
  };

  /**
   * 键盘处理：ESC 关闭（critical 禁止）、Tab/Shift+Tab 焦点循环在对话框范围内
   */
  private onKeydown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented || ZoneDialog._openDialogs.at(-1) !== this)
      return;
    if (event.code === "Escape" && this.open && !this.critical) {
      event.preventDefault();
      this.closeDialog("keyboard");
    }
    if (event.code === "Tab" && this.open) {
      const focusables = this.focusableElements();
      if (focusables.length === 0) {
        this.container.focus();
        event.preventDefault();
        return;
      }
      const currentIndex = focusables.indexOf(
        this.deepActiveElement() as HTMLElement,
      );
      const dir = event.shiftKey ? -1 : 1;
      const nextIndex =
        currentIndex < 0
          ? event.shiftKey
            ? focusables.length - 1
            : 0
          : (currentIndex + dir + focusables.length) % focusables.length;
      focusables[nextIndex].focus();
      event.preventDefault();
    }
  };

  /**
   * 渲染对话框容器与标题、关闭按钮、内容插槽
   */
  private renderContainer() {
    const title = this.caption
      ? html`<h2 part="dialog-title" class="zone-h4">${this.caption}</h2>`
      : "";
    const showClose = this.showClose && !this.noClose;
    const closeButton = showClose
      ? html`<button
          type="button"
          part="dialog-close"
          class="close"
          aria-label=${this.closeLabel ?? componentText(this.ownerDocument, "close")}
          @click="${() => this.closeDialog("close-button")}"
        >
          <zone-icon
            class="close"
            name="${this.closeIcon}"
            aria-hidden="true"
          ></zone-icon>
        </button>`
      : null;

    const classes = {
      container: true,
    };

    return html`<div
      part="dialog-container"
      tabindex="-1"
      class="${classMap(classes)}"
    >
      ${closeButton}
      <section part="dialog-content" class="content">
        <div id="dialogCaption" ?hidden=${!this.caption && !this._hasHeader}>
          <slot
            name="header"
            @slotchange=${(event: Event) => {
              this._hasHeader =
                (event.target as HTMLSlotElement).assignedElements().length > 0;
            }}
            >${title}</slot
          >
        </div>
        <slot></slot>
        <slot name="footer"></slot>
      </section>
    </div>`;
  }

  /**
   * 渲染外层 overlay 与 aria 属性：role='dialog'、aria-modal、aria-labelledby/aria-label
   */
  render(): TemplateResult {
    const labelledBy = this.caption || this._hasHeader ? "dialogCaption" : "";
    return html`<div
      part="dialog-polyfill"
      class="dialog-polyfill"
      role="dialog"
      aria-modal="true"
      aria-labelledby="${labelledBy}"
      aria-label="${!labelledBy && this.ariaLabelText ? this.ariaLabelText : ""}"
      @click=${this.clickOutsideHandler}
    >
      ${this.renderContainer()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zone-dialog": Pick<ZoneDialog, keyof ZoneDialog>;
  }
}
