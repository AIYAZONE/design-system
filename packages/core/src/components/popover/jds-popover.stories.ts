import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';

type PopoverArgs = {
  placement?: 'top' | 'bottom' | 'left' | 'right' |
    'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' |
    'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  target?: string;
};

const meta = {
  title: '03 基础组件/jds-popover',
  component: 'jds-popover',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'],
      description: 'Popover placement relative to target',
    },
    offset: {
      control: { type: 'number' },
      description: 'Offset from target element',
    },
    target: {
      control: { type: 'text' },
      description: 'Target element ID (optional, uses previous sibling by default)',
    },
  },
} satisfies Meta<PopoverArgs>;

export default meta;

const PopoverTemplate = (args: PopoverArgs) => html`
  <div style="padding: 100px;">
    <jds-button id="popover-trigger">Click me</jds-button>
    <jds-popover
      placement="${args.placement || 'bottom'}"
      offset="${args.offset || 8}"
      target="${args.target || 'popover-trigger'}"
    >
      <div style="max-width: 200px;">
        <h4>Popover Content</h4>
        <p>This is a popover with some content. It can contain any HTML content.</p>
        <jds-button size="small">Action</jds-button>
      </div>
    </jds-popover>
  </div>
`;

export const Default = {
  render: PopoverTemplate,
  args: {
    placement: 'bottom',
    offset: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const Top = {
  render: PopoverTemplate,
  args: {
    placement: 'top',
    offset: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const Left = {
  render: PopoverTemplate,
  args: {
    placement: 'left',
    offset: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const Right = {
  render: PopoverTemplate,
  args: {
    placement: 'right',
    offset: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const WithArrow = {
  render: (args) => html`
    <div style="padding: 100px;">
      <jds-button id="popover-trigger-arrow">Click me</jds-button>
      <jds-popover
        placement="${args.placement || 'bottom'}"
        offset="${args.offset || 8}"
        target="${args.target || 'popover-trigger-arrow'}"
        style="--jds-popover-arrow-display: block;"
      >
        <div style="max-width: 200px;">
          <h4>Popover with Arrow</h4>
          <p>This popover has an arrow pointing to the trigger element.</p>
        </div>
      </jds-popover>
    </div>
  `,
  args: {
    placement: 'bottom',
    offset: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const DifferentOffsets = {
  render: (args) => html`
    <div style="padding: 150px;">
      <jds-button id="popover-trigger-offset">Click me</jds-button>
      <jds-popover
        placement="${args.placement || 'bottom'}"
        offset="${args.offset || 20}"
        target="${args.target || 'popover-trigger-offset'}"
      >
        <div style="max-width: 200px;">
          <h4>Large Offset</h4>
          <p>This popover has a larger offset from the trigger element.</p>
        </div>
      </jds-popover>
    </div>
  `,
  args: {
    placement: 'bottom',
    offset: 20,
  },
} satisfies StoryObj<PopoverArgs>;
