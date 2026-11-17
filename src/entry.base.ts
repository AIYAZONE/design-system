/**
 * Design System 入口基底（共享逻辑）
 *
 * - 负责注册 core/icons/i18n，并统一 re-export 对外 API
 * - 不引入任何主题样式（避免主题重复注入），由不同入口按需选择是否加载主题
 * - 多语言入口负责初始化，重复调用复用已有监听与 DOM 观察器
 */

import '@aiyazone/core';
export * from '@aiyazone/core';
import '@aiyazone/icons';
export { ZoneIcon } from '@aiyazone/icons';
import '@aiyazone/i18n';
export {
  ZoneI18n,
  initialize,
  initI18nDom,
  t,
  setCurrLanguage,
  getCurrLanguage,
  I18nController,
  type I18nInstance
} from '@aiyazone/i18n';
