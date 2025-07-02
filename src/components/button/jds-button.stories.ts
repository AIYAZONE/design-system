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
  disabled: boolean;
  href: any;
  target: any;
  icon: any;
  content: any;
  style: any;
}

const meta: Meta = {
  title: "03 基础组件/jds-button",
  tags: ["autodocs"],
  component: "jds-button",
  parameters: {
    docs: {
      description: {
        component: "这是一个按钮组件，支持多种变体和样式。支持纯图标按钮、超链接按钮和自定义CSS属性配置。", // 自定义描述
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
      options: ["default", "neutral", "success", "danger","custom"],
      description: "设置按钮的种类，当设置为custom时，使用自定义颜色样式（--jds-button-custom-color：blue)",
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
    style: {
      description: "设置按钮的自定义样式，支持CSS变量配置，如 --jds-button-display: block;--jds-button-custom-color:blue;",
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
    ?disabled=${args.disabled}
    ?loading=${args.loading}
    style="${ifDefined(args.style)}"
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
})}
${SingleButtonTemplate({
  ...args,
  content: "Custom Button",
  kind: "custom",
  style: "--jds-button-custom-color: blue",
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

export const IconButtons = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Primary + Icon Button",
  icon: "arrow-right",
})}
${SingleButtonTemplate({
  ...args,
  variant: "secondary",
  content: "Secondary + Icon Button",
  icon: "arrow-right",
})}
${SingleButtonTemplate({
  ...args,
  variant: "text",
  content: "Text + Icon Button",
  icon: "arrow-right",
})} `;

export const IconOnlyButtons = (args: ButtonProps) => html`
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-left",
  size: "small",
  variant: "secondary",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-right",
  size: "small",
  variant: "secondary",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "info-fill",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-left",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-right",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-right-long",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-up-long",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-left",
  size: "extra",
  variant: "secondary",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-right",
  size: "extra",
  variant: "secondary",
})} `;

export const LinkButtons = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "info-fill",
  href: "https://www.jackery.com",
})}
${SingleButtonTemplate({
  ...args,
  content: "",
  icon: "arrow-right-long",
  href: "https://www.jackery.com",
})}
${SingleButtonTemplate({
  ...args,
  content: "Jackery Home Page",
  href: "https://www.jackery.com",
})}
${SingleButtonTemplate({
  ...args,
  content: "Jackery Home Page",
  href: "https://www.jackery.com",
  target: "_self",
})}
${SingleButtonTemplate({
  ...args,
  content: "Jackery Home Page",
  icon: "arrow-right-long",
  href: "https://www.jackery.com",
})} `;

export const DisabledButtons = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Primary Button",
  disabled: true,
})}
${SingleButtonTemplate({
  ...args,
  variant: "secondary",
  content: "Secondary Button",
  disabled: true,
})}
${SingleButtonTemplate({
  ...args,
  variant: "text",
  content: "Text Button",
  disabled: true,
})} `;

export const LoadingButtons = (args: ButtonProps) => html`${SingleButtonTemplate({
  ...args,
  content: "Primary Button",
  loading: true,
})}
${SingleButtonTemplate({
  ...args,
  variant: "secondary",
  content: "Secondary Button",
  loading: true,
})} `;

export const CustomStyleButtons = (args: ButtonProps) => html`
<div style="display: flex; flex-direction: column; gap: 16px;">
  <div>
    <h4>样式配置：--jds-button-display: block</h4>
    <div style="width: 300px; height: 100px; background-color: #f5f5f5; padding: 20px; border-radius: 4px;">
      ${SingleButtonTemplate({
        ...args,
        content: "Confirm",
        style: "--jds-button-display: block",
      })}
    </div>
  </div>

  <div>
    <h4>样式配置：--jds-button-display: block; max-width: 200px</h4>
    ${SingleButtonTemplate({
      ...args,
      content: "A very long text content",
      style: "--jds-button-display: block; max-width: 200px",
    })}
  </div>
</div>
`;
