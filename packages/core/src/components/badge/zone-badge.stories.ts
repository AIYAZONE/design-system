import "./index";

const meta = {
  title: "03 基础组件/zone-badge",
  component: "zone-badge",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "规范化徽章组件：用于轻量展示标签或计数，并可作为链接导航。",
          "提供 soft/solid/outline 变体与语义 kind，支持尺寸 size、图标与计数。",
          "",
          "推荐的颜色配置方式：",
          "- 背景：--zone-badge-bg-color",
          "- 文字：--zone-badge-text-color（不设置时回退 --zone-badge-color）",
          "- outline 边框：默认跟随 --zone-badge-color",
          "",
          "solid 默认白字以保证对比度；如需自定义文字色优先使用 --zone-badge-text-color（旧变量 --zone-badge-solid-fg 仍兼容）。",
          "kind=custom 时可直接使用 --zone-badge-color 作为主色输入；主题会基于该值推导 soft 背景/前景。",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "尺寸：small/medium/large，用于控制高度与字体大小",
      table: { category: "基础", defaultValue: { summary: "medium" } },
    },
    content: {
      control: { type: "text" },
      description: "文本内容（默认插槽），用于展示标签文字",
      table: { category: "基础", defaultValue: { summary: "-" } },
    },
    icon: {
      control: { type: "text" },
      description: "图标名称（icons 系统），如 info-fill",
      table: { category: "基础", defaultValue: { summary: "-" } },
    },
    iconPosition: {
      control: { type: "select" },
      options: ["prev", "next"],
      description: "图标位置：prev（文本前）/ next（文本后），默认 next",
      table: { category: "基础", defaultValue: { summary: "next" } },
    },
    variant: {
      control: { type: "select" },
      options: ["soft", "solid", "outline"],
      description: "风格：soft（浅色）、solid（实色）、outline（描边）",
      table: { category: "基础", defaultValue: { summary: "soft" } },
    },
    kind: {
      control: { type: "select" },
      options: ["default", "neutral", "success", "warning", "danger", "info", "custom"],
      description: "语义类型：default/neutral/success/warning/danger/info/custom",
      table: { category: "基础", defaultValue: { summary: "default" } },
    },
    count: {
      control: { type: "number" },
      description: "计数值，优先显示；大于 maxCount 显示“maxCount+”",
      table: { category: "基础", defaultValue: { summary: "-" } },
    },
    maxCount: {
      control: { type: "number" },
      description: "计数显示上限，默认 99",
      table: { category: "基础", defaultValue: { summary: "99" } },
    },
    href: {
      control: { type: "text" },
      description: "链接地址，设置后渲染为 <a>",
      table: { category: "基础", defaultValue: { summary: "-" } },
    },
    target: { table: { disable: true, category: "高级", defaultValue: { summary: "-" } } },
    ariaLabelText: { table: { disable: true, category: "高级", defaultValue: { summary: "-" } } },
    badgeColor: {
      control: { type: "color" },
      description: "通过 CSS 变量 --zone-badge-color 覆写主色（custom/outline/solid 等都会使用）。若需精确控制对比度，建议覆写 --zone-badge-soft-bg/--zone-badge-soft-fg 或统一覆写 --zone-badge-text-color。",
      table: { category: "高级", defaultValue: { summary: "-" } },
    },
    customSoftBgMix: { table: { disable: true } },
    customSoftFgDarken: { table: { disable: true } },
  },
} as const;

export default meta;

export const Default = {
  args: {
    size: "medium",
    content: "Badge",
    variant: "soft",
    kind: "default",
  },
  render: (args: any) => {
    const el = document.createElement("zone-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant ?? "soft");
    el.setAttribute("kind", args.kind ?? "default");
    if (args.icon) el.setAttribute("icon", args.icon);
    if (args.iconPosition) el.setAttribute("iconPosition", args.iconPosition);
    if (typeof args.count === "number") el.count = args.count;
    if (typeof args.maxCount === "number") el.maxCount = args.maxCount!;
    // 移除 closable/clickable
    if (args.href) el.setAttribute("href", args.href);
    // 移除 target/ariaLabelText
    if (args.badgeColor) el.style.setProperty("--zone-badge-color", args.badgeColor);
    el.textContent = args.content;
    return el;
  },
};

export const WithIcon = {
  args: {
    size: "medium",
    icon: "star-fill",
    content: "New",
    variant: "soft",
    kind: "info",
    iconPosition: "next",
  },
  render: (args: any) => {
    const el = document.createElement("zone-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant ?? "soft");
    el.setAttribute("kind", args.kind ?? "default");
    if (args.icon) el.setAttribute("icon", args.icon);
    if (args.iconPosition) el.setAttribute("iconPosition", args.iconPosition);
    el.textContent = args.content;
    return el;
  },
};

export const Count = {
  args: {
    size: "small",
    content: "",
    count: 120,
    maxCount: 99,
    variant: "solid",
    kind: "danger",
  },
  render: (args: any) => {
    const el = document.createElement("zone-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant ?? "soft");
    el.setAttribute("kind", args.kind ?? "default");
    el.count = args.count!;
    el.maxCount = args.maxCount!;
    return el;
  },
};


// 移除 Closable 与 Clickable 示例

export const Custom = {
  args: {
    size: "large",
    content: "Custom",
    variant: "soft",
    kind: "custom",
    badgeColor: "#ff7a00",
  },
  render: (args: any) => {
    const el = document.createElement("zone-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant);
    el.setAttribute("kind", args.kind);
    if (args.badgeColor) el.style.setProperty("--zone-badge-color", args.badgeColor);
    el.textContent = args.content;
    return el;
  },
};
