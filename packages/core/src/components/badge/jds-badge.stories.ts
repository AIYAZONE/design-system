import "./index";

const meta: import("@storybook/web-components").Meta = {
  title: "03 基础组件/jds-badge",
  component: "jds-badge",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    icon: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = import("@storybook/web-components").StoryObj<{
  size: "small" | "medium" | "large";
  icon?: string;
  content: string;
}>;

export const Default: Story = {
  args: {
    size: "medium",
    content: "Badge",
  },
  render: (args) => {
    const el = document.createElement("jds-badge");
    el.setAttribute("size", args.size);
    if (args.icon) el.setAttribute("icon", args.icon);
    el.textContent = args.content;
    return el;
  },
};

export const WithIcon: Story = {
  args: {
    size: "medium",
    icon: "star-fill",
    content: "New",
  },
  render: (args) => {
    const el = document.createElement("jds-badge");
    el.setAttribute("size", args.size);
    if (args.icon) el.setAttribute("icon", args.icon);
    el.textContent = args.content;
    return el;
  },
};
