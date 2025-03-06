/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 14:15:16
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-06 14:27:39
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\i18n\scripts\convert-to-excel.js
 * @Description: 将JSON语言文件转换为Excel文件
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { languages, paths, getValue, collectKeys, createWorksheet } from './i18n-utils.js';

// 初始化翻译对象和键集合
const translations = {};
const allKeys = new Set();

// 读取所有语言文件并收集翻译键
languages.forEach(lang => {
  const filePath = path.join(paths.localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  translations[lang] = content;
  collectKeys(content, '', allKeys);
});

// 准备Excel数据
const excelData = [];

// 添加表头
const headers = ['Key', ...languages];
excelData.push(headers);

// 添加翻译数据
Array.from(allKeys).sort().forEach(key => {
  const row = [key];
  languages.forEach(lang => {
    const value = getValue(translations[lang], key) || '';
    row.push(value);
  });
  excelData.push(row);
});

// 创建工作表
const ws = createWorksheet(excelData);

// 创建工作簿并保存
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Translations');
XLSX.writeFile(wb, paths.i18nFile);

console.log(`Excel文件已生成：${paths.i18nFile}`);