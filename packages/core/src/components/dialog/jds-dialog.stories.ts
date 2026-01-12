import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

interface DialogProps {
  class?: string;
  size?: string;
  caption?: string;
  open: boolean;
  critical: boolean;
  showClose?: boolean;
  closeOnEsc?: boolean;
  closeOnOverlay?: boolean;
  ariaLabelText?: string;
  initialFocus?: string;
  disableBodyScroll?: boolean;
  style: any;
  content: any;
}

const meta = {
  title: "03 基础组件/jds-dialog",
  tags: ["autodocs"],
  component: "jds-dialog",
  args: {
    size: 'large',
    caption: '默认对话框',
    open: false,
    critical: false,
    showClose: true,
    disableBodyScroll: true,
  },
  parameters: {
    docs: {
      description: {
        component: `规范化对话框组件：用于交互确认与信息展示。提供最小 API，支持打开/关闭、关闭策略、焦点管理与可访问性；支持 header/footer 插槽与尺寸控制。

推荐选择器策略（initialFocus）：
- 优先使用语义化 class（如 .confirm-btn/.primary-action）或唯一 id（如 #name-input）
- 选择器既可匹配插槽内容元素，也可匹配 Shadow 内部元素
- 找不到选择器时回退到第一个可聚焦元素；无可聚焦元素时回退到容器

### 主题 Tokens
样式由主题系统控制，以下为常用 Tokens：

| Token 变量名 | 说明 | 默认值 (v1) |
| :--- | :--- | :--- |
| --jds-dialog-bg | 背景色 | white |
| --jds-dialog-fg | 前景色 | text-l1 |
| --jds-dialog-overlay-bg | 遮罩背景 | overlay-70 |
| --jds-dialog-radius | 圆角 | rounded-12 (Desktop) / 24 (Mobile) |
| --jds-dialog-shadow | 阴影 | none |
| --jds-dialog-width | 宽度 (Desktop) | 640px (Large) / 1200px (Extra) |
| --jds-dialog-padding-x-large | 水平内边距 (Large) | 64px (Desktop) / 32px (Mobile) |
| --jds-dialog-padding-y-large | 垂直内边距 (Large) | 48px (Desktop) / 32px (Mobile) |
| --jds-dialog-transition-duration | 动画时长 | 0.3s |
`,
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
        category: "基础",
      },
    },
    caption: {
      description: "设置对话框的标题（或使用 header 插槽覆盖）",
      control: {
        type: "text",
      },
      table: {
        defaultValue: { summary: "-" },
        category: "基础",
      },
    },
    open: {
      description: "设置对话框的打开/关闭状态",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "基础",
      },
    },
    critical: {
      description: "关键对话框（不可通过键盘或遮罩层关闭）",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "基础",
      },
    },
    showClose: {
      description: "显示关闭按钮",
      control: "boolean",
      table: { defaultValue: { summary: "true" }, category: "基础" },
    },
    closeOnEsc: { table: { disable: true } },
    closeOnOverlay: { table: { disable: true } },
    ariaLabelText: {
      description: "无标题时的可访问性标签",
      control: { type: "text" },
      table: { defaultValue: { summary: "-" }, category: "高级" },
    },
    initialFocus: {
      description: "初始聚焦选择器（打开时）",
      control: { type: "text" },
      table: { defaultValue: { summary: "-" }, category: "高级" },
    },
    disableBodyScroll: {
      description: "打开时禁用页面滚动",
      control: "boolean",
      table: { defaultValue: { summary: "true" }, category: "高级" },
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
        category: "高级",
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
      ?showClose=${args.showClose}
      ariaLabelText=${ifDefined(args.ariaLabelText)}
      initialFocus=${ifDefined(args.initialFocus)}
      ?disableBodyScroll=${args.disableBodyScroll}
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
    showClose: true,
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
    showClose: true,
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
    showClose: true,
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
    showClose: false,
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
    showClose: true,
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
    showClose: true,
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

export const InitialFocus = {
  args: {
    size: 'large',
    caption: '初始聚焦示例',
    open: false,
    critical: false,
    showClose: true,
    initialFocus: '#focus-input',
  },
  render: (args: DialogProps) =>
    html`${DialogTemplate({
      ...args,
      class: 'initial-focus',
      content: `
        <div class="jds-b1" style="display:flex; flex-direction:column; gap:12px;">
          <input id="focus-input" type="text" placeholder="输入内容（不会首先聚焦）" />
          <div style="display:flex; gap:8px;">
            <jds-button class="cancel-btn" variant="secondary">取消</jds-button>
            <jds-button class="confirm-btn" variant="primary">确定</jds-button>
          </div>
          <p>打开后焦点会定位到“输入内容”输入框（选择器 #focus-input）。</p>
        </div>
      `,
    })}`,
};

export const ThemeComparison = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <div>
        <h3>v1 Theme (Rounded)</h3>
        <p class="jds-c1" style="margin-bottom: 8px;">Radius: 12px/24px</p>
        <jds-button @click=${() => document.getElementById('dialog-v1')?.setAttribute('open', 'true')}>
          Open v1 Dialog
        </jds-button>
        <jds-dialog
          id="dialog-v1"
          caption="v1 Theme Dialog"
          style="--jds-dialog-radius: var(--jds-rounded-12);"
          showClose
        >
          <p>This dialog simulates v1 theme (Rounded).</p>
        </jds-dialog>
      </div>
      
      <div>
        <h3>v2 Theme (Straight)</h3>
        <p class="jds-c1" style="margin-bottom: 8px;">Radius: 0</p>
        <jds-button @click=${() => document.getElementById('dialog-v2')?.setAttribute('open', 'true')}>
          Open v2 Dialog
        </jds-button>
        <jds-dialog
          id="dialog-v2"
          caption="v2 Theme Dialog"
          style="--jds-dialog-radius: 0;"
          showClose
        >
          <p>This dialog simulates v2 theme (Straight).</p>
        </jds-dialog>
      </div>
    </div>
  `
};
