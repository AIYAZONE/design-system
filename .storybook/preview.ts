import type { Preview } from "@storybook/web-components";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["介绍", ["Welcome", "*"], "设计变量", "组件"],
        locales: "en-US",
      },
    },
  },

  tags: ["autodocs"],
  globalTypes: {
    locale: {
      description: "Internationalization locale",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", right: "🇺🇸", title: "English" },
          { value: "fr", right: "🇫🇷", title: "Français" },
          { value: "es", right: "🇪🇸", title: "Español" },
          { value: "zh", right: "🇨🇳", title: "中文" },
          { value: "kr", right: "🇰🇷", title: "한국어" },
        ],
      },
    },
  },
  initialGlobals: {
    locale: "en",
  },
};

export default preview;
