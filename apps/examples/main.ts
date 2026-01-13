// 注册并加载所有核心 Web Components 与图标
import '@jackery/design-system';

// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 在开发环境下直接由入口导入 less，确保 Vite 编译生效
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme');
const isProd = (import.meta as any).env?.PROD === true;
if (isProd) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = theme === 'v2' ? '/assets/examples-theme-v2.css' : '/assets/examples-theme-v1.css';
  document.head.appendChild(link);
} else {
  const injectInlineCss = async () => {
    if (theme === 'v2') {
      await import('@styles/themes/v2/index.less');
    } else {
      await import('@styles/themes/v1/index.less');
    }
  };
  injectInlineCss();
}

import './styles/public.less';

// @ts-ignore
import { initialize, initI18nDom } from '@jackery/design-system';
initialize();
initI18nDom();
