/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 14:15:16
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-07 18:21:31
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
async function saveTranslationFiles(translations, outputDir) {
  try {
    ensureDirectoryExists(outputDir);

    const results = { success: [], failed: [] };

    // 改用串行处理以确保每个文件都能正确写入
    for (const lang of languages) {
      const filePath = path.join(outputDir, `${lang}.json`);
      const content = JSON.stringify(translations[lang], null, 2);

      try {
        // 写入临时文件
        const tempFilePath = `${filePath}.temp`;
        await fs.promises.writeFile(tempFilePath, content, 'utf8');

        // 验证临时文件内容
        const writtenContent = await fs.promises.readFile(tempFilePath, 'utf8');
        if (writtenContent !== content) {
          throw new Error('文件内容验证失败');
        }

        // 验证JSON格式
        try {
          JSON.parse(writtenContent);
        } catch (e) {
          throw new Error('JSON格式验证失败');
        }

        // 如果验证通过，将临时文件重命名为目标文件
        await fs.promises.rename(tempFilePath, filePath);

        results.success.push(lang);
        console.log(`✓ 已成功生成翻译文件：${filePath}`);
      } catch (error) {
        results.failed.push({ lang, error: error.message });
        console.error(`× ${lang}语言文件处理失败：${error.message}`);
        // 继续处理其他文件，而不是直接中断
        continue;
      }
    }

    // 输出最终处理结果
    if (results.failed.length > 0) {
      console.log('\n处理结果汇总：');
      console.log(`成功：${results.success.length} 个文件`);
      console.log('失败：', results.failed.length, '个文件');
      console.log('失败详情：', results.failed);
    }

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

    // 保存翻译文件并等待所有文件写入完成
    await saveTranslationFiles(translations, paths.localesDir);

    console.log('所有翻译文件已生成完成！');
  } catch (error) {
    console.error('转换过程出错:', error.message);
    process.exit(1);
  }
}

// 执行主函数
main();