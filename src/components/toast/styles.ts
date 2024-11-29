import { css } from "lit";
export const toastStyles = css`
  :host {
    display: block; /* 设置为块级元素 */
  }

  .toast {
    --padding: var(--jds-size-m); /* 设置内边距 */
    --main-color: var(--jds-color-info); /* 主颜色 */
    --main-bg-color: var(--jds-color-info-contrast); /* 背景颜色 */

    position: relative;
    display: flex; /* 使用弹性布局 */
    align-items: flex-start;
    justify-content: space-between;
    width: 560px;
    background-color: var(--main-bg-color);
    color: var(--jds-color-neutral-darker);
    box-shadow: inset 0 0 0 1px var(--main-color);
    border-radius: var(--jds-border-radius-l); /* 边角圆润 */
    padding: calc(var(--padding) / 2) var(--padding);
    padding-inline-end: calc(var(--padding) / 2);
  }

  @media screen and (min-width: 1024px) and (max-width: 1439.98px) {
    .toast {
      width: calc(560vw / 1440 * 100);
    }
  }
  @media screen and (max-width: 1023.98px) {
    .toast {
      width: calc(640vw / 750 * 100);
    }
  }

  .description {
    font: var(--jds-font-body-text-2); /* 描述文本样式 */
  }

  .wrapper {
    display: flex;
    flex-flow: column; /* 垂直排列 */
    flex-wrap: wrap; /* 换行 */
    justify-content: space-between;
    flex: auto;
  }

  .content {
    display: flex;
    margin-inline-end: var(--jds-size-2xs);
    flex: 20 1 70%; /* 设置弹性缩放 */
    padding: calc(var(--padding) / 2) 0;
  }

  .icon {
    padding: calc(var(--padding) / 2) 0;
    margin-inline-end: var(--jds-size-2xs);
    color: var(--main-color);
  }

  .text-content {
    display: flex;
    flex-direction: column; /* 垂直排列文本内容 */
  }

  .caption {
    color: var(--jds-color-neutral-darker);
    font: var(--jds-font-title-3-medium); /* 标题样式 */
  }

  .actions {
    display: none; /* 默认不显示操作区域 */
    flex-wrap: wrap; /* 换行 */
    gap: var(--jds-size-m); /* 间距 */
    padding: calc(var(--padding) / 2) 0;
  }

  .close {
    --jds-color-neutral-lightest: transparent; /* 关闭按钮透明 */
  }

  .caption + .description {
    margin-top: var(--jds-size-2xs); /* 标题与描述之间的间距 */
  }

  :host([closed]) {
    display: none; /* 关闭时不显示 */
  }

  /* 根据不同变体设置颜色 */
  :host([variant="success"]) .toast {
    --main-color: var(--jds-color-success);
    --main-bg-color: var(--jds-color-success-contrast);
  }

  :host([variant="warning"]) .toast {
    --main-color: var(--jds-color-warning);
    --main-bg-color: var(--jds-color-warning-contrast);
  }

  :host([variant="danger"]) .toast {
    --main-color: var(--jds-color-danger);
    --main-bg-color: var(--jds-color-danger-contrast);
  }
`;
