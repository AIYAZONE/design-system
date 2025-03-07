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
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { languages, paths, convertFlatToNested, ensureDirectoryExists } from './i18n-utils.js';

/**
 * 读取并解析Excel文件
 * @param {string} filePath - Excel文件路径
 * @returns {Promise<ExcelJS.Worksheet>} - 返回第一个工作表
 * @throws {Error} - 如果文件读取失败则抛出错误
 */
async function readExcelFile(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    return workbook.getWorksheet(1);
  } catch (error) {
    throw new Error(`Excel文件读取失败: ${error.message}`);
  }
}

/**
 * 将工作表数据转换为扁平化的JSON格式
 * @param {ExcelJS.Worksheet} worksheet - Excel工作表
 * @returns {Array<Object>} - 扁平化的翻译数据数组
 */
function convertWorksheetToData(worksheet) {
  const data = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // 跳过表头
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      if (colNumber === 1) {
        rowData.Key = cell.value;
      } else {
        rowData[languages[colNumber - 2]] = cell.value || '';
      }
    });
    data.push(rowData);
  });
  return data;
}

/**
 * 保存翻译文件
 * @param {Object} translations - 翻译数据对象
 * @param {string} outputDir - 输出目录路径
 * @throws {Error} - 如果文件保存失败则抛出错误
 */
function saveTranslationFiles(translations, outputDir) {
  try {
    ensureDirectoryExists(outputDir);
    languages.forEach(lang => {
      const filePath = path.join(outputDir, `${lang}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translations[lang], null, 2), 'utf8');
      console.log(`已生成翻译文件：${filePath}`);
    });
  } catch (error) {
    throw new Error(`翻译文件保存失败: ${error.message}`);
  }
}

/**
 * 主函数：执行Excel到JSON的转换流程
 */
async function main() {
  try {
    // 读取Excel文件
    const worksheet = await readExcelFile(paths.i18nFile);

    // 转换数据格式
    const data = convertWorksheetToData(worksheet);

    // 将扁平化的数据转换为嵌套对象
    const translations = convertFlatToNested(data, languages);

    // 保存翻译文件
    saveTranslationFiles(translations, paths.localesDir);

    console.log('所有翻译文件已生成完成！');
  } catch (error) {
    console.error('转换过程出错:', error.message);
    process.exit(1);
  }
}

// 执行主函数
main();