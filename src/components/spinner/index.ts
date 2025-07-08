import { html, LitElement, TemplateResult, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.less?inline";


/**
 * @tag jds-spinner
 * @summary Jackery 加载指示器组件
 *
 */
@customElement("jds-spinner")
export default class JdsSpinner extends LitElement {
  // 定义组件的CSS样式
  static styles = [unsafeCSS(styles)];

  /**
   * 设置加载指示器的大小
   */
  @property({ type: String, reflect: true })
  size = "var(--jds-font-size-14)";

  /**
   * 设置加载指示器的禁用状态
   */
  @property({ type: Boolean, reflect: true })
  disabled?: boolean = false;

  /**
   * 设置加载指示器的覆盖层状态
   */
  @property({ type: Boolean, reflect: true })
  overlay?: boolean = false;

  /**
   * 设置加载指示器的颜色
   */
  @property({ type: String, reflect: true })
  color: string = "var(--jds-color-primary)";

  // 渲染组件的HTML模板
  render(): TemplateResult {
    return html`<jds-icon
      class="spinner"
      name="loading"
      style="color: ${this.disabled
        ? "var(--jds-color-white)"
        : this.color}; font-size: ${this.size};"
    ></jds-icon>`;
  }
}

// 扩展HTMLElementTagNameMap接口，以便在TypeScript中识别自定义元素
declare global {
  interface HTMLElementTagNameMap {
    ["jds-spinner"]: JdsSpinner;
  }
}
