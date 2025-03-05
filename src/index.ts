/*
 * @Author: HB-BruceWang
 * @Date: 2024-11-29 17:26:11
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 16:46:46
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import JdsInfo from "./components/info/index.js";
import JdsBadge from "./components/badge/index.js";
import JdsIcon from "./components/icon/index.js";
import JdsSpinner from "./components/spinner/index.js";
import JdsButton from "./components/button/index.js";
import JdsDialog from "./components/dialog/index.js";
import JdsToast from "./components/toast/index.js";
import JdsPopover from "./components/popover/index.js";
import JdsTooltip from "./components/tooltip/index.js";
import JdsI18n from "./components/i18n/index.js";
import JdsI18nExample from "./examples/i18n-example.js";

// 导入 i18n 相关功能
import {
  initialize,
  initI18nDom,
  t,
  setLanguage,
  getCurrentLanguage,
  I18nController
} from './i18n/index.js';

// 初始化 i18n
initialize();
initI18nDom();

export {
  JdsInfo,
  JdsBadge,
  JdsIcon,
  JdsSpinner,
  JdsButton,
  JdsDialog,
  JdsToast,
  JdsPopover,
  JdsTooltip,
  JdsI18n,
  JdsI18nExample,
  // i18n 相关功能导出
  t,
  setLanguage,
  getCurrentLanguage,
  I18nController
};
