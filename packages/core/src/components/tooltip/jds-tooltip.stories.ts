import { html } from 'lit';
import './index';

type TooltipArgs = {
  placement?: 'top' | 'bottom' | 'left' | 'right' |
    'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' |
    'left-start' | 'left-end' | 'right-start' | 'right-end';
  target?: string;
};

const meta: import('@storybook/web-components').Meta<TooltipArgs> = {
  title: '03 基础组件/jds-tooltip',
  component: 'jds-tooltip',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'],
      description: 'Tooltip placement relative to target',
    },
    target: {
      control: { type: 'text' },
      description: 'Target element ID (optional, uses trigger slot by default)',
    },
  },
};

export default meta;

const TooltipTemplate = (args: TooltipArgs) => html`
  <div style="padding: 100px;">
    <jds-tooltip placement="${args.placement || 'top'}">
      <jds-button slot="tooltip-trigger">Hover me</jds-button>
      <div slot="" style="max-width: 200px;">
        This is a tooltip with helpful information.
      </div>
    </jds-tooltip>
  </div>
`;

export const Default: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: TooltipTemplate,
  args: {
    placement: 'top',
  },
};

export const Top: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: TooltipTemplate,
  args: {
    placement: 'top',
  },
};

export const Bottom: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: TooltipTemplate,
  args: {
    placement: 'bottom',
  },
};

export const Left: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: TooltipTemplate,
  args: {
    placement: 'left',
  },
};

export const Right: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: TooltipTemplate,
  args: {
    placement: 'right',
  },
};

export const WithTarget: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: (args) => html`
    <div style="padding: 100px;">
      <jds-button id="tooltip-target">Hover me (target)</jds-button>
      <jds-tooltip placement="${args.placement || 'top'}" target="${args.target || 'tooltip-target'}">
        <div style="max-width: 200px;">
          This tooltip uses the target attribute instead of the trigger slot.
        </div>
      </jds-tooltip>
    </div>
  `,
  args: {
    placement: 'top',
  },
};

export const LongContent: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: (args) => html`
    <div style="padding: 100px;">
      <jds-tooltip placement="${args.placement || 'top'}">
        <jds-button slot="tooltip-trigger">Hover for long content</jds-button>
        <div slot="" style="max-width: 300px;">
          This is a tooltip with much longer content that demonstrates how the tooltip handles multiple lines of text. It should wrap appropriately and maintain good readability.
        </div>
      </jds-tooltip>
    </div>
  `,
  args: {
    placement: 'top',
  },
};

export const MobileRightEdge: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: (args) => html`
    <div style="width: 320px; padding: 24px 12px 80px; background: #f5f5f5;">
      <div style="display: flex; justify-content: flex-end;">
        <span>Members Only</span>
        <jds-tooltip placement="${args.placement || 'top'}">
          <jds-icon slot="tooltip-trigger" name="alert-line"></jds-icon>
          <div slot="" style="max-width: 260px;">
            Original Price $140.00<br />
            Members exclusive discount -$14.00<br />
            Members Price $126.00
          </div>
        </jds-tooltip>
      </div>
    </div>
  `,
  args: {
    placement: 'top-end',
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MultipleTooltips: import('@storybook/web-components').StoryObj<TooltipArgs> = {
  render: () => html`
    <div style="padding: 100px; display: flex; gap: 20px; flex-wrap: wrap;">
      <jds-tooltip placement="top">
        <jds-button slot="tooltip-trigger">Top</jds-button>
        <div>Top tooltip</div>
      </jds-tooltip>

      <jds-tooltip placement="bottom">
        <jds-button slot="tooltip-trigger">Bottom</jds-button>
        <div>Bottom tooltip</div>
      </jds-tooltip>

      <jds-tooltip placement="left">
        <jds-button slot="tooltip-trigger">Left</jds-button>
        <div>Left tooltip</div>
      </jds-tooltip>

      <jds-tooltip placement="right">
        <jds-button slot="tooltip-trigger">Right</jds-button>
        <div>Right tooltip</div>
      </jds-tooltip>
    </div>
  `,
};
