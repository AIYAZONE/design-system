/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 14:15:16
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-06 14:41:17
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\i18n\scripts\i18n-utils.js
 * @Description: i18n工具函数
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义基础路径
const localesDir = path.join(__dirname, '../locales');
const i18nFile = path.join(localesDir, 'i18n-translations.xlsx');

// 支持的语言列表
export const languages = ['en', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'it', 'ja', 'ko'];

// 获取嵌套对象中的值
export const getValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// 收集所有嵌套键
export const collectKeys = (obj, prefix = '', keys = new Set()) => {
  Object.keys(obj).forEach(key => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object') {
      collectKeys(obj[key], currentKey, keys);
    } else {
      keys.add(currentKey);
    }
  });
  return keys;
};

// 创建Excel工作表
export const createWorksheet = (data) => {
  const ws = XLSX.utils.aoa_to_sheet(data);

  // 设置列宽
  const colWidths = [{ wch: 40 }];
  languages.forEach(() => colWidths.push({ wch: 50 }));
  ws['!cols'] = colWidths;

  return ws;
};

// 将扁平化的键转换为嵌套对象
export const convertFlatToNested = (flatData, languages) => {
  const translations = {};

  // 为每种语言初始化翻译对象
  languages.forEach(lang => {
    translations[lang] = {};
  });

  // 处理每一行数据
  flatData.forEach(row => {
    const key = row['Key'];

    languages.forEach(lang => {
      const value = row[lang];
      if (value !== undefined && value !== '') {
        const keyParts = key.split('.');
        let current = translations[lang];

        keyParts.forEach((part, index) => {
          if (index === keyParts.length - 1) {
            current[part] = value;
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
      }
    });
  });

  return translations;
};

// 确保目录存在
export const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 导出公共路径
export const paths = {
  localesDir,
  i18nFile
};