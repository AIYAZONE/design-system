module.exports = {
  stories: [
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx|mjs|mdx)",
    "../src/stories/*.@(js|jsx|ts|tsx|mjs|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/web-components-vite",
};
