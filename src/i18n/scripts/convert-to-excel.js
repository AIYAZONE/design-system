/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-06 16:51:08
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-07 11:00:17
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\i18n\scripts\convert-to-excel.js
 * @Description: 将多语言JSON文件转换为Excel文件的工具脚本
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */
import fs from 'fs';
import path from 'path';
import { languages, paths, getValue, collectKeys, createWorksheet } from './i18n-utils.js';

/**
 * 加载所有语言的翻译文件并收集所有翻译键
 * @returns {Object} 返回包含translations和allKeys的对象
 * @property {Object} translations - 包含所有语言翻译内容的对象，格式为：{ [语言代码]: 翻译内容 }
 * @property {Set<string>} allKeys - 包含所有翻译键的集合
 */
function loadTranslations() {
  const translations = {};
  const allKeys = new Set();

  languages.forEach(lang => {
    const filePath = path.join(paths.localesDir, `${lang}.json`);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      translations[lang] = content;
      collectKeys(content, '', allKeys);
    } catch (error) {
      console.error(`加载语言文件失败：${lang}`, error);
    }
  });

  return { translations, allKeys };
}

/**
 * 将翻译数据转换为Excel工作表所需的二维数组格式
 * @param {Object} translations - 包含所有语言翻译内容的对象
 * @param {Set<string>} allKeys - 包含所有翻译键的集合
 * @returns {Array<Array<string>>} 返回格式化后的翻译数据数组，每行包含键名和各语言的翻译
 */
function prepareTranslationData(translations, allKeys) {
  return Array.from(allKeys).sort().map(key => [
    key,
    ...languages.map(lang => getValue(translations[lang], key) || '')
  ]);
}

/**
 * 将翻译数据转换为Excel文件并保存
 * 主要步骤：
 * 1. 加载所有语言的翻译文件
 * 2. 准备Excel工作表数据
 * 3. 创建并配置Excel工作表
 * 4. 保存Excel文件
 */
async function convertToExcel() {
  // 检查并删除已存在的Excel文件
  if (fs.existsSync(paths.i18nFile)) {
    try {
      fs.unlinkSync(paths.i18nFile);
      console.log(`已删除旧的Excel文件：${paths.i18nFile}`);
    } catch (error) {
      console.error('删除旧的Excel文件失败：', error);
      return;
    }
  }

  const { translations, allKeys } = loadTranslations();
  const translationData = prepareTranslationData(translations, allKeys);

  const { workbook } = createWorksheet(translationData);

  try {
    await workbook.xlsx.writeFile(paths.i18nFile);
    console.log(`Excel文件已生成：${paths.i18nFile}`);
  } catch (error) {
    console.error('生成Excel文件失败：', error);
  }
}

// 执行转换程序
convertToExcel();