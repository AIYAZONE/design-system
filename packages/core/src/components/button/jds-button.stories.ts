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
  type?: string;
}

const meta: import("@storybook/web-components").Meta<ButtonProps> = {
  title: "03 基础组件/jds-button",
  tags: ["autodocs"],
  component: "jds-button",
  parameters: {
    docs: {
      description: {
        component:
          "这是一个按钮组件，支持多种变体和样式。支持纯图标按钮、超链接按钮和自定义CSS属性配置。",
      },
    },
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "text"],
      description: "设置按钮的变体",
      control: { type: "select" },
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    kind: {
      options: ["default", "neutral", "success", "danger", "custom"],
      description:
        "设置按钮的种类，当设置为custom时，使用自定义颜色样式（--jds-btn-custom-color, 当按钮变体为primary时还可传入--jds-btn-primary-custom-text-color更改文字颜色）)",
      default: "default",
      control: { type: "select" },
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      options: ["extra", "large", "medium", "small"],
      description: "设置按钮的大小",
      control: { type: "select" },
      table: {
        defaultValue: { summary: "large" },
      },
    },
    label: {
      description: "设置按钮的标签，用于无障碍访问",
      control: {
        type: "text",
      },
      table: {
        defaultValue: { summary: "-" },
      },
    },
    loading: {
      description: "设置按钮的加载状态",
      control: { type: "boolean" },
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      description: "设置按钮为禁用状态",
      control: { type: "boolean" },
      table: {
        defaultValue: { summary: "false" },
      },
    },
    href: {
      control: {
        type: "text",
      },
      description: "设置链接URL，如果设置，按钮将渲染为锚标签",
      table: {
        defaultValue: { summary: "-" },
      },
    },
    target: {
      description: "设置锚点的目标，当设置了`href`时使用",
      options: ["_blank", "_parent", "_self", "_top"],
      control: { type: "select" },
      table: {
        defaultValue: { summary: "-" },
      },
    },
    icon: {
      description: "设置图标名称，使用`jds-icon`组件显示图标",
      control: {
        type: "text",
      },
      table: {
        defaultValue: { summary: "-" },
      },
    },
    style: {
      description:
        "设置按钮的自定义样式，支持CSS变量配置，如 --jds-btn-display: block;--jds-btn-custom-color:blue;",
      control: {
        type: "text",
      },
      table: {
        defaultValue: { summary: "-" },
      },
    },
  },
};

export default meta;

const SingleButtonTemplate = (args: ButtonProps) =>
  html`<jds-button
    class=${ifDefined(args.class)}
    variant=${ifDefined(args.variant)}
    kind=${ifDefined(args.kind)}
    href=${ifDefined(args.href)}
    target=${ifDefined(args.target)}
    size=${ifDefined(args.size)}
    type=${ifDefined(args.type)}
    icon="${ifDefined(args.icon)}"
    label="${ifDefined(args.label)}"
    ?disabled=${ifDefined(args.disabled)}
    ?loading=${args.loading}
    style="${ifDefined(args.style)}"
    >${unsafeHTML(args.content)}</jds-button
  >`;

export const Default: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
      ...args,
      content: "Primary Button",
    })}`,
  args: {},
};

export const Variants: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
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
    })}`,
  args: {},
};

export const Kinds: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
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
      style: "--jds-btn-custom-color: blue",
    })}`,
  args: {},
};

export const Sizes: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
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
    })}`,
  args: {},
};

export const WithIcon: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
      ...args,
      content: "Icon Button",
      icon: args.icon ?? "star-fill",
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Icon Button",
      variant: "secondary",
      icon: args.icon ?? "star-fill",
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Icon Button",
      variant: "text",
      icon: args.icon ?? "star-fill",
    })}`,
  args: {
    icon: "star-fill",
  },
};

export const IconOnly: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
      ...args,
      icon: args.icon ?? "star-fill",
    })}
    ${SingleButtonTemplate({
      ...args,
      variant: "secondary",
      icon: args.icon ?? "star-fill",
    })}
    ${SingleButtonTemplate({
      ...args,
      variant: "text",
      icon: args.icon ?? "star-fill",
    })}`,
  args: {
    icon: "star-fill",
  },
};

export const Loading: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
      ...args,
      content: "Loading Button",
      loading: true,
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Loading Button",
      variant: "secondary",
      loading: true,
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Loading Button",
      variant: "text",
      loading: true,
    })}`,
  args: {},
};

export const Disabled: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
      ...args,
      content: "Disabled Button",
      disabled: true,
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Disabled Button",
      variant: "secondary",
      disabled: true,
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Disabled Button",
      variant: "text",
      disabled: true,
    })}`,
  args: {},
};

export const Link: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) =>
    html`${SingleButtonTemplate({
      ...args,
      content: "Link Button",
      href: "https://example.com",
      target: "_blank",
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Link Button",
      variant: "secondary",
      href: "https://example.com",
      target: "_blank",
    })}
    ${SingleButtonTemplate({
      ...args,
      content: "Link Button",
      variant: "text",
      href: "https://example.com",
      target: "_blank",
    })}`,
  args: {},
};

export const FullWidth: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) => html`
    <div style="width: 320px">
      ${SingleButtonTemplate({
        ...args,
        content: "Full Width Button",
        style: "--jds-btn-display: block",
      })}
    </div>
  `,
  args: {},
};

export const CustomColor: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 8px">
      ${SingleButtonTemplate({
        ...args,
        content: "Custom Color Button",
        kind: "custom",
        style: "--jds-btn-custom-color: #10b981",
      })}
      ${SingleButtonTemplate({
        ...args,
        content: "Custom Color Button",
        kind: "custom",
        variant: "secondary",
        style: "--jds-btn-custom-color: #10b981",
      })}
      ${SingleButtonTemplate({
        ...args,
        content: "Custom Color Button",
        kind: "custom",
        variant: "text",
        style: "--jds-btn-custom-color: #10b981",
      })}
      ${SingleButtonTemplate({
        ...args,
        content: "Custom Text Color Button",
        kind: "custom",
        variant: "primary",
        style:
          "--jds-btn-custom-color: #10b981; --jds-btn-primary-custom-text-color: #000000",
      })}
    </div>
  `,
  args: {},
};

export const FormSubmit: import("@storybook/web-components").StoryObj<ButtonProps> = {
  render: (args) => html`
    <form
      id="test-form"
      @submit="${(e: Event) => {
        e.preventDefault();
        alert("Form submitted!");
      }}"
    >
      <input
        type="text"
        placeholder="Enter something"
        style="margin-bottom: 8px; display: block; width: 100%"
      />
      ${SingleButtonTemplate({
        ...args,
        content: "Submit Form",
        type: "submit",
      })}
    </form>
  `,
  args: {},
};
