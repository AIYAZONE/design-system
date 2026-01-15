/**
 * Design System 入口基底（共享逻辑）
 *
 * - 负责注册 core/icons/i18n，并统一 re-export 对外 API
 * - 不引入任何主题样式（避免主题重复注入），由不同入口按需选择是否加载主题
 * - 仅在此处执行一次 initI18nDom()，避免多入口重复初始化
 */

import '@jackery/core';
export * from '@jackery/core';
import '@jackery/icons';
export { JdsIcon } from '@jackery/icons';
import '@jackery/i18n';
import { initI18nDom } from '@jackery/i18n';
export {
  JdsI18n,
  initialize,
  initI18nDom,
  t,
  setCurrLanguage,
  getCurrLanguage,
  I18nController,
  type I18nInstance
} from '@jackery/i18n';
initI18nDom();
