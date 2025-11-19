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
   * 设置对话框的标题
   */
  @property({ type: String })
  caption?: string;

  /**
   * 确定对话框是否为关键对话框，关键对话框无法通过键盘、遮罩层关闭。
   */
  @property({ type: Boolean, reflect: true })
  critical = false;

  /**
   * 确定对话框是否隐藏关闭按钮Icon。
   */
  @property({ attribute: "no-close", type: Boolean, reflect: true })
  noClose = false;

  @query(".container")
  private container!: HTMLElement;

  /**
   * 对话框打开时触发
   */
  @event("jds-dialog-open")
  private onOpen!: EventDispatcher<object>;

  /**
   * 在通过内部操作关闭对话框之前触发。
   */
  @event("jds-dialog-request-close")
  private onRequestClose!: EventDispatcher<{
    source: "close-button" | "keyboard" | "backdrop";
  }>;

  /**
   * 对话框关闭时触发
   */
  @event("jds-dialog-close")
  private onClose!: EventDispatcher<object>;

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("open")) {
      this.toggleDialogHandler();
    }
  }

  private toggleDialogHandler() {
    try {
      if (this.open) {
        this.onOpen({ isOpen: true });
        document.body.style.overflow = "hidden";
        window?.addEventListener("keydown", this.onKeydown);
      } else {
        this.onClose({ isOpen: false }, { bubbles: false });
        document.body.style.overflow = "auto";
        window?.removeEventListener("keydown", this.onKeydown);
        this.dispatchEvent(new Event("closed", { bubbles: true }));
      }
    } catch (error) {
      console.error("Dialog toggle error:", error);
    }
  }

  private closeDialog(source: "close-button" | "keyboard" | "backdrop") {
    const requestCloseEvent = this.onRequestClose(
      { source },
      { cancelable: true }
    );

    if (requestCloseEvent.defaultPrevented) {
      return;
    }

    this.open = false;
  }

  private clickOutsideHandler = (event: MouseEvent) => {
    if (this.critical) return;
    const eventPath = event.composedPath() as HTMLElement[];
    if (!eventPath.includes(this.container)) {
      this.closeDialog("backdrop");
    }
  };

  private onKeydown = (event: KeyboardEvent): void => {
    if (event.code === "Escape" && this.open && !this.critical) {
      event.preventDefault();
      this.closeDialog("keyboard");
    }
  };

  private renderContainer() {
    const title = this.caption
      ? html`<h4 id="dialogCaption" part="dialog-title" class="jds-h4" .innerHTML="${this.caption}"></h4>`
      : "";
    const closeButton = !this.noClose
      ? html`<jds-icon
          part="dialog-close"
          class="close"
          @click="${() => this.closeDialog("close-button")}"
          name="close-fill"
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

  render(): TemplateResult {
    return html`<div
      part="dialog-polyfill"
      class="dialog-polyfill"
      role="dialog"
      aria-modal="true"
      aria-labelledby="${this.caption ? "dialogCaption" : ""}"
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
