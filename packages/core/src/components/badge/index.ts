import { html, LitElement, TemplateResult, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property } from "../../decorators";

import styles from "./index.less?inline";

// 定义徽章组件的大小类型
export type BadgeSize = "small" | "medium" | "large";
export type BadgeVariant = "soft" | "solid" | "outline";
export type BadgeKind = "default" | "neutral" | "success" | "warning" | "danger" | "info" | "custom";
export type BadgeIconPosition = "prev" | "next" | "start" | "end";

/**
 * @tag zone-badge
 * @summary AIYAZONE 徽章组件
 *
 * @cssproperty [--zone-badge-bg-color:var(--zone-color-primary-contrast)] 设置徽章的背景颜色
 * @cssproperty [--zone-badge-color:var(--zone-color-primary)] 设置徽章语义主色（outline 边框默认跟随该值，solid 默认背景也会使用该值）
 * @cssproperty [--zone-badge-text-color:var(--zone-badge-color)] 设置徽章的文字颜色（所有变体通用）
 */
@customElement("zone-badge")
export class ZoneBadge extends LitElement {
  // 组件的样式
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  /**
   * 设置徽章的大小（影响高度/内边距/图标大小）
   */
  @property({ type: String, reflect: true })
  size: BadgeSize = "medium";

  /**
   * 徽章的风格变体：soft（浅色）、solid（实色）、outline（描边）
   */
  @property({ type: String, reflect: true })
  variant: BadgeVariant = "soft";

  /**
   * 徽章的语义种类（default/neutral/success/warning/danger/info/custom）
   */
  @property({ type: String, reflect: true })
  kind: BadgeKind = "default";

  /**
   * 设置图标的名称（亦可通过 icon 插槽覆盖）
   */
  @property({ type: String })
  icon: string | undefined;

  /**
   * 图标位置：prev（文本前）/ next（文本后）
   */
  @property({ type: String, reflect: true })
  iconPosition: BadgeIconPosition = "next";

  /**
   * 点式徽章（仅显示圆点）
   */
  // 移除点式徽章支持

  /**
   * 计数值（优先显示，超过 maxCount 显示为 "maxCount+"）
   */
  @property({ type: Number })
  count?: number;

  /**
   * 计数显示上限（默认 99）
   */
  @property({ type: Number })
  maxCount = 99;

  /**
   * 是否可关闭
   */
  // 移除关闭按钮支持

  /**
   * 是否可点击（无 href 时使用）
   */
  // 移除非导航点击支持（仅保留 href 导航）

  /**
   * 链接地址（设置后渲染为 <a>，自动添加 rel='noopener noreferrer'）
   */
  @property({ type: String })
  href?: string;

  /**
   * 链接目标
   */
  // 移除 target 属性（统一默认安全策略）

  /**
   * 无障碍标签（dot 或仅计数时建议设置）
   */
  // 移除 ariaLabelText（自动生成）

  // 移除点击与关闭事件

  // 移除键盘处理

  private _warnedA11y = false;

  // 组件的渲染方法
  render(): TemplateResult {
    const iconTemplate = this.icon ? html`<zone-icon name=${this.icon}></zone-icon>` : "";
    const iconSlot = html`<slot name="icon">${iconTemplate}</slot>`;
    const resolvedIconPosition = this.iconPosition === "prev" || this.iconPosition === "start" ? "prev" : "next";

    const countDisplay =
      typeof this.count === "number"
        ? this.count > this.maxCount
          ? `${this.maxCount}+`
          : `${this.count}`
        : undefined;

    const needsAria = typeof this.count === "number";
    if (needsAria && !this._warnedA11y) {
      // 一次性告警，提示无障碍文本
      console.warn("zone-badge: 仅计数时将自动生成 aria-label 以提升可访问性");
      this._warnedA11y = true;
    }

    const textSlot = typeof this.count === "number"
      ? html`<span class="count" aria-live="polite">${countDisplay}</span>`
      : html`<slot></slot>`;

    const closeBtn = "";
    const content = resolvedIconPosition === "prev" ? html`${iconSlot}${textSlot}${closeBtn}` : html`${textSlot}${iconSlot}${closeBtn}`;

    if (this.href) {
      return html`<a
          class="badge"
          href=${this.href}
          rel="noopener noreferrer"
          aria-label=${typeof this.count === "number" && !this.textContent ? `计数：${countDisplay}` : ""}
        >
          ${content}
        </a>`;
    }

    return html`<span class="badge" aria-label=${typeof this.count === "number" && !this.textContent ? `计数：${countDisplay}` : ""}>
      ${content}
    </span>`;
  }
}

export default ZoneBadge;

// 扩展HTMLElementTagNameMap接口，添加zone-badge元素类型定义
declare global {
  interface HTMLElementTagNameMap {
    "zone-badge": ZoneBadge;
  }
}
