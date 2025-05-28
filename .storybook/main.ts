import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    "../docs/**/*.mdx",
    "../src/**/*.stories.@(ts|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  staticDirs: [
    { from: '../public', to: '/public' },
    { from: '../dist', to: '/' }
  ],
  docs: {
    autodocs: true,
    defaultName: "Document",
  },
};

export default config;
