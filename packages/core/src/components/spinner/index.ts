import { html, LitElement, CSSResultGroup, unsafeCSS, TemplateResult } from "lit";
import { customElement, property } from "../../decorators";
import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * @tag zone-spinner
 * @summary AIYAZONE 加载指示器组件
 * @description 用于显示加载状态的旋转图标组件
 */
@customElement("zone-spinner")
export class ZoneSpinner extends LitElement {
  // 定义组件的CSS样式
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  /**
   * 设置加载指示器的大小
   */
  @property({ type: String, reflect: true })
  size: string = "var(--zone-spinner-size, var(--zone-size-14))";

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
  color: string = "var(--zone-color-primary)";

  // 渲染组件的HTML模板
  render(): TemplateResult {
    return html`<zone-icon 
      part="spinner"
      class="spinner"
      name="loading"
      style="color: ${this.disabled
        ? "var(--zone-color-white)"
        : this.color}; font-size: ${this.size};"
    ></zone-icon>`;
  }
}

export default ZoneSpinner;

// 扩展HTMLElementTagNameMap接口，以便在TypeScript中识别自定义元素
declare global {
  interface HTMLElementTagNameMap {
    ["zone-spinner"]: ZoneSpinner;
  }
}
