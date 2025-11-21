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

import '@jackery/core';
export * from '@jackery/core';
import '@jackery/icons';
export { JdsIcon } from '@jackery/icons';
// i18n 功能导出（保持纯导出，不做运行时初始化）
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
import '@styles/index.less';
