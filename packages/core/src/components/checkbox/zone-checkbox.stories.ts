import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

interface CheckboxProps {
  checked: boolean;
  disabled: boolean;
  value: string;
  name: string;
  label: string;
}

const meta = {
  title: "03 基础组件/zone-checkbox",
  component: "zone-checkbox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "规范化复选框组件：用于选择/多选。支持选中与禁用状态，并与表单集成。",
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "是否选中",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "是否禁用",
      table: { defaultValue: { summary: "false" } },
    },
    label: {
      control: "text",
      description: "标签文本",
    },
    value: {
      control: "text",
      description: "表单值",
    },
    name: {
      control: "text",
      description: "表单名称",
    },
  },
};

export default meta;

const Template = (args: CheckboxProps) => html`
  <zone-checkbox
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    value=${ifDefined(args.value)}
    name=${ifDefined(args.name)}
    label=${ifDefined(args.label)}
  ></zone-checkbox>
`;

export const Default = {
  render: Template,
  args: {
    label: "Checkbox",
  },
};

export const Checked = {
  render: Template,
  args: {
    label: "Checked",
    checked: true,
  },
};

export const Disabled = {
  render: Template,
  args: {
    label: "Disabled",
    disabled: true,
  },
};

export const DisabledChecked = {
  render: Template,
  args: {
    label: "Disabled Checked",
    disabled: true,
    checked: true,
  },
};
