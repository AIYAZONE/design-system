// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 样式不再由 TS 注入，统一通过各页面 <link> 引入

// 注册并加载所有核心 Web Components 与图标
import '@jackery/core';
import '@jackery/icons';

// 主入口仅用于引入样式与后续交互脚本
// 如需页面交互，可在此补充 JS 逻辑
