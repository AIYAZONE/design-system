/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 14:15:16
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-07 17:28:53
 * @FilePath: \AIYAZONE-F2E-Team\zone-design-system\src\i18n\scripts\i18n-utils.js
 * @Description: i18n国际化工具函数集合，用于处理多语言翻译文件的导入导出和转换
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

/**
 * 支持的语言列表
 * @type {string[]}
 */
// 注意：'jp' 是 'ja' 的兼容别名（共用日语语言包），Excel 中只保留 ja 列，故不在此列��
export const languages = ['en', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'nl'];


/**
 * 获取嵌套对象中的值
 * @param {Object} obj - 要查询的对象
 * @param {string} path - 点分隔的路径字符串，如 'a.b.c'
 * @returns {*} 路径对应的值，如果路径无效则返回 undefined
 */
export const getValue = (obj, path) =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);

/**
 * 收集对象中所有嵌套键
 * @param {Object} obj - 要收集键的对象
 * @param {string} [prefix=''] - 当前键的前缀
 * @param {Set} [keys=new Set()] - 用于存储收集到的键的Set对象
 * @returns {Set<string>} 包含所有键的Set对象
 */
export const collectKeys = (obj, prefix = '', keys = new Set()) => {
  Object.keys(obj).forEach(key => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      collectKeys(obj[key], currentKey, keys);
    } else {
      keys.add(currentKey);
    }
  });
  return keys;
};

/**
 * 设置Excel单元格的边框和对齐方式
 * @param {import('exceljs').Cell} cell - Excel单元格对象
 */
const setCellBorderAndAlignment = (cell) => {
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
};

/**
 * 创建并配置Excel工作表
 * @param {Array<Object>} data - 要写入Excel的数据数组
 * @param {Object} [options={}] - 工作表配置选项
 * @param {string} [options.sheetName='翻译'] - 工作表名称
 * @param {string[]} [options.headerRow=['翻译键', ...languages]] - 表头行数据
 * @param {number} [options.keyColumnWidth=40] - 键列宽度
 * @param {number} [options.languageColumnWidth=30] - 语言列宽度
 * @param {number} [options.headerFontSize=12] - 表头字体大小
 * @param {number} [options.contentFontSize=11] - 内容字体大小
 * @param {string} [options.fontFamily='Microsoft YaHei'] - 字体名称
 * @param {string} [options.headerColor='85B8FF'] - 表头背景色
 * @param {string} [options.evenRowColor='E1EDFF'] - 偶数行背景色
 * @returns {{workbook: import('exceljs').Workbook, worksheet: import('exceljs').Worksheet}} 工作簿和工作表对象
 */
export const createWorksheet = (data, options = {}) => {
  const {
    sheetName = '翻译',
    headerRow = ['翻译键', ...languages],
    keyColumnWidth = 40,
    languageColumnWidth = 30,
    headerFontSize = 12,
    contentFontSize = 11,
    fontFamily = 'Microsoft YaHei',
    headerColor = '85B8FF',
    evenRowColor = 'E1EDFF'
  } = options;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // 设置表头
  worksheet.addRow(headerRow);

  // 设置表头样式
  worksheet.getRow(1).font = { bold: true, size: headerFontSize, name: fontFamily };

  // 设置表头背景色
  Array.from({ length: languages.length + 1 }, (_, i) => i + 1).forEach(i => {
    worksheet.getCell(1, i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor }
    };
  });

  // 添加数据行
  if (data?.length > 0) {
    worksheet.addRows(data);
  }

  // 设置列宽
  worksheet.getColumn(1).width = keyColumnWidth;
  languages.forEach((_, index) => {
    worksheet.getColumn(index + 2).width = languageColumnWidth;
  });

  // 设置冻结窗格：冻结第一行和前两列
  worksheet.views = [{
    state: 'frozen',
    xSplit: 2,
    ySplit: 1,
    topLeftCell: 'C2',
    activeCell: 'C2'
  }];

  // 设置所有单元格的样式
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // 为表头行设置样式
      row.eachCell(setCellBorderAndAlignment);
    } else {
      // 为内容行设置样式
      row.eachCell((cell) => {
        setCellBorderAndAlignment(cell);
        cell.font = { name: fontFamily, size: contentFontSize };

        // 为偶数行添加背景色
        if (rowNumber % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: evenRowColor }
          };
        }
      });
    }
  });

  // 确保表头行高度足够
  worksheet.getRow(1).height = 25;

  return { workbook, worksheet };
};

/**
 * 将扁平化的翻译数据转换为嵌套对象结构
 * @param {Array<Object>} flatData - 扁平化的翻译数据数组，每个对象包含Key和各语言的翻译
 * @param {string[]} languages - 支持的语言列表
 * @returns {Object} 按语言分组的嵌套翻译对象
 */
export const convertFlatToNested = (flatData, languages) => {
  // 为每种语言初始化翻译对象
  const translations = Object.fromEntries(languages.map(lang => [lang, {}]));

  // 处理每一行数据
  flatData.forEach(row => {
    const key = row['Key'];
    if (!key) return;

    languages.forEach(lang => {
      const value = row[lang];
      if (value !== undefined && value !== '') {
        const keyParts = key.split('.');
        let current = translations[lang];

        // 构建嵌套对象结构
        keyParts.forEach((part, index, arr) => {
          if (index === arr.length - 1) {
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

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dir - 目录路径
 */
export const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * 导出公共路径配置
 * @type {Object}
 * @property {string} localesDir - 本地化文件目录路径
 * @property {string} i18nFile - 翻译Excel文件路径
 */
export const paths = {
  localesDir,
  i18nFile
};