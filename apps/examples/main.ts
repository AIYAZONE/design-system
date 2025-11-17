// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 在开发环境下直接由入口导入 less，确保 Vite 编译生效
import '../../src/styles/index.less';
import './styles/public.less';
import './styles/index.less';

// 注册并加载所有核心 Web Components 与图标
import '@jackery/core';
import '@jackery/icons';

// 主入口仅用于引入样式与后续交互脚本
// 如需页面交互，可在此补充 JS 逻辑
