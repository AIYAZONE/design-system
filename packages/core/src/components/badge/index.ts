import { html, LitElement, TemplateResult, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property } from "../../decorators";

import styles from "./index.less?inline";

// 定义徽章组件的大小类型
export type BadgeSize = "small" | "medium" | "large";

/**
 * @tag jds-badge
 * @summary Jackery 徽章组件
 *
 * @cssproperty [--jds-badge-bg-color:var(--jds-color-primary-contrast)] 设置徽章的背景颜色
 * @cssproperty [--jds-badge-color:var(--jds-color-primary)] 设置徽章的文字颜色
 */
@customElement("jds-badge")
export default class JdsBadge extends LitElement {
  // 组件的样式
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  /**
   * 设置徽章的大小
   */
  @property({ type: String, reflect: true })
  size: BadgeSize = "medium";

  /**
   * 设置图标的名称
   */
  @property({ type: String })
  icon: string | undefined;

  // 组件的渲染方法
  render(): TemplateResult {
    // 如果有图标，则渲染图标组件
    const icon = this.icon ? html`<jds-icon name=${this.icon}></jds-icon>` : "";

    // 渲染徽章组件，包括图标和插槽内容
    return html`<span class="badge">
      <slot name="icon">${icon}</slot>
      <slot></slot>
    </span>`;
  }
}

// 扩展HTMLElementTagNameMap接口，添加jds-badge元素类型定义
declare global {
  interface HTMLElementTagNameMap {
    "jds-badge": JdsBadge;
  }
}
