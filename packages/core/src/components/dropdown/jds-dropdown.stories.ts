import { html } from "lit";
import "./index";
import {
  dropdownFlatOptions,
  dropdownTreeOptions,
  dropdownMobileOptions,
} from "./demo-data";
import type { DropdownOption } from "./types";

const meta = {
  title: "03 基础组件/jds-dropdown",
  component: "jds-dropdown",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `单选下拉框：options 含 children 时自动显示可展开的树形列表，否则显示普通列表。父节点只展开，叶子节点提交选择。value 必须全树唯一，label 可以重复。options 通过 JS property 传入；更新时使用新数组。支持原生表单提交、必填校验、重置和 disabled fieldset。

事件：change（用户操作，detail: { value, option, pathValues, pathLabels }）、jds-dropdown-show、jds-dropdown-hide。程序设置 value 不触发 change。

键盘：上下键移动，左右键展开/收起，Home/End 到首尾，Enter/Space 确认，Escape 取消，Tab 离开。默认回填叶子名称，show-path 显示完整路径。

样式变量：--jds-dropdown-width、--jds-dropdown-height、--jds-dropdown-font-size、--jds-dropdown-child-font-size、--jds-dropdown-indent、--jds-dropdown-max-height、--jds-dropdown-border-color、--jds-dropdown-radius、--jds-dropdown-shadow、--jds-dropdown-focus-color、--jds-dropdown-option-background、--jds-dropdown-index。Parts：label、trigger、panel、option、clear、error。断点沿用项目 1024px。

浮层使用浏览器 Popover top layer（支持时）和 Floating UI，避免 overflow 裁切。表单集成依赖浏览器 ElementInternals；jsdom 单测不替代真实浏览器表单校验。`,
      },
    },
  },
  argTypes: {
    options: {
      control: "object",
      description: "DropdownOption[]；通过 property 传入",
    },
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    clearable: { control: "boolean" },
    showPath: { control: "boolean" },
    open: { control: "boolean" },
    emptyText: { control: "text" },
    requiredMessage: { control: "text" },
    clearLabel: { control: "text" },
    errorMessage: { control: "text" },
  },
};
export default meta;

interface Args {
  options: DropdownOption[];
  value: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  clearable: boolean;
  showPath: boolean;
  open: boolean;
  emptyText: string;
  requiredMessage: string;
  clearLabel: string;
  errorMessage: string;
}
const render = (args: Args) =>
  html`<div
    style="width: min(524px, 100%); min-height: 480px; padding: 8px; box-sizing: border-box;"
  >
    <jds-dropdown
      .options=${args.options}
      .value=${args.value}
      label=${args.label}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?clearable=${args.clearable}
      ?show-path=${args.showPath}
      ?open=${args.open}
      empty-text=${args.emptyText}
      required-message=${args.requiredMessage}
      clear-label=${args.clearLabel}
      error-message=${args.errorMessage}
    ></jds-dropdown>
  </div>`;
const args: Args = {
  options: dropdownFlatOptions,
  value: "",
  label: "Issue Type",
  placeholder: "Select issue type",
  disabled: false,
  required: true,
  clearable: false,
  showPath: false,
  open: false,
  emptyText: "No options",
  requiredMessage: "Please select an option.",
  clearLabel: "Clear selection",
  errorMessage: "",
};
export const Default = { render, args };
export const Hierarchical = {
  render,
  args: { ...args, options: dropdownTreeOptions },
};
export const PCDesign = {
  render,
  args: { ...args, options: dropdownTreeOptions, value: "sg1500", open: true },
};
export const MobileDesign = {
  render: (args: Args) =>
    html`<div style="width: min(311px, 100%); min-height: 440px; padding: 0;">
      <jds-dropdown
        .options=${args.options}
        .value=${args.value}
        placeholder="Select issue type"
        open
      ></jds-dropdown>
    </div>`,
  args: { ...args, options: dropdownMobileOptions, value: "sg1500" },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
export const ClearablePath = {
  render,
  args: {
    ...args,
    options: dropdownTreeOptions,
    value: "sg1500",
    clearable: true,
    showPath: true,
  },
};
export const Disabled = {
  render,
  args: { ...args, value: "power", disabled: true },
};
export const Empty = { render, args: { ...args, options: [] } };
export const Error = {
  render,
  args: { ...args, errorMessage: "Please select an issue type." },
};
export const Form = {
  render: () =>
    html`<form
      style="max-width: 524px; min-height: 480px;"
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        form.querySelector("output")!.textContent = JSON.stringify(
          Object.fromEntries(new FormData(form)),
        );
      }}
    >
      <jds-dropdown
        name="issueType"
        label="Issue Type"
        placeholder="Select issue type"
        .options=${dropdownTreeOptions}
        required
        clearable
      ></jds-dropdown>
      <div style="margin-top: 20px; display: flex; gap: 16px;">
        <button type="submit">Submit</button><button type="reset">Reset</button>
      </div>
      <output aria-live="polite"></output>
    </form>`,
};
