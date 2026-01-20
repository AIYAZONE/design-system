/*
 * @Author: HB-BruceWang
 * @Date: 2024-11-29 17:26:11
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-04-09 10:12:20
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\index.ts
 * @Description: Jackery Design System
 *
 * 默认对外入口（包含默认主题 v1）
 * - 自动引入 @styles/index.less（当前默认映射到 themes/v1）
 * - 其余注册与导出逻辑由 entry.base.ts 统一承载
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */

import '@styles/index.less';
export * from './entry.base';
