import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../icon"; // 导入图标组件
import { JackeryIcon } from "../icon/icon-list"; // 导入图标列表类型

// 定义徽章组件的大小类型
export type BadgeSize = "small" | "medium" | "large";

/**
 * @tag jds-badge
 * @summary Jackery 徽章组件
 *
 * @cssproperty [--jds-badge-bg-color=--jds-color-primary-contrast] 设置徽章的背景颜色
 * @cssproperty [--jds-badge-color=--jds-color-primary] 设置徽章的文字颜色
 */
@customElement("jds-badge")
export default class JdsBadge extends LitElement {
  // 组件的样式
  static styles = css`
    :host {
      display: inline-block;
      max-width: 100%;
    }

    .badge {
      --bg-color: var(
        --jds-badge-bg-color,
        var(--jds-color-primary-contrast)
      ); // 徽章背景颜色
      --text-color: var(
        --jds-badge-color,
        var(--jds-color-primary)
      ); // 徽章文字颜色
      --font: var(--jds-font-title-4-medium); // 徽章字体
      --padding-vertical: var(--jds-size-4xs); // 徽章垂直内边距
      --padding-horizontal: var(--jds-size-3xs); // 徽章水平内边距
      --margin-icon: var(--jds-size-3xs); // 图标外边距
      --icon-size: var(--jds-size-s); // 图标大小
      --height: var(--jds-size-xl); // 徽章高度

      display: flex;
      gap: var(--margin-icon);
      justify-content: center;
      align-items: center;

      box-sizing: border-box;
      width: 100%;
      border: none;
      border-radius: var(--jds-size-4xs);
      margin: 0;
      padding: var(--padding-vertical) var(--padding-horizontal);
      background-color: var(--bg-color);
      color: var(--jds-badge-color, var(--jds-color-primary));
      /* font: var(--font); */
      font-kerning: none;
      height: var(--height);
    }

    // 小号徽章样式
    :host([size="small"]) .badge {
      --font: var(--jds-font-caption);
      --height: var(--jds-size-m);
    }

    // 大号徽章样式
    :host([size="large"]) .badge {
      --font: var(--jds-font-title-3-medium);
      --padding-vertical: var(--jds-size-2xs);
      --padding-horizontal: var(--jds-size-2xs);
      --height: var(--jds-size-2xl);
      --icon-size: var(--jds-size-m);
    }

    // 插槽中的图标样式
    :host ::slotted(bl-icon) {
      font-size: var(--icon-size);
    }

    // 小号徽章中不显示图标
    :host([size="small"]) bl-icon {
      display: none;
    }
  `;

  /**
   * 设置徽章的大小
   */
  @property({ type: String, reflect: true })
  size: BadgeSize = "medium";

  /**
   * 设置图标的名称
   */
  @property({ type: String })
  icon?: JackeryIcon;

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
