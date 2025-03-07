/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 14:15:16
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-07 11:15:32
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\i18n\scripts\i18n-utils.js
 * @Description: i18n工具函数
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import ExcelJS from 'exceljs';
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
// 创建并配置Excel工作表
export const createWorksheet = (data, options = {}) => {
  const {
    sheetName = '翻译',
    headerRow = ['翻译键', ...languages],
    keyColumnWidth = 40,
    languageColumnWidth = 30,
    headerFontSize = 12,
    contentFontSize = 11,
    fontFamily = 'Microsoft YaHei',
    headerColor = '85B8FF'
  } = options;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // 设置表头
  worksheet.addRow(headerRow);

  // 设置表头样式
  worksheet.getRow(1).font = {
    bold: true,
    size: headerFontSize,
    name: fontFamily
  };
  // 只为实际内容列设置背景色
  for (let i = 1; i <= languages.length + 1; i++) {
    worksheet.getCell(1, i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor }
    };
  }

  // 添加数据
  if (data && data.length > 0) {
    worksheet.addRows(data);
  }

  // 设置列宽
  worksheet.getColumn(1).width = keyColumnWidth;
  languages.forEach((_, index) => {
    worksheet.getColumn(index + 2).width = languageColumnWidth;
  });

  // 设置冻结窗格：冻结第一行和前两列
  worksheet.views = [
    {
      state: 'frozen',
      xSplit: 2,
      ySplit: 1,
      topLeftCell: 'C2',
      activeCell: 'C2'
    }
  ];

  // 设置所有单元格的样式
  worksheet.eachRow((row, rowNumber) => {
    // 跳过表头行
    if (rowNumber > 1) {
      // 为偶数行添加背景色
      if (rowNumber % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E1EDFF' }
          };
        });
      }
    }
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true
      };
      cell.font = {
        name: fontFamily,
        size: contentFontSize
      };
    });
  });

  return { workbook, worksheet };
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