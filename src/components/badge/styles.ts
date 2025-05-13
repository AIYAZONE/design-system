import { css } from "lit";

export const badgeStyles = css`
  :host {
    display: inline-block;
    max-width: 100%;
    width: max-content;
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
    --font: var(--jds-font-c1);
    --height: var(--jds-size-m);
  }

  // 大号徽章样式
  :host([size="large"]) .badge {
    --font: var(--jds-font-h3-medium);
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
