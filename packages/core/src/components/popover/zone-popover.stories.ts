import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';

type PopoverArgs = {
  placement?: 'top' | 'bottom' | 'left' | 'right' |
    'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' |
    'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  arrowPadding?: number;
  target?: string;
};

const meta = {
  title: '03 基础组件/zone-popover',
  component: 'zone-popover',
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
    arrowPadding: {
      control: { type: 'number' },
      description: 'Minimum distance between arrow and popover edge',
    },
    target: {
      control: { type: 'text' },
      description: 'Target element ID (optional, uses previous sibling by default)',
    },
  },
} satisfies Meta<PopoverArgs>;

export default meta;

const resolveTargetId = (args: PopoverArgs, fallbackId: string) => args.target || fallbackId;

const PopoverTemplate = (args: PopoverArgs) => html`
  ${(() => {
    const targetId = resolveTargetId(args, `popover-trigger-${args.placement || 'bottom'}-${args.offset || 8}`);
    return html`
  <div style="padding: 100px;">
    <zone-button id="${targetId}">Click me</zone-button>
    <zone-popover
        placement="${args.placement ?? 'bottom'}"
        offset="${args.offset ?? 8}"
        arrow-padding="${args.arrowPadding ?? 8}"
      target="${targetId}"
    >
      <div style="max-width: 200px;">
        <h4>Popover Content</h4>
        <p>This is a popover with some content. It can contain any HTML content.</p>
        <zone-button size="small">Action</zone-button>
      </div>
    </zone-popover>
  </div>
`;
  })()}
`;

export const Default = {
  render: PopoverTemplate,
  args: {
    placement: 'bottom',
    offset: 8,
    arrowPadding: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const Top = {
  render: PopoverTemplate,
  args: {
    placement: 'top',
    offset: 8,
    arrowPadding: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const Left = {
  render: PopoverTemplate,
  args: {
    placement: 'left',
    offset: 8,
    arrowPadding: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const Right = {
  render: PopoverTemplate,
  args: {
    placement: 'right',
    offset: 8,
    arrowPadding: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const WithArrow = {
  render: (args: PopoverArgs) => html`
    ${(() => {
        const targetId = resolveTargetId(args, `popover-trigger-arrow-${args.placement ?? 'bottom'}-${args.offset ?? 8}`);
      return html`
    <div style="padding: 100px;">
      <zone-button id="${targetId}">Click me</zone-button>
      <zone-popover
          placement="${args.placement ?? 'bottom'}"
          offset="${args.offset ?? 8}"
          arrow-padding="${args.arrowPadding ?? 8}"
        target="${targetId}"
        style="--zone-popover-arrow-display: block;"
      >
        <div style="max-width: 200px;">
          <h4>Popover with Arrow</h4>
          <p>This popover has an arrow pointing to the trigger element.</p>
        </div>
      </zone-popover>
    </div>
  `;
    })()}
  `,
  args: {
    placement: 'bottom',
    offset: 8,
    arrowPadding: 8,
  },
} satisfies StoryObj<PopoverArgs>;

export const DifferentOffsets = {
  render: (args: PopoverArgs) => html`
    ${(() => {
        const targetId = resolveTargetId(args, `popover-trigger-offset-${args.placement ?? 'bottom'}-${args.offset ?? 20}`);
      return html`
    <div style="padding: 150px;">
      <zone-button id="${targetId}">Click me</zone-button>
      <zone-popover
          placement="${args.placement ?? 'bottom'}"
          offset="${args.offset ?? 20}"
          arrow-padding="${args.arrowPadding ?? 8}"
        target="${targetId}"
      >
        <div style="max-width: 200px;">
          <h4>Large Offset</h4>
          <p>This popover has a larger offset from the trigger element.</p>
        </div>
      </zone-popover>
    </div>
  `;
    })()}
  `,
  args: {
    placement: 'bottom',
    offset: 20,
    arrowPadding: 8,
  },
} satisfies StoryObj<PopoverArgs>;
