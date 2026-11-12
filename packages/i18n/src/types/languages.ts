/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-07 13:49:42
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-07 15:47:24
 * @FilePath: \AIYAZONE-F2E-Team\zone-design-system\src\i18n\types\languages.ts
 * @Description: 多语言支持模块的语言配置文件
 * 该模块定义了系统支持的语言列表、语言资源映射以及相关的工具函数
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */

import en from '../locales/en.json';
import ja from '../locales/ja.json';
import de from '../locales/de.json';
import it from '../locales/it.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import nl from '../locales/nl.json';
import ko from '../locales/ko.json';
import zhCN from '../locales/zh-CN.json';
import zhTW from '../locales/zh-TW.json';
import { MessageSchema } from '../types';

/**
 * 系统支持的语言代码列表
 * 包含英语、日语、德语、意大利语、法语、西班牙语、荷兰语、韩语、简体中文和繁体中文
 * 使用 as const 确保类型推导的准确性
 * 注：'jp' 为 'ja'（日语）的兼容别名，两者共用同一份语言包
 */
export const SUPPORTED_LANGUAGES = [
  'en',
  'ja',
  'jp',
  'de',
  'it',
  'fr',
  'es',
  'nl',
  'ko',
  'zh-CN',
  'zh-TW'
]

/**
 * 语言资源映射对象
 * 将每种支持的语言代码映射到对应的语言资源文件
 * @type {Record<Language, MessageSchema>}
 */
export const messages: Record<Language, MessageSchema> = {
  en,
  ja,
  // 'jp' 与 'ja' 共用日语语言包
  jp: ja,
  de,
  it,
  fr,
  es,
  nl,
  ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW
};

/**
 * 语言类型定义
 * 通过 SUPPORTED_LANGUAGES 数组自动推导出支持的语言类型
 * 这确保了类型安全，只能使用预定义的语言代码
 */
export type Language = typeof SUPPORTED_LANGUAGES[number];

/**
 * 获取系统支持的所有语言代码列表
 * 该函数可用于UI展示支持的语言选项、验证语言设置等场景
 *
 * @returns {typeof SUPPORTED_LANGUAGES} 返回只读的支持语言代码数组
 * @example
 * const languages = getSupportedLanguages();
 * // languages = ['en', 'ja', 'jp', 'de', 'it', 'fr', 'es', 'nl', 'ko', 'zh-CN', 'zh-TW']
 */
export function getSupportedLanguages(): typeof SUPPORTED_LANGUAGES {
  return SUPPORTED_LANGUAGES;
}

/**
 * 检查指定的语言代码是否被系统支持
 * 该函数可用于语言切换前的验证、用户语言设置的校验等场景
 *
 * @param {Language} lang - 需要检查的语言代码
 * @returns {boolean} 如果语言被支持返回true，否则返回false
 * @example
 * if (isLanguageSupported('en')) {
 *   // 切换到英语
 * }
 */
export function isLanguageSupported(lang: Language): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}