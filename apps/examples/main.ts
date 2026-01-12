// 注册并加载所有核心 Web Components 与图标
import '@jackery/design-system';

// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 在开发环境下直接由入口导入 less，确保 Vite 编译生效
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme');
if (theme === 'v2') {
   import('../../src/styles/themes/v2/index.less');
} else {
   import('../../src/styles/themes/v1/index.less');
}

import './styles/public.less';

// @ts-ignore
import { initialize, initI18nDom } from '@jackery/design-system';
initialize();
initI18nDom();
