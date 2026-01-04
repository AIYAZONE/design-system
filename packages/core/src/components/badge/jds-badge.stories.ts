import "./index";

const meta = {
  title: "03 基础组件/jds-badge",
  component: "jds-badge",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "规范化徽章组件：用于轻量展示标签或计数，并可作为链接导航。提供 soft/solid/outline 变体与语义 kind，支持尺寸 size、图标与计数。最小 API 聚焦展示与导航；高级参数仅在 custom+soft 场景用于对比度调优。",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "尺寸：small/medium/large，用于控制高度与字体大小",
      table: { category: "基础" },
    },
    content: {
      control: { type: "text" },
      description: "文本内容（默认插槽），用于展示标签文字",
      table: { category: "基础" },
    },
    icon: {
      control: { type: "text" },
      description: "前置图标名称（icons 系统），如 info-fill",
      table: { category: "基础" },
    },
    variant: {
      control: { type: "select" },
      options: ["soft", "solid", "outline"],
      description: "风格：soft（浅色）、solid（实色）、outline（描边）",
      table: { category: "基础" },
    },
    kind: {
      control: { type: "select" },
      options: ["default", "neutral", "success", "warning", "danger", "info", "custom"],
      description: "语义类型：default/neutral/success/warning/danger/info/custom",
      table: { category: "基础" },
    },
    count: {
      control: { type: "number" },
      description: "计数值，优先显示；大于 maxCount 显示“maxCount+”",
      table: { category: "基础" },
    },
    maxCount: {
      control: { type: "number" },
      description: "计数显示上限，默认 99",
      table: { category: "基础" },
    },
    href: {
      control: { type: "text" },
      description: "链接地址，设置后渲染为 <a>",
      table: { category: "基础" },
    },
    target: { table: { disable: true, category: "高级" } },
    ariaLabelText: { table: { disable: true, category: "高级" } },
    customColor: {
      control: { type: "color" },
      description: "自定义主色（仅 kind=custom 生效），会用于前景与 soft 背景计算",
      table: { category: "高级" },
    },
    customSoftBgMix: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "custom+soft 背景白色混合比例（0-100%），仅 kind=custom 生效，默认 65%",
      table: { category: "高级" },
    },
    customSoftFgDarken: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "custom+soft 前景加深比例（混入黑色 0-100%），仅 kind=custom 生效，默认 20%",
      table: { category: "高级" },
    },
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
    const el = document.createElement("jds-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant ?? "soft");
    el.setAttribute("kind", args.kind ?? "default");
    if (args.icon) el.setAttribute("icon", args.icon);
    // 统一前置图标，不再支持位置控制
    if (typeof args.count === "number") el.count = args.count;
    if (typeof args.maxCount === "number") el.maxCount = args.maxCount!;
    // 移除 closable/clickable
    if (args.href) el.setAttribute("href", args.href);
    // 移除 target/ariaLabelText
    if (args.customColor) el.style.setProperty("--jds-badge-custom-color", args.customColor);
    if (typeof args.customSoftBgMix === "number") el.style.setProperty("--jds-badge-soft-mix", `${args.customSoftBgMix}%`);
    if (typeof args.customSoftFgDarken === "number") el.style.setProperty("--jds-badge-soft-fg-darken", `${args.customSoftFgDarken}%`);
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
    iconPosition: "start",
  },
  render: (args: any) => {
    const el = document.createElement("jds-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant ?? "soft");
    el.setAttribute("kind", args.kind ?? "default");
    if (args.icon) el.setAttribute("icon", args.icon);
    // 统一前置图标
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
    const el = document.createElement("jds-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant ?? "soft");
    el.setAttribute("kind", args.kind ?? "default");
    el.count = args.count!;
    el.maxCount = args.maxCount!;
    return el;
  },
};


// 移除 Closable 与 Clickable 示例

export const CustomColor = {
  args: {
    size: "large",
    content: "Custom",
    variant: "soft",
    kind: "custom",
    customColor: "#ff7a00",
  },
  render: (args: any) => {
    const el = document.createElement("jds-badge");
    el.setAttribute("size", args.size);
    el.setAttribute("variant", args.variant);
    el.setAttribute("kind", args.kind);
    if (args.customColor) el.style.setProperty("--jds-badge-custom-color", args.customColor);
    el.textContent = args.content;
    return el;
  },
};
