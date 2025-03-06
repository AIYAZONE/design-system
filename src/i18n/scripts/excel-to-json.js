/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 14:15:16
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-06 14:33:44
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\i18n\scripts\excel-to-json.js
 * @Description: 将Excel文件转换为JSON语言文件
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { languages, paths, convertFlatToNested, ensureDirectoryExists } from './i18n-utils.js';

// 读取Excel文件
const workbook = XLSX.readFile(paths.i18nFile);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

// 将扁平化的数据转换为嵌套对象
const translations = convertFlatToNested(data, languages);

// 确保目标目录存在
ensureDirectoryExists(paths.localesDir);

// 保存每种语言的翻译文件
languages.forEach(lang => {
  const filePath = path.join(paths.localesDir, `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(translations[lang], null, 2), 'utf8');
  console.log(`已生成翻译文件：${filePath}`);
});

console.log('所有翻译文件已生成完成！');