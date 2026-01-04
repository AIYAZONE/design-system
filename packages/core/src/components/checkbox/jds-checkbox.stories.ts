import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

interface CheckboxProps {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  value: string;
  name: string;
  label: string;
}

const meta = {
  title: "03 基础组件/jds-checkbox",
  component: "jds-checkbox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "这是一个复选框组件，支持选中、禁用、不确定状态。",
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
    indeterminate: {
      control: "boolean",
      description: "是否处于不确定状态",
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
  <jds-checkbox
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    ?indeterminate=${args.indeterminate}
    value=${ifDefined(args.value)}
    name=${ifDefined(args.name)}
    label=${ifDefined(args.label)}
  ></jds-checkbox>
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

export const Indeterminate = {
  render: Template,
  args: {
    label: "Indeterminate",
    indeterminate: true,
  },
};
