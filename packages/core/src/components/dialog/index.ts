import { html, LitElement, PropertyValues, TemplateResult, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property, query } from "../../decorators";
import { classMap } from "lit/directives/class-map.js";
import { event, EventDispatcher } from "@jackery/utils";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

import "../button";

export type DialogSize = "extra" | "large";

/**
 * @tag jds-dialog
 * @summary Jackery 对话框组件
 *
 * @cssproperty [--jds-dialog-width=640px] - 设置对话框内容的宽度
 * @cssproperty [--jds-dialog-title-align=left] - 设置对话框标题的对齐方式
 * @cssproperty [--jds-dialog-index=500] - 设置对话框的z-index值
 */
@customElement("jds-dialog")
export class JdsDialog extends LitElement {
  static styles =  [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
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
    }
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
  @property({ type: Boolean, reflect: true })
  showClose = true;
  /**
   * 打开时是否禁用页面滚动（body overflow: hidden）
   */
  @property({ type: Boolean, reflect: true })
  disableBodyScroll = true;
  /**
   * 无标题时用于可访问性的 aria-label 文本
   */
  @property({ type: String })
  ariaLabelText?: string;
  /**
   * 初始聚焦选择器（打开后首先聚焦的元素），支持匹配插槽内容或 Shadow 内部元素
   */
  @property({ type: String })
  initialFocus?: string;
  /**
   * 关闭图标
   */
  @property({ type: String })
  closeIcon = "close-fill";

  @query(".container")
  private container!: HTMLElement;
  /**
   * 打开前的触发源，用于关闭后恢复焦点
   */
  private _lastFocus?: Element | null;

  /**
   * 对话框打开时触发（detail: { isOpen: true }）
   */
  @event("jds-dialog-open")
  private onOpen!: EventDispatcher<object>;

  /**
   * 请求关闭事件（可取消），detail.source 表示关闭来源：'close-button' | 'keyboard' | 'backdrop'
   */
  @event("jds-dialog-request-close")
  private onRequestClose!: EventDispatcher<{
    source: "close-button" | "keyboard" | "backdrop";
  }>;

  /**
   * 对话框关闭时触发（detail: { reason }），用于外部监听关闭完成
   */
  @event("jds-dialog-close")
  private onClose!: EventDispatcher<object>;
  // 统一仅使用 jds-dialog-* 事件，移除冗余别名

  /**
   * 属性变更生命周期：当 open 变化时处理打开/关闭
   */
  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("open")) {
      this.toggleDialogHandler();
    }
  }

  /**
   * 打开/关闭统一入口：管理滚动锁、键盘监听、初始焦点设置与关闭后焦点恢复
   */
  private toggleDialogHandler() {
    try {
      if (this.open) {
        this.onOpen({ isOpen: true });
        this._lastFocus = document.activeElement;
        if (this.disableBodyScroll) document.body.style.overflow = "hidden";
        window?.addEventListener("keydown", this.onKeydown);
        setTimeout(() => {
          const root = this.shadowRoot;
          if (!root) return;
          let target: HTMLElement | null = null;
          if (this.initialFocus) {
            target = root.querySelector(this.initialFocus) as HTMLElement || (this.querySelector(this.initialFocus) as HTMLElement);
          }
          if (!target) {
            const focusables = root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            target = focusables[0] || this.container;
          }
          target?.focus();
        }, 0);
      } else {
        this.onClose({ isOpen: false }, { bubbles: false });
        document.body.style.overflow = "auto";
        window?.removeEventListener("keydown", this.onKeydown);
        this.dispatchEvent(new Event("closed", { bubbles: true }));
        const last = this._lastFocus as HTMLElement | null;
        this._lastFocus = null;
        last?.focus();
      }
    } catch (error) {
      console.error("Dialog toggle error:", error);
    }
  }

  /**
   * 触发可取消的关闭请求；未被阻止则设置 open=false 并派发关闭事件
   * @param source 关闭来源（按钮、键盘 ESC、遮罩点击）
   */
  private closeDialog(source: "close-button" | "keyboard" | "backdrop") {
    const requestCloseEvent = this.onRequestClose(
      { source },
      { cancelable: true }
    );

    if (requestCloseEvent.defaultPrevented) {
      return;
    }

    this.open = false;
    this.onClose({ reason: source });
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
    if (event.code === "Escape" && this.open && !this.critical) {
      event.preventDefault();
      this.closeDialog("keyboard");
    }
    if (event.code === "Tab" && this.open) {
      const root = this.shadowRoot;
      if (!root) return;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      if (focusables.length === 0) return;
      const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
      const dir = event.shiftKey ? -1 : 1;
      const nextIndex = (currentIndex + dir + focusables.length) % focusables.length;
      focusables[nextIndex].focus();
      event.preventDefault();
    }
  };

  /**
   * 渲染对话框容器与标题、关闭按钮、内容插槽
   */
  private renderContainer() {
    const title = this.caption
      ? html`<h4 id="dialogCaption" part="dialog-title" class="jds-h4" .innerHTML="${this.caption}"></h4>`
      : "";
    const showClose = this.showClose && !this.noClose;
    const closeButton = showClose
      ? html`<jds-icon
          part="dialog-close"
          class="close"
          @click="${() => this.closeDialog("close-button")}"
          name="${this.closeIcon}"
          label="close"
        ></jds-icon>`
      : null;

    const classes = {
      container: true,
    };

    return html`<div part="dialog-container" class="${classMap(classes)}">
      ${closeButton}
      <section part="dialog-content" class="content">
        ${title}
        <slot></slot>
      </section>
    </div>`;
  }

  /**
   * 渲染外层 overlay 与 aria 属性：role='dialog'、aria-modal、aria-labelledby/aria-label
   */
  render(): TemplateResult {
    const labelledBy = this.caption ? "dialogCaption" : "";
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
    "jds-dialog": JdsDialog;
  }
}
