import type { Preview } from "@storybook/web-components";
// 先引入设计系统 JS 入口，确保自定义元素注册与组件逻辑加载
import "@zone/core";
// 引入图标库，确保 <zone-icon> 在 iframe 中已注册且样式生效
import "@zone/icons";
// 最后引入站点样式，使站点的 tokens 与变量覆盖核心包的默认值
import "zone:styles";
import { initialize, initI18nDom, setCurrLanguage } from "@zone/i18n";

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
          { value: "de", right: "🇩🇪", title: "Deutsch" },
          { value: "jp", right: "🇯🇵", title: "日本語" },
          { value: "fr", right: "🇫🇷", title: "Français" },
          { value: "es", right: "🇪🇸", title: "Español" },
          { value: "nl", right: "🇳🇱", title: "Nederlands" },
        ],
      },
    },
  },
  initialGlobals: {
    locale: "en",
  },
};

export default preview;

// 在 Storybook 预览层初始化 i18n（而非库入口）
initialize();
initI18nDom();

// 同步 Storybook 的全局 locale 到 i18n 控制器
// 注意：在切换 toolbar 时，Storybook 会更新 globals.locale，这里通过事件监听进行同步
if (typeof window !== "undefined") {
  // 初始同步
  setCurrLanguage((window as any).__STORYBOOK_PREVIEW__?.globals?.locale ?? "en");

  window.addEventListener("storyUpdate", () => {
    const locale = (window as any).__STORYBOOK_PREVIEW__?.globals?.locale;
    if (locale) setCurrLanguage(locale);
  });
}
