import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * @tag jds-spinner
 * @summary Jackery 加载指示器组件
 *
 */
@customElement("jds-spinner")
export default class JdsSpinner extends LitElement {
  // 定义组件的CSS样式
  static styles = css`
    :host {
      cursor: wait; // 设置鼠标悬停时的光标样式为等待状态
      display: inline-flex;
      width: max-content;
      align-items: center;
    }

    .spinner {
      animation: spin 1s linear infinite; // 设置旋转动画
    }

    :host([overlay]) {
      position: absolute;
      top: 0;
      inset-inline-start: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(39 49 66 / 70%); // 设置背景颜色和透明度
      z-index: 10; // 设置层叠顺序
    }

    @keyframes spin {
      from {
        transform: rotate(0deg); // 动画开始时的旋转角度
      }

      to {
        transform: rotate(360deg); // 动画结束时的旋转角度
      }
    }
  `;

  /**
   * 设置加载指示器的大小
   */
  @property({ type: String, reflect: true })
  size = "var(--jds-font-size-m)";

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
        ? "var(--jds-color-neutral-light)"
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
