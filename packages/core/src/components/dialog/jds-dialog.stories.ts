import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

interface DialogProps {
  class?: string;
  size?: string;
  caption?: string;
  open: boolean;
  critical: boolean;
  'no-close': boolean;
  style: any;
  content: any;
}

const meta: import("@storybook/web-components").Meta<DialogProps> = {
  title: "03 基础组件/jds-dialog",
  tags: ["autodocs"],
  component: "jds-dialog",
  args: {
    size: 'large',
    caption: '默认对话框',
    open: false,
    critical: false,
    'no-close': false,
  },
  parameters: {
    docs: {
      description: {
        component: "这是一个对话框组件，支持自定义标题、内容和操作按钮。可以通过CSS变量配置样式，如宽度、标题对齐方式和层级。",
      },
    },
  },
  argTypes: {
    size: {
      description: "设置对话框的尺寸",
      options: ["extra", "large"],
      control: {
        type: "select",
      },
      table: {
        defaultValue: { summary: "large" },
      },
    },
    caption: {
      description: "设置对话框的标题",
      control: {
        type: "text",
      },
      table: {
        defaultValue: { summary: "默认对话框" },
      },
    },
    open: {
      description: "设置对话框的打开/关闭状态",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    critical: {
      description: "确定对话框是否为关键对话框，关键对话框无法通过键盘、遮罩层关闭",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    'no-close': {
      description: "确定对话框是否隐藏关闭按钮",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    style: {
      description: `设置对话框的自定义样式，支持CSS变量配置，如：
      --jds-dialog-width: 800px;
      --jds-dialog-title-align: center;
      --jds-dialog-index: 1000;`,
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

const DialogTemplate = (args: DialogProps) => {
  return html`
  <div style="position: relative; height: 300px; overflow: hidden;">
    <jds-button
      @click=${() => {
      const dialog = document.querySelector(`jds-dialog.${args.class}`);
      if (dialog) {
        dialog.setAttribute('open', 'true');
      }
    }}
    >打开${args.caption || '无标题对话框'}</jds-button>
    <jds-dialog
      class=${ifDefined(args.class)}
      size=${ifDefined(args.size)}
      caption=${ifDefined(args.caption)}
      ?open=${args.open}
      ?critical=${args.critical}
      ?no-close=${args['no-close']}
      style="${ifDefined(args.style)}"
    >
      ${unsafeHTML(args.content)}
    </jds-dialog>
  </div>`;
};

export const Default = {
  args: {
    size: 'large',
    caption: '默认对话框',
    open: false,
    critical: false,
    'no-close': false,
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'default',
      content: `
        <div>
          <p>这是一个默认的对话框示例，包含标题和内容。</p>
          <p>点击右上角的关闭按钮、按下ESC键或点击遮罩层均可以关闭对话框。</p>
        </div>
      `,
    })}`,
};

export const Sizes = {
  args: {
    size: 'extra',
    caption: '特大对话框',
    open: false,
    critical: false,
    'no-close': false,
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'extra',
      content: `
        <ul>
          <li>这是一个特大尺寸的对话框示例，包含标题和内容。</li>
          <li>PC端宽度为1200px，移动端宽度为100%。</li>
          <li>移动端交互：从下向上渐隐展示</li>
          <li>点击右上角的关闭按钮、按下ESC键或点击遮罩层均可以关闭对话框。</li>
        </ul>
      `,
    })}`,
};

export const WithoutTitle = {
  args: {
    size: 'large',
    open: false,
    critical: false,
    'no-close': false,
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'without-title',
      caption: undefined,
      content: `
        <div class="jds-b1">
          <p>这是一个没有标题的对话框示例。</p>
          <p>对话框可以不设置标题，只显示内容和操作按钮。</p>
          <p>点击右上角的关闭按钮、按下ESC键或点击遮罩层均可以关闭对话框。</p>
        </div>
      `,
    })}`,
};

export const WithoutCloseIcon = {
  args: {
    size: 'large',
    caption: '没有关闭Icon的对话框',
    open: false,
    critical: false,
    'no-close': true,
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'without-close-icon',
      content: `
        <div class="jds-b1">
          <p>这是一个没有关闭Icon的对话框示例。</p>
          <p>对话框可以不设置关闭Icon，按下ESC键或点击遮罩层可以关闭对话框。</p>
        </div>
      `,
    })}`,
};

export const Critical = {
  args: {
    size: 'large',
    caption: '关键对话框',
    open: false,
    critical: true,
    'no-close': false,
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'critical',
      content: `
        <div class="jds-b1">
          <p>这是一个关键对话框示例。</p>
          <p>关键对话框无法通过键盘、遮罩层关闭。</p>
          <p>只能通过点击右上角的关闭按钮关闭对话框。</p>
        </div>
      `,
    })}`,
};

export const CustomStyle = {
  args: {
    size: 'large',
    caption: '自定义样式对话框',
    open: false,
    critical: false,
    'no-close': false,
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'custom-style',
      style: '--jds-dialog-width: 800px; --jds-dialog-title-align: center; --jds-dialog-index: 1000;',
      content: `
        <div class="jds-b1">
          <p>这是一个自定义样式的对话框示例。</p>
          <p>通过CSS变量可以自定义对话框的宽度、标题对齐方式和层级。</p>
          <p>点击右上角的关闭按钮、按下ESC键或点击遮罩层均可以关闭对话框。</p>
        </div>
      `,
    })}`,
};