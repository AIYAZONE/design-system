// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 在开发环境下直接由入口导入 less，确保 Vite 编译生效
// const params = new URLSearchParams(window.location.search);
// const theme = params.get('theme');
// if (theme === 'v2') {
//   await import('../../src/styles/themes/v2/index.less');
// } else {
//   await import('../../src/styles/themes/v1/index.less');
// }
// 属性驱动覆盖可选：在页面引入 themes-switch.css 时，这里不需要；
// 开发环境直接引入以便运行时切换验证
// await import('../../src/styles/themes/switch.less');

// await import('./styles/public.less');

// 注册并加载所有核心 Web Components 与图标
import '@jackery/design-system';
import { initialize, initI18nDom } from '@jackery/design-system';
initialize();
initI18nDom();

// 主入口仅用于引入样式与后续交互脚本
// 如需页面交互，可在此补充 JS 逻辑

import('./styles/public.less');