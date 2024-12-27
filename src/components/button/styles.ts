import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: var(--jds-button-display, inline-block);
    max-width: 100%;
    width: max-content;
    position: relative;
  }

  .button {
    --main-color: var(--jds-color-primary);
    --main-hover-color: var(--jds-color-primary-highlight);
    --text-hover-color: var(--jds-color-neutral-lightest);
    --content-color: var(--jds-color-neutral-full);
    --bg-color: var(--main-color);
    --border-color: var(--main-color);
    --padding-vertical: var(--jds-size-2xs);
    --padding-horizontal: var(--jds-size-m);
    --margin-icon: var(--padding-vertical);
    --icon-size: var(--jds-size-m);
    --font: var(--jds-font-title-6-medium);
    --height: var(--jds-size-5xl);
    --border-radius: var(--jds-border-radius-pill);

    display: flex;
    gap: var(--margin-icon);
    justify-content: var(--jds-button-justify, center);
    align-items: center;
    box-sizing: border-box;
    width: max-content;
    height: var(--height);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    text-decoration: none;
    padding: var(--padding-vertical) var(--padding-horizontal);
    cursor: pointer;
    background-color: var(--bg-color);
    color: var(--content-color);
    font: var(--font);
    font-kerning: none;
    user-select: none;
  }

  :host(:hover) .button {
    --bg-color: var(--main-hover-color);
    --border-color: var(--main-hover-color);
  }

  .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 不同尺寸按钮 */
  :host([size="extra"]) .button {
    --padding-vertical: 18px;
    --padding-horizontal: 32px;
    --margin-icon: var(--jds-size-2xs);
    --height: 56px;
    --font: 700 22px/30px var(--jds-font-family);
  }

  :host([size="large"]) .button {
    --padding-vertical: var(--jds-size-xs);
    --padding-horizontal: var(--jds-size-3xl);
    --margin-icon: var(--jds-size-2xs);
    --height: var(--jds-size-6xl);
    --font: 600 18px/26px var(--jds-font-family);
  }

  :host([size="medium"]) .button {
    --padding-vertical: var(--jds-size-2xs);
    --padding-horizontal: var(--jds-size-2xl);
    --margin-icon: var(--jds-size-2xs);
    --height: var(--jds-size-4xl);
    --font: 600 14px/22px var(--jds-font-family);
  }

  :host([size="small"]) .button {
    --padding-vertical: var(--jds-size-3xs);
    --padding-horizontal: var(--jds-size-xs);
    --icon-size: var(--jds-size-s);
    --height: var(--jds-size-2xl);
    --font: 600 16px/24px var(--jds-font-family);
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    position: relative;
    outline: none;
  }

  .button:focus-visible::after {
    border: 2px solid var(--jds-button-focus-border-color, var(--main-color));
    border-radius: var(--border-radius);
    content: "";
    position: absolute;
    inset: -4px;
  }

  :host ::slotted(bl-icon) {
    font-size: var(--icon-size);
  }

  :host([loading]) ::slotted(bl-icon) {
    display: none;
  }

  :host .has-icon:not(.has-content) {
    --padding-horizontal: var(--padding-vertical);
    --margin-icon: 0;
  }

  :host([variant="secondary"]) .button {
    --bg-color: transparent;
    --content-color: var(--main-color);
  }

  :host([variant="tertiary"]) .button {
    --content-color: var(--main-color);
    --border-color: transparent;
    --bg-color: transparent;
  }

  :host([kind="neutral"]) .button {
    --main-color: var(--jds-color-neutral-darker);
    --main-hover-color: var(--jds-color-neutral-darkest);
  }

  :host([kind="success"]) .button {
    --main-color: var(--jds-color-success);
    --main-hover-color: var(--jds-color-success-highlight);
  }

  :host([kind="danger"]) .button {
    --main-color: var(--jds-color-danger);
    --main-hover-color: var(--jds-color-danger-highlight);
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  :host([loading]) {
    cursor: wait;
  }

  :host .button[aria-disabled="true"] {
    --main-color: var(--jds-color-neutral-lightest);
    --main-hover-color: var(--jds-color-neutral-lightest);
    --content-color: var(--jds-color-neutral-lighter);
    --bg-color: var(--main-color);

    pointer-events: none;
    text-decoration: none;
  }

  :host([variant="tertiary"]) .button[aria-disabled="true"] {
    --main-color: transparent;
  }

  :host([variant="secondary"]:hover) .button[aria-disabled="false"] {
    --content-color: var(--jds-color-neutral-full);
    --bg-color: var(--main-hover-color);
  }

  :host([variant="tertiary"]:hover) .button[aria-disabled="false"] {
    --content-color: var(--main-hover-color);
    --bg-color: var(--text-hover-color);
  }

  :host([dropdown]) .open {
    display: none;
  }

  :host([dropdown]) .active .open {
    display: inline-block;
  }

  :host([dropdown]) .active .close {
    display: none;
  }

  :host .active.button {
    --bg-color: var(--main-hover-color);
    --border-color: var(--main-hover-color);
  }

  :host([variant="secondary"]) .active.button {
    --content-color: var(--jds-color-neutral-full);
    --bg-color: var(--main-hover-color);
  }

  :host([variant="tertiary"]) .active.button {
    --content-color: var(--main-color);
    --bg-color: var(--jds-color-neutral-lightest);
    --border-color: transparent;
  }
`;
