/*
 * @Author: HB-BruceWang
 * @Date: 2024-11-29 17:26:11
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-04-09 10:12:20
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\index.ts
 * @Description: Jackery Design System
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */

import { JdsIcon } from "@jackery/icons";

import JdsBadge from "./components/badge/index.js";
import JdsSpinner from "./components/spinner/index.js";
import JdsButton from "./components/button/index.js";
import JdsDialog from "./components/dialog/index.js";
import JdsToast from "./components/toast/index.js";
import JdsPopover from "./components/popover/index.js";
import JdsTooltip from "./components/tooltip/index.js";
import JdsI18n from "./components/i18n/index.js";

// i18n
import {
  initialize,
  initI18nDom,
  setCurrLanguage,
  getCurrLanguage,
  t,
  I18nController,
  type I18nInstance
} from './i18n/index.js';

// 初始化 i18n
initialize();
initI18nDom();

export {
  JdsIcon,
  JdsBadge,
  JdsSpinner,
  JdsButton,
  JdsDialog,
  JdsToast,
  JdsPopover,
  JdsTooltip,
  JdsI18n,
  // i18n 相关功能导出
  initialize,
  initI18nDom,
  t,
  setCurrLanguage,
  getCurrLanguage,
  I18nController,
  type I18nInstance
};
