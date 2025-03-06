import en from '../locales/en.json';
import ja from '../locales/ja.json';
import de from '../locales/de.json';
import it from '../locales/it.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import ko from '../locales/ko.json';
import zhCN from '../locales/zh-CN.json';
import zhTW from '../locales/zh-TW.json';
import { MessageSchema } from '../types';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  'en',
  'ja',
  'de',
  'it',
  'fr',
  'es',
  'ko',
  'zh-CN',
  'zh-TW'
] as const;

// 语言资源映射
export const messages: Record<Language, MessageSchema> = {
  en,
  ja,
  de,
  it,
  fr,
  es,
  ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW
};

// 语言类型（从SUPPORTED_LANGUAGES自动推导）
export type Language = typeof SUPPORTED_LANGUAGES[number];

// 获取所有支持的语言列表
export function getSupportedLanguages(): typeof SUPPORTED_LANGUAGES {
  return SUPPORTED_LANGUAGES;
}

// 检查语言是否支持
export function isLanguageSupported(lang: Language): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}