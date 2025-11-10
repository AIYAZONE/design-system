import { html } from 'lit';
import './index';

type SpinnerArgs = {
  size?: string;
  disabled?: boolean;
  overlay?: boolean;
  color?: string;
};

const meta: import('@storybook/web-components').Meta<SpinnerArgs> = {
  title: '03 基础组件/jds-spinner',
  component: 'jds-spinner',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'text' },
      description: 'Spinner size (CSS value)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    overlay: {
      control: { type: 'boolean' },
      description: 'Overlay mode',
    },
    color: {
      control: { type: 'color' },
      description: 'Spinner color',
    },
  },
};

export default meta;
type Story = import('@storybook/web-components').StoryObj<SpinnerArgs>;

const SpinnerTemplate = (args: SpinnerArgs) => html`
  <jds-spinner
    size="${args.size || 'var(--jds-font-size-14)'}"
    ?disabled="${args.disabled}"
    ?overlay="${args.overlay}"
    color="${args.color || 'var(--jds-color-primary)'}"
  ></jds-spinner>
`;

export const Default: Story = {
  render: SpinnerTemplate,
  args: {
    size: 'var(--jds-font-size-14)',
    disabled: false,
    overlay: false,
    color: 'var(--jds-color-primary)',
  },
};

export const Large: Story = {
  render: SpinnerTemplate,
  args: {
    size: 'var(--jds-font-size-24)',
    disabled: false,
    overlay: false,
    color: 'var(--jds-color-primary)',
  },
};

export const CustomColor: Story = {
  render: SpinnerTemplate,
  args: {
    size: 'var(--jds-font-size-20)',
    disabled: false,
    overlay: false,
    color: '#ff6b6b',
  },
};

export const OverlayMode: Story = {
  render: (args: SpinnerArgs) => html`
    <div style="position: relative; width: 300px; height: 200px; background: #f0f0f0; border: 1px solid #ccc;">
      <div style="padding: 20px;">
        <h3>Content Area</h3>
        <p>This is some content that will be covered by the spinner overlay.</p>
      </div>
      <jds-spinner
        size="${args.size || 'var(--jds-font-size-24)'}"
        ?disabled="${args.disabled}"
        ?overlay="${true}"
        color="${args.color || 'var(--jds-color-primary)'}"
      ></jds-spinner>
    </div>
  `,
  args: {
    size: 'var(--jds-font-size-24)',
    disabled: false,
    overlay: true,
    color: 'var(--jds-color-primary)',
  },
};

export const Disabled: Story = {
  render: SpinnerTemplate,
  args: {
    size: 'var(--jds-font-size-16)',
    disabled: true,
    overlay: false,
    color: 'var(--jds-color-primary)',
  },
};
