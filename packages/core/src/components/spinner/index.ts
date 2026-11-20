import {
  html,
  LitElement,
  CSSResultGroup,
  unsafeCSS,
  TemplateResult,
} from "lit";
import { customElement, property } from "../../decorators";
import { ifDefined } from "lit/directives/if-defined.js";
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
  size: string = "var(--zone-spinner-size, 14px)";

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

  /** 独立加载区的可访问名称；按钮内保持空值避免重复播报。 */
  @property() label = "";

  // 渲染组件的HTML模板
  render(): TemplateResult {
    return html`<span
      role=${ifDefined(this.label ? "status" : undefined)}
      aria-label=${ifDefined(this.label || undefined)}
      ><zone-icon
        part="spinner"
        class="spinner"
        name="loading"
        style="color: ${
          this.disabled
            ? "var(--zone-spinner-disabled-color, currentColor)"
            : this.color
        }; font-size: ${this.size};"
        aria-hidden="true"
      ></zone-icon
    ></span>`;
  }
}

export default ZoneSpinner;

// 扩展HTMLElementTagNameMap接口，以便在TypeScript中识别自定义元素
declare global {
  interface HTMLElementTagNameMap {
    ["zone-spinner"]: Pick<ZoneSpinner, keyof ZoneSpinner>;
  }
}
