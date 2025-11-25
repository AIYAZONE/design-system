import { html } from "lit";
import "./index";

type ToastArgs = {
  variant?: "info" | "warning" | "success" | "danger";
  caption?: string;
  description?: string;
  icon?: boolean | string;
  closable?: boolean;
  closed?: boolean;
  countdownTime?: number;
};

const meta: import("@storybook/web-components").Meta<ToastArgs> = {
  title: "03 基础组件/jds-toast",
  component: "jds-toast",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "warning", "success", "danger"],
      description: "Toast variant",
    },
    caption: {
      control: { type: "text" },
      description: "Toast title/caption",
    },
    description: {
      control: { type: "text" },
      description: "Toast description",
    },
    icon: {
      control: { type: "text" },
      description:
        "Icon name (true for default, false for none, string for custom)",
    },
    closable: {
      control: { type: "boolean" },
      description: "Show close button",
    },
    closed: {
      control: { type: "boolean" },
      description: "Closed state",
    },
    countdownTime: {
      control: { type: "number" },
      description: "Countdown time in seconds (0 for no countdown)",
    },
  },
};

export default meta;

const ToastTemplate = (args: ToastArgs) => html`
  <jds-toast
    variant="${args.variant || "info"}"
    caption="${args.caption || "Toast Title"}"
    description="${args.description || "This is a toast message description."}"
    icon="${args.icon !== undefined ? args.icon : true}"
    ?closable="${args.closable}"
    ?closed="${args.closed}"
    countdownTime="${args.countdownTime || 0}"
  ></jds-toast>
`;

export const Default: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: ToastTemplate,
    args: {
      variant: "info",
      caption: "Information",
      description: "This is an informational toast message.",
      icon: "play",
      closable: false,
      closed: false,
      countdownTime: 0,
    },
  };

export const Success: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: ToastTemplate,
    args: {
      variant: "success",
      caption: "Success",
      description: "Operation completed successfully!",
      icon: true,
      closable: false,
      closed: false,
      countdownTime: 0,
    },
  };

export const Warning: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: ToastTemplate,
    args: {
      variant: "warning",
      caption: "Warning",
      description: "Please be careful with this action.",
      icon: true,
      closable: false,
      closed: false,
      countdownTime: 0,
    },
  };

export const Danger: import("@storybook/web-components").StoryObj<ToastArgs> = {
  render: ToastTemplate,
  args: {
    variant: "danger",
    caption: "Error",
    description: "Something went wrong. Please try again.",
    icon: true,
    closable: false,
    closed: false,
    countdownTime: 0,
  },
};

export const WithCloseButton: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: ToastTemplate,
    args: {
      variant: "info",
      caption: "Closable Toast",
      description: "This toast can be closed by clicking the X button.",
      icon: true,
      closable: true,
      closed: false,
      countdownTime: 0,
    },
  };

export const WithCountdown: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: ToastTemplate,
    args: {
      variant: "success",
      caption: "Auto-closing Toast",
      description: "This toast will automatically close after 5 seconds.",
      icon: true,
      closable: false,
      closed: false,
      countdownTime: 5,
    },
  };

export const CustomIcon: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: ToastTemplate,
    args: {
      variant: "info",
      caption: "Custom Icon",
      description: "This toast uses a custom icon.",
      icon: "star-fill",
      closable: false,
      closed: false,
      countdownTime: 0,
    },
  };

export const NoIcon: import("@storybook/web-components").StoryObj<ToastArgs> = {
  render: ToastTemplate,
  args: {
    variant: "info",
    caption: "No Icon",
    description: "This toast has no icon.",
    icon: false,
    closable: false,
    closed: false,
    countdownTime: 0,
  },
};

export const WithActions: import("@storybook/web-components").StoryObj<ToastArgs> =
  {
    render: (args) => html`
      <jds-toast
        variant="${args.variant || "info"}"
        caption="${args.caption || "Toast with Actions"}"
        description="${args.description || "This toast has action buttons."}"
        icon="${args.icon !== undefined ? args.icon : true}"
        ?closable="${args.closable}"
        ?closed="${args.closed}"
        countdownTime="${args.countdownTime || 0}"
      >
        <jds-button slot="action" size="small" variant="primary"
          >Primary Action</jds-button
        >
        <jds-button slot="action-secondary" size="small" variant="secondary"
          >Secondary Action</jds-button
        >
      </jds-toast>
    `,
    args: {
      variant: "info",
      caption: "Toast with Actions",
      description: "This toast has action buttons.",
      icon: true,
      closable: false,
      closed: false,
      countdownTime: 0,
    },
  };
