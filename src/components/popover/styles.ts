import { css } from "lit";

// 定义弹出框的样式
export const popoverStyles = css`
  :host {
    display: contents; /* 确保宿主元素不影响子元素的布局 */
  }

  .popover {
    --arrow-display: var(--jds-popover-arrow-display, none); /* 箭头显示状态 */
    --background-color: var(
      --jds-popover-background-color,
      var(--jds-color-neutral-full)
    ); /* 背景颜色 */
    --border-color: var(
      --jds-popover-border-color,
      var(--jds-color-primary-highlight)
    ); /* 边框颜色 */
    --border-size: var(--jds-popover-border-size, 1px); /* 边框大小 */
    --padding: var(--jds-popover-padding, var(--jds-size-m)); /* 内边距 */
    --border-radius: var(
      --jds-popover-border-radius,
      var(--jds-size-3xs)
    ); /* 边角圆度 */
    --position: var(--jds-popover-position, fixed); /* 弹出框的位置属性 */
    --max-width: var(--jds-popover-max-width, 100vw); /* 最大宽度 */
    --max-viewport: calc(
      100vw - var(--jds-size-s)
    ); /* 视口最大宽度，考虑边距 */

    position: var(--position);
    box-sizing: border-box;
    border: var(--border-size) solid var(--border-color);
    padding: var(--padding);
    border-radius: var(--border-radius);
    z-index: var(--jds-index-popover); /* z-index 用于层叠顺序 */
    max-width: min(var(--max-viewport), var(--max-width)); /* 最大宽度限制 */
    width: max-content; /* 宽度根据内容自适应 */
    hyphens: auto; /* 自动断字 */
    background-color: var(--background-color);
    font: var(--jds-font-title-3-regular);
    color: var(--jds-color-neutral-darker);
  }

  .popover:not(.visible) {
    visibility: hidden; /* 不可见时隐藏 */
  }

  .arrow {
    --arrow-rotation: 45deg; /* 箭头的初始旋转角度 */
    --size: var(--jds-size-2xs); /* 箭头的大小 */
    --arrow-position: calc(
      (var(--size) / -2.5) - var(--border-size)
    ); /* 箭头的位置偏移量 */

    box-sizing: border-box;
    display: var(--arrow-display);
    position: absolute;
    background-color: var(--background-color);
    width: var(--size);
    height: var(--size);
    transform: rotate(var(--arrow-rotation));
    border: var(--border-size) solid var(--border-color);
    border-bottom: none; /* 底部边框隐藏 */
    border-inline-end: none; /* 右侧边框隐藏 */
  }

  /* 根据位置定义箭头的样式 */
  .popover[data-placement*="bottom"] .arrow {
    top: var(--arrow-position); /* 底部箭头位置 */
  }

  .popover[data-placement*="top"] .arrow {
    --arrow-rotation: 225deg; /* 顶部箭头旋转角度 */
    bottom: var(--arrow-position); /* 顶部箭头位置 */
  }

  .popover[data-placement*="left"] .arrow {
    --arrow-rotation: 135deg; /* 左侧箭头旋转角度 */
    right: var(--arrow-position); /* 左侧箭头位置 */
  }

  .popover[data-placement*="right"] .arrow {
    --arrow-rotation: 315deg; /* 右侧箭头旋转角度 */
    left: var(--arrow-position); /* 右侧箭头位置 */
  }
`;
