import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import type { FilterSelectOption } from "./index";
import "./index";

const DEFAULT_OPTIONS: FilterSelectOption[] = [
  { value: "sp-1", label: "Solar Panels" },
  { value: "sp-2", label: "Solar Panels" },
  { value: "sp-3", label: "Solar Panels" },
  {
    value: "sg-1",
    label:
      "SG1500(2*100W)SG1500(2*100W)SG1500(2*100W)SG1500(2*100W)SG1500(2*100W)",
  },
  { value: "sg-2", label: "SG1500(2*100W)" },
  { value: "sg-3", label: "SG1500(2*100W)" },
  { value: "sg-4", label: "SG1500(4*100W)" },
  { value: "sg-5", label: "SG1500(4*100W)" },
  { value: "sg-5", label: "SG1500(4*100W)" },
];

interface FilterSelectProps {
  label?: string;
  language?: string;
  options: FilterSelectOption[];
  value: string[];
  open: boolean;
  disabled: boolean;
  placement: string;
  offset: number;
  showConfirm: boolean;
  showClear: boolean;
  showCounter: boolean;
  closeOnScroll: boolean;
  selectedSummary?: string;
  selectedText?: string;
  clearText?: string;
  confirmText?: string;
  emptyText?: string;
}

const meta = {
  title: "03 基础组件/jds-filter-select",
  component: "jds-filter-select",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "下拉筛选多选组件：触发器 + 浮层面板（已选计数 / 清空 / 多选列表 / 确认按钮）。\n\n" +
          "默认采用「草稿 + 确认」语义：勾选时触发器与面板计数实时更新，点击确认后才提交到 `value`；" +
          "外部点击或 ESC 关闭则丢弃草稿。关闭 `show-confirm` 后切换为即时生效模式。\n\n" +
          "**内置多语言**：筛选参数、已选择筛选{count}个参数、已选、清空、确定、暂无选项 等文案均取自 " +
          "`components.filterSelect.*`，跟随全局语言自动切换，当前支持 " +
          "en / de / jp / fr / es / nl / ko / zh-CN / zh-TW。\n\n" +
          "显式设置对应属性即可覆盖内置文案；属性值清空后重新回退到内置多语言。\n\n" +
          "**语言来源优先级**：`language` 属性 > 页面 `<html lang>`（自动读取，支持 en-US / zh-Hans / jp 等写法）" +
          "> 全局语言（setCurrLanguage）。切换站点时无需手动调用 setCurrLanguage，只需保证页面 `<html lang>` 正确，" +
          "组件会自动跟随；需要单独覆盖某实例时再设置 `language` 属性。\n\n" +
          "**开关类属性**：show-confirm / show-clear / show-counter / close-on-scroll 默认值为 true。\n\n" +
          "| 使用方式 | 写法 | 是否生效 |\n" +
          "| --- | --- | --- |\n" +
          "| 纯 HTML | `<jds-filter-select show-confirm>` / `show-confirm=\"false\"` | ✅ |\n" +
          "| JS 属性 | `el.showConfirm = false` | ✅ |\n" +
          "| lit-html 属性绑定 | `<jds-filter-select .showConfirm=${false}>` | ✅ |\n" +
          "| lit-html 布尔绑定 | `<jds-filter-select ?show-confirm=${false}>` | ❌ 首次渲染无效 |\n\n" +
          "布尔绑定 `?` 传 false 走的是 removeAttribute，属性本就不存在时是空操作，\n" +
          "不会触发 attributeChangedCallback；请用属性绑定 `.showConfirm=${false}`。",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "触发器文案（未设置时取内置多语言）" },
    language: {
      control: "text",
      description:
        "自定义语言（如 en / de / zh-CN / zh-Hans / en-US / jp）。设置后优先于页面 <html lang> 与全局语言；" +
        "未设置时自动读取 document.documentElement.lang，仍为空则回退全局语言。",
    },
    options: { control: "object", description: "可选项列表" },
    value: { control: "object", description: "已提交的选中值" },
    open: { control: "boolean", description: "面板是否展开" },
    disabled: { control: "boolean", description: "是否禁用" },
    placement: { control: "text", description: "浮层位置" },
    offset: { control: "number", description: "浮层与触发器的间距" },
    showConfirm: {
      control: "boolean",
      description: "是否展示底部确认按钮（false 为即时生效模式）",
    },
    showClear: { control: "boolean", description: "是否展示清空按钮" },
    showCounter: { control: "boolean", description: "是否展示已选计数" },
    selectedSummary: {
      control: "text",
      description:
        "有选中项时触发器的文案模板，支持 {count} / {label} 占位符（未设置时取内置多语言，实时更新）",
    },
    selectedText: { control: "text", description: "「已选 n/总数」中的「已选」文案" },
    clearText: { control: "text", description: "「清空」文案" },
    confirmText: { control: "text", description: "确认按钮文案" },
    emptyText: { control: "text", description: "无选项时的占位文案" },
    closeOnScroll: {
      control: "boolean",
      description: "页面滚动时自动收起面板（面板内选项列表滚动不会收起）",
    },
  },
};

export default meta;

// 注意：showConfirm / showClear / showCounter / closeOnScroll 默认值为 true，
// 必须使用「属性绑定」.showConfirm=${...} 而非布尔属性绑定 ?show-confirm=${...}。
// 后者传 false 时走的是 removeAttribute，属性本就不存在时属空操作，
// 不会触发 attributeChangedCallback，false 不会生效。
const Template = (args: FilterSelectProps) => html`
  <div style="padding: 16px 24px 360px;">
    <jds-filter-select
      label=${ifDefined(args.label)}
      language=${ifDefined(args.language)}
      .options=${args.options}
      .value=${args.value}
      ?open=${args.open}
      ?disabled=${args.disabled}
      placement=${args.placement}
      offset=${args.offset}
      .showConfirm=${args.showConfirm}
      .showClear=${args.showClear}
      .showCounter=${args.showCounter}
      .closeOnScroll=${args.closeOnScroll}
      selected-summary=${ifDefined(args.selectedSummary)}
      selected-text=${ifDefined(args.selectedText)}
      clear-text=${ifDefined(args.clearText)}
      confirm-text=${ifDefined(args.confirmText)}
      empty-text=${ifDefined(args.emptyText)}
    ></jds-filter-select>
  </div>
`;

export const Default = {
  render: Template,
  args: {
    // 文案类属性全部留空，交由内置多语言（components.filterSelect.*）驱动
    options: DEFAULT_OPTIONS,
    value: [],
    open: false,
    disabled: false,
    placement: "bottom-start",
    offset: 4,
    showConfirm: true,
    showClear: true,
    showCounter: true,
    closeOnScroll: true,
  },
};

export const Selected = {
  render: Template,
  args: {
    ...Default.args,
    value: ["sp-1", "sg-2", "sg-3"],
  },
};

export const CustomSummary = {
  render: Template,
  args: {
    ...Default.args,
    label: "产品类型",
    selectedSummary: "{label}（{count}）",
    value: ["sp-1", "sg-2"],
  },
};

export const Immediate = {
  render: Template,
  args: {
    ...Default.args,
    showConfirm: false,
  },
};

export const WithDisabledOption = {
  render: Template,
  args: {
    ...Default.args,
    options: [
      { value: "sp-1", label: "Solar Panels" },
      { value: "sp-2", label: "Solar Panels", disabled: true },
      { value: "sg-2", label: "SG1500(2*100W)" },
      { value: "sg-3", label: "SG1500(2*100W)" },
    ],
  },
};

export const WithoutCounter = {
  render: Template,
  args: {
    ...Default.args,
    showCounter: false,
    showClear: false,
  },
};

export const Empty = {
  render: Template,
  args: {
    ...Default.args,
    options: [],
  },
};

export const Disabled = {
  render: Template,
  args: {
    ...Default.args,
    disabled: true,
  },
};
