import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { event, EventDispatcher } from "../../utils/event";
import "../button/jds-button";

// 定义对话框元素的接口
interface DialogElement {
  showModal: () => void;
  close: () => void;
}

/**
 * @tag jds-dialog
 * @summary Baklava 对话框组件
 *
 * @cssproperty [--jds-dialog-width=auto] - 设置对话框内容的宽度
 * @cssproperty [--jds-dialog-caption-line-clamp=1] - 设置标题的显示行数
 */
@customElement("jds-dialog")
export default class JdsDialog extends LitElement {
  // 组件的样式
  static styles = css`
    :host {
      display: contents;
    }

    .container {
      --background-color: var(--jds-color-neutral-full);

      display: flex;
      flex-direction: column;
      background: var(--background-color);
      width: var(--jds-dialog-width, auto);
      max-width: calc(100vw - var(--jds-size-4xl));
      max-height: calc(100vh - var(--jds-size-4xl));
      min-width: 424px;
      padding: 0;
      border: 0;
      border-radius: var(--jds-border-radius-l);
    }

    .dialog,
    .dialog-polyfill .container {
      padding: 0;
      border: 0;
      border-radius: var(--jds-border-radius-l);
    }

    .dialog-polyfill .container {
      position: fixed;
      z-index: var(--jds-index-dialog);
    }

    .dialog::backdrop {
      background-color: #273142b3;
    }

    .dialog-polyfill {
      display: none;
      position: fixed;
      inset-inline-start: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      align-items: center;
      justify-content: center;
      z-index: var(--jds-index-dialog);
      background-color: #273142b3;
    }

    :host([open]) .dialog-polyfill {
      display: flex;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--jds-size-2xs);
      padding: var(--jds-size-xl) var(--jds-size-xl) 0 var(--jds-size-xl);
    }

    header bl-button {
      margin-inline-start: auto;
    }

    header h2 {
      font: var(--jds-font-title-1-medium);
      color: var(--jds-color-neutral-darker);
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--jds-dialog-caption-line-clamp, 1);
      margin: 0;
      padding: 0;
    }

    .content {
      padding: var(--jds-size-xl);
      overflow: auto;
    }

    :host([critical]) .content {
      padding-top: 0;
    }

    .container.has-footer .content {
      padding-bottom: 0;
    }

    footer {
      padding: var(--jds-size-xl);
      display: flex;
      flex-flow: row-reverse wrap;
      gap: var(--jds-size-m);
    }

    footer.shadow {
      /* FIXME: Use variables for sizes */
      box-shadow: 0 -4px 15px #27314226;
    }

    @media only screen and (max-width: 471px) {
      .container {
        max-width: calc(100vw - var(--jds-size-2xl));
        max-height: calc(100vh - var(--jds-size-2xl));
        min-width: auto;
        min-height: auto;
      }

      footer {
        flex-flow: column wrap;
      }
    }

    ::slotted(bl-tab-group) {
      display: block;
      transform: translateX(calc(var(--jds-size-xl) * -1));
      width: calc(100% + calc(var(--jds-size-xl) * 2));
    }
  `;

  /**
   * 设置对话框的打开/关闭状态
   */
  @property({
    type: Boolean,
    reflect: true,
    // 判断属性值是否发生变化
    hasChanged(newVal: boolean, oldVal: boolean | undefined) {
      // 如果新值为false且旧值为undefined，则假设初始值为false
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
   * 确定对话框是否为关键对话框，关键对话框无法通过键盘、遮罩层或关闭按钮关闭。
   */
  @property({ type: Boolean, reflect: true })
  critical = false;

  /**
   * 确定对话框是否当前使用填充版本而非原生 HTML 对话框。默认情况下，
   * 如果浏览器支持，则使用原生对话框，否则使用填充版本。在某些情况下，
   * 如需在对话框上方显示某些内容（例如无法使用 Popover API 时），
   * 可以通过将此设置为 true 来强制使用填充版本。请注意，填充版本
   * 可能会在可访问性和堆叠上下文方面造成一些不一致，因此请谨慎使用。
   */
  @property({ type: Boolean, reflect: true })
  polyfilled = true;

  // 查询选择器，获取对话框元素和其他相关元素
  @query(".dialog")
  private dialog!: HTMLDialogElement & DialogElement;

  @query("footer")
  private footer!: HTMLElement;

  @query(".container")
  private container!: HTMLElement;

  @query(".content")
  private content!: HTMLElement;

  /**
   * 对话框打开时触发
   */
  @event("jds-dialog-open")
  private onOpen!: EventDispatcher<object>;

  /**
   * 在通过内部操作（如点击关闭按钮、按 Escape 键或点击遮罩层）关闭对话框之前触发。
   * 可以通过调用 `event.preventDefault()` 来阻止关闭。
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
    // 如果`open`或`polyfilled`属性发生变化，则切换对话框的处理程序
    if (changedProperties.has("open") || changedProperties.has("polyfilled")) {
      this.toggleDialogHandler();
    }
  }

  // 判断是否有页脚
  private get _hasFooter() {
    // 检查子节点中是否存在 `jds-BUTTON` 元素
    return [...this.childNodes].some((node) => node.nodeName === "JDS-BUTTON");
  }

  // 切换对话框的处理程序
  private toggleDialogHandler() {
    if (this.open) {
      // 打开对话框
      this.dialog?.showModal?.();
      this.onOpen({ isOpen: true });
      document.body.style.overflow = "hidden";
      this.toggleFooterShadow();
      // 添加事件监听器
      window?.addEventListener("keydown", (event) => this.onKeydown(event));
      window?.addEventListener("resize", this.toggleFooterShadow);
      this.content?.addEventListener("scroll", this.toggleFooterShadow);
    } else {
      // 关闭对话框
      this.dialog?.close?.();
      this.onClose({ isOpen: false }, { bubbles: false });
      document.body.style.overflow = "auto";
      // 移除事件监听器
      window?.removeEventListener("keydown", this.onKeydown);
      window?.removeEventListener("resize", this.toggleFooterShadow);
      this.content?.removeEventListener("scroll", this.toggleFooterShadow);
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
      return;
    }

    this.open = false;
  }

  // 处理点击对话框外部的事件
  private clickOutsideHandler = (event: MouseEvent) => {
    if (this.critical) return;

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
      event.preventDefault();
      this.closeDialog("keyboard");
    }
  };

  // 切换页脚阴影
  private toggleFooterShadow = () => {
    const scrollTop = this.content?.scrollTop;
    const scrollHeight = this.content?.scrollHeight;
    const clientHeight = this.content?.clientHeight;

    // 如果滚动到底部，则移除页脚阴影，否则添加页脚阴影
    if (scrollTop + clientHeight >= scrollHeight) {
      this.footer?.classList?.remove("shadow");
    } else {
      this.footer?.classList?.add("shadow");
    }
  };

  // 渲染页脚
  private renderFooter() {
    return this._hasFooter
      ? html`<footer>
          <slot name="primary-action"></slot>
          <slot name="secondary-action"></slot>
          <slot name="tertiary-action"></slot>
        </footer>`
      : "";
  }

  // 渲染对话框容器
  private renderContainer() {
    const title = this.caption
      ? html`<h2 id="dialog-caption">${this.caption}</h2>`
      : "";
    const closeButton = !this.critical
      ? html`<jds-button
          @click="${() => this.closeDialog("close-button")}"
          icon="close"
          label="close"
          variant="tertiary"
          kind="neutral"
          size="small"
        ></jds-button>`
      : null;

    const classes = {
      container: true,
      "has-footer": this._hasFooter,
    };

    return html` <div class="${classMap(classes)}">
      <header>${title} ${closeButton}</header>
      <section class="content"><slot></slot></section>
      ${this.renderFooter()}
    </div>`;
  }

  // 渲染组件
  render(): TemplateResult {
    return this.polyfilled || !window.HTMLDialogElement
      ? html`<div
          class="dialog-polyfill"
          role="dialog"
          aria-labelledby="dialog-caption"
          @click=${this.clickOutsideHandler}
        >
          ${this.renderContainer()}
        </div>`
      : html`
          <dialog
            class="dialog"
            aria-labelledby="dialog-caption"
            @click=${this.clickOutsideHandler}
          >
            ${this.renderContainer()}
          </dialog>
        `;
  }
}

// 声明全局接口，以便在 HTML 中使用 `jds-dialog` 标签
declare global {
  interface HTMLElementTagNameMap {
    "jds-dialog": JdsDialog;
  }
}
