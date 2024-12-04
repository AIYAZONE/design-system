import type { Meta } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

interface ButtonProps {
  class: string;
  variant: any;
  kind: any;
  href: any;
  target: any;
  size: any;
  icon: any;
  label: string;
  loadingLabel: any;
  disabled: boolean;
  loading: boolean;
  content: any;
}

const meta: Meta = {
  title: "组件/jds-button",
  tags: ["autodocs"],
  component: "jds-button",
  argTypes: {
    label: {
      control: {
        type: "text",
      },
    },
    variant: {
      options: ["primary", "secondary", "tertiary"],
      default: "primary",
      control: { type: "select" },
    },
    kind: {
      options: ["default", "neutral", "success", "danger"],
      default: "default",
      control: { type: "select" },
    },
    loadingLabel: {
      control: "text",
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    href: {
      control: {
        type: "text",
      },
    },
    target: {
      control: {
        type: "text",
      },
    },
    size: {
      options: ["large", "medium", "small"],
      control: { type: "select" },
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;

const SingleButtonTemplate = (args: ButtonProps) =>
  html`<jds-button
    class=${ifDefined(args.class)}
    variant=${ifDefined(args.variant)}
    kind=${ifDefined(args.kind)}
    href=${ifDefined(args.href)}
    target=${ifDefined(args.target)}
    size=${ifDefined(args.size)}
    icon="${ifDefined(args.icon)}"
    label="${ifDefined(args.label)}"
    loading-label="${ifDefined(args.loadingLabel)}"
    ?disabled=${args.disabled}
    ?loading=${args.loading}
    >${unsafeHTML(args.content)}</jds-button
  >`;

export const Default = (args: ButtonProps) =>
  html`${SingleButtonTemplate({
    ...args,
    content: "Primary Button",
  })}`;

export const Variants = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Primary Button",
})}
${SingleButtonTemplate({
  ...args,
  variant: "secondary",
  content: "Secondary Button",
})}
${SingleButtonTemplate({
  ...args,
  variant: "tertiary",
  content: "Tertiary Button",
})} `;

export const Kinds = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Default Button",
})}
${SingleButtonTemplate({
  ...args,
  content: "Primary Button",
  kind: "neutral",
})}
${SingleButtonTemplate({
  ...args,
  content: "Primary Button",
  kind: "success",
})}
${SingleButtonTemplate({
  ...args,
  content: "Primary Button",
  kind: "danger",
})} `;
