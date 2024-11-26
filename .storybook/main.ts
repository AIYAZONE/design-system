module.exports = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx|mjs|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/web-components",
  core: {
    builder: "@storybook/builder-vite",
  },
};
