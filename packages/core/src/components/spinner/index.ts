import { html, LitElement, CSSResultGroup, unsafeCSS, TemplateResult } from "lit";
import { customElement, property } from "../../decorators";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * @tag jds-spinner
 * @summary Jackery 加载指示器组件
 * @description 用于显示加载状态的旋转图标组件
 */
@customElement("jds-spinner")
export default class JdsSpinner extends LitElement {
  // 定义组件的CSS样式
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  /**
   * 设置加载指示器的大小
   */
  @property({ type: String, reflect: true })
  size: string = "var(--jds-spinner-size, var(--jds-size-14))";

  /**
   * 设置加载指示器的禁用状态
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean | undefined = false;

  /**
   * 设置加载指示器的覆盖层状态
   */
  @property({ type: Boolean, reflect: true })
  overlay: boolean | undefined = false;

  /**
   * 设置加载指示器的颜色
   */
  @property({ type: String, reflect: true })
  color: string = "var(--jds-color-primary)";

  // 渲染组件的HTML模板
  render(): TemplateResult {
    return html`<jds-icon 
      part="spinner"
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