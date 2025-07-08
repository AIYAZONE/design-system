import { html, LitElement, PropertyValues, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { event, EventDispatcher } from "../../utils/event";
import styles from "./index.less?inline";
import "../button";

// 对话框尺寸类型定义：特大、大（默认）
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
export default class JdsDialog extends LitElement {
  // 组件的样式
  static styles = [unsafeCSS(styles)];

  /**
   * 对话框尺寸
   */
  @property({
    type: String,
    reflect: true,
    hasChanged(newVal: DialogSize, oldVal: DialogSize) {
      const validSizes: DialogSize[] = ['extra', 'large'];
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
      // 如果新值为false且旧值为undefined，则假设初始值为false
      if (newVal === false && oldVal === undefined) {
        return false;
      }
      return newVal !== oldVal;
    },
  })
  open = false; // 对话框的状态，默认关闭

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
  @property({ type: Boolean, reflect: true })
  noClose = false;

  // 查询选择器，获取对话框相关元素
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

  // 当属性发生变化时执行的逻辑
  updated(changedProperties: PropertyValues<this>) {
    // 如果`open`属性发生变化，则切换对话框的处理程序
    if (changedProperties.has("open")) {
      this.toggleDialogHandler();
    }
  }

  // 切换对话框的处理程序
  private toggleDialogHandler() {
    try {
      if (this.open) {
        // 打开对话框
        this.onOpen({ isOpen: true });
        document.body.style.overflow = "hidden"; // 禁止背景滚动
        // 添加事件监听器
        window?.addEventListener("keydown", this.onKeydown);
      } else {
        // 关闭对话框
        this.onClose({ isOpen: false }, { bubbles: false });
        document.body.style.overflow = "auto"; // 恢复背景滚动
        // 移除事件监听器
        window?.removeEventListener("keydown", this.onKeydown);
        this.dispatchEvent(new Event("closed", { bubbles: true })); // 确保触发关闭事件
      }
    } catch (error) {
      console.error('Dialog toggle error:', error);
    }
  }

  // 关闭对话框的方法
  private closeDialog(source: "close-button" | "keyboard" | "backdrop") {
    // 触发请求关闭事件，如果事件被阻止，则不关闭对话框
    const requestCloseEvent = this.onRequestClose(
      { source },
      { cancelable: true }
    );

    if (requestCloseEvent.defaultPrevented) {
      return; // 如果关闭被阻止，提前返回
    }

    this.open = false; // 关闭对话框
  }

  // 处理点击对话框外部的事件
  private clickOutsideHandler = (event: MouseEvent) => {
    if (this.critical) return; // 关键对话框不允许点击外部关闭

    const eventPath = event.composedPath() as HTMLElement[];

    // 如果点击事件的目标不是对话框容器，则关闭对话框
    if (!eventPath.includes(this.container)) {
      this.closeDialog("backdrop");
    }
  };

  // 处理按键事件
  private onKeydown = (event: KeyboardEvent): void => {
    // 如果按下 Escape 键且对话框处于打开状态且不是关键对话框，则关闭对话框
    if (event.code === "Escape" && this.open && !this.critical) {
      event.preventDefault(); // 阻止默认行为
      this.closeDialog("keyboard");
    }
  };

  // 渲染对话框容器
  private renderContainer() {
    const title = this.caption
      ? html`<h4 id="dialogCaption" class="jds-h4" .innerHTML="${this.caption}"></h4>`
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

  // 渲染组件
  render(): TemplateResult {
    return html`<div
      part="dialog-polyfill"
      class="dialog-polyfill"
      role="dialog"
      aria-modal="true"
      aria-labelledby="${this.caption ? 'dialogCaption' : ''}"
      @click=${this.clickOutsideHandler}
    >
      ${this.renderContainer()}
    </div>`;
  }
}

// 声明全局接口，以便在 HTML 中使用 `jds-dialog` 标签
declare global {
  interface HTMLElementTagNameMap {
    "jds-dialog": JdsDialog;
  }
}
