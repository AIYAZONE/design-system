import type { Meta } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

interface ButtonProps {
  class: string;
  variant: any;
  kind: any;
  size: any;
  label: string;
  loading: boolean;
  loadingLabel: any;
  disabled: boolean;
  href: any;
  target: any;
  icon: any;
  content: any;
}

const meta: Meta = {
  title: "组件/jds-button",
  tags: ["autodocs"],
  component: "jds-button",
  parameters: {
    docs: {
      description: {
        component: "这是一个按钮组件，支持多种变体和样式。", // 自定义描述
      },
    },
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "text"],
      description: "设置按钮的变体",
      default: "primary",
      control: { type: "select" },
    },
    kind: {
      options: ["default", "neutral", "success", "danger"],
      description: "设置按钮的种类",
      default: "default",
      control: { type: "select" },
    },
    size: {
      options: ["extra", "large", "medium", "small"],
      description: "设置按钮的大小",
      default: "large",
      control: { type: "select" },
    },
    label: {
      description: "设置按钮的标签，用于无障碍访问",
      control: {
        type: "text",
      },
    },
    loading: {
      description: "设置按钮的加载状态",
      control: "boolean",
    },
    loadingLabel: {
      description: "设置加载状态下的按钮标签",
      control: "text",
    },
    disabled: {
      description: "设置按钮为禁用状态",
      control: "boolean",
    },
    href: {
      control: {
        type: "text",
      },
      description: "设置链接URL，如果设置，按钮将渲染为锚标签",
    },
    target: {
      description: "设置锚点的目标，当设置了`href`时使用",
      options: ["_blank", "_parent", "_self", "_top"],
      control: { type: "select" },
    },
    icon: {
      description: "设置图标名称，使用`jds-icon`组件显示图标",
      control: {
        type: "text",
      },
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
  variant: "text",
  content: "Text Button",
})} `;

export const Kinds = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Default Button",
})}
${SingleButtonTemplate({
  ...args,
  content: "Neutral Button",
  kind: "neutral",
})}
${SingleButtonTemplate({
  ...args,
  content: "Success Button",
  kind: "success",
})}
${SingleButtonTemplate({
  ...args,
  content: "Danger Button",
  kind: "danger",
})} `;

export const Sizes = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Extra Large Button",
  size: "extra",
})}
${SingleButtonTemplate({
  ...args,
  content: "Large Button",
  size: "large",
})}
${SingleButtonTemplate({
  ...args,
  content: "Medium Button",
  size: "medium",
})}
${SingleButtonTemplate({
  ...args,
  content: "Small Button",
  size: "small",
})} `;
