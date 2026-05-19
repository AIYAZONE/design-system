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
  iconPosition?: "prev" | "next";
  interaction?: "default" | "shine";
  content: any;
  style: any;
  type?: string;
  customColor?: string;
  }

const meta = {
  title: "03 基础组件/jds-button",
  tags: ["autodocs"],
  component: "jds-button",
  parameters: {
    docs: {
      description: {
        component:
          "规范化按钮组件：用于交互与导航。提供 primary/secondary/text 变体、语义 kind 与尺寸 size；支持禁用、加载、表单提交与链接导航。\n\n最佳实践：导航优先使用 href，非导航交互使用 button；自定义色建议通过主题或 CSS 变量 --jds-btn-custom-color 设置；禁用与加载状态阻止交互并展示明确的视觉反馈。",
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
        category: "基础",
      },
    },
    kind: {
      options: ["default", "neutral", "success", "danger", "custom"],
      description:
        "设置按钮的种类，当设置为custom时，使用自定义颜色样式（--jds-btn-custom-color, 当按钮变体为primary时还可传入--jds-btn-primary-custom-text-color）",
      default: "default",
      control: { type: "select" },
      table: {
        defaultValue: { summary: "default" },
        category: "基础",
      },
    },
    size: {
      options: ["extra", "large", "medium", "small"],
      description: "设置按钮的大小",
      control: { type: "select" },
      table: {
        defaultValue: { summary: "large" },
        category: "基础",
      },
    },
    label: {
      description: "设置按钮的标签，用于无障碍访问",
      control: {
        type: "text",
      },
      table: {
        defaultValue: { summary: "-" },
        category: "基础",
      },
    },
    loading: {
      description: "设置按钮的加载状态",
      control: { type: "boolean" },
      table: {
        defaultValue: { summary: "false" },
        category: "基础",
      },
    },
    disabled: {
      description: "设置按钮为禁用状态",
      control: { type: "boolean" },
      table: {
        defaultValue: { summary: "false" },
        category: "基础",
      },
    },
    href: {
      control: {
        type: "text",
      },
      description: "设置链接URL，如果设置，按钮将渲染为锚标签",
      table: {
        defaultValue: { summary: "-" },
        category: "基础",
      },
    },
    icon: {
      description: "图标名称（统一前置/后置由 iconPosition 控制）",
      control: { type: "text" },
      table: { defaultValue: { summary: "-" }, category: "基础" },
    },
    iconPosition: {
      options: ["prev", "next"],
      description: "图标位置：prev（文本前）/ next（文本后），默认 next",
      control: { type: "select" },
      table: { defaultValue: { summary: "next" }, category: "基础" },
    },
    interaction: {
      options: ["default", "shine"],
      description: "按钮交互风格；shine 仅对实心按钮生效，默认保持现有交互",
      control: { type: "select" },
      table: { defaultValue: { summary: "default" }, category: "基础" },
    },
    target: { table: { disable: true, category: "高级" } },
    style: {
      description:
        "高级：通过 CSS 变量配置（如 --jds-btn-custom-color），建议在主题或页面样式中使用。",
      control: { type: "text" },
      table: { disable: true, category: "高级" },
    },
    type: {
      options: ["button", "submit", "reset"],
      description: "按钮类型（交互动作与表单提交）",
      control: { type: "select" },
      table: { defaultValue: { summary: "button" }, category: "基础" },
    },
    form: {
      description: "提交目标表单（id 或直接传入 HTMLFormElement）",
      control: { type: "text" },
      table: { defaultValue: { summary: "-" }, category: "基础" },
    },
    customColor: {
      control: { type: "color" },
      description: "自定义主色（仅 kind=custom 生效），映射到 --jds-btn-custom-color",
      table: { category: "高级" },
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
    iconPosition=${ifDefined(args.iconPosition)}
    interaction=${ifDefined(args.interaction)}
    label="${ifDefined(args.label)}"
    ?disabled=${ifDefined(args.disabled)}
    ?loading=${args.loading}
    style="${ifDefined(args.style)}${args.customColor ? `; --jds-btn-custom-color: ${args.customColor}` : ""}"
    >${unsafeHTML(args.content)}</jds-button
  >`;

export const Default = {
  render: (args: any) =>
    html`${SingleButtonTemplate({
      ...args,
      content: "Primary Button",
    })}`,
  args: {},
};

export const Variants = {
  render: (args: any) =>
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

export const Kinds = {
  render: (args: any) =>
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

export const Sizes = {
  render: (args: any) =>
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

export const WithIcon = {
  render: (args: any) =>
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

export const IconOnly = {
  render: (args: any) =>
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

export const Loading = {
  render: (args: any) =>
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

export const Disabled = {
  render: (args: any) =>
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

export const Link = {
  render: (args: any) =>
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

export const FullWidth = {
  render: (args: any) => html`
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

export const CustomColor = {
  render: (args: any) => html`
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

export const FormSubmit = {
  render: (args: any) => html`
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

export const Interactions = {
  render: (args: any) => html`
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        ${SingleButtonTemplate({
          ...args,
          content: "Default Button",
          interaction: "default",
        })}
        ${SingleButtonTemplate({
          ...args,
          content: "Figma Sweep Shine",
          interaction: "shine",
        })}
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        ${SingleButtonTemplate({
          ...args,
          content: "Neutral Sweep",
          kind: "neutral",
          interaction: "shine",
        })}
        ${SingleButtonTemplate({
          ...args,
          content: "Custom Sweep",
          kind: "custom",
          interaction: "shine",
          style: "--jds-btn-custom-color: #10b981",
        })}
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        ${SingleButtonTemplate({
          ...args,
          content: "Secondary Ignores Shine",
          variant: "secondary",
          interaction: "shine",
        })}
        ${SingleButtonTemplate({
          ...args,
          content: "Text Ignores Shine",
          variant: "text",
          interaction: "shine",
        })}
      </div>
    </div>
  `,
  args: {},
};
