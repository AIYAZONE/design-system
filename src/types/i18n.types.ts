/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 11:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-04 11:30:00
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\types\i18n.types.ts
 * @Description: i18n类型定义文件
 */

/**
 * 支持的语言类型
 * @description 当前支持英语(en)、简体中文(zh)和日语(ja)
 */
export type Language = 'en' | 'zh' | 'ja';

/**
 * 翻译消息的基本类型
 * @description 用于定义翻译文本的数据结构
 */
export type MessageSchema = {
  [key: string]: MessageSchema | string;
};

/**
 * i18n控制器接口
 * @description 用于在Lit组件中管理国际化的控制器接口
 */
export interface I18nController {
  /**
   * 翻译指定的键值
   * @param key - 翻译键，支持点号分隔的嵌套键值
   * @param params - 替换参数，用于替换翻译文本中的占位符
   * @returns 翻译后的文本
   */
  t(key: string, params?: Record<string, string | number>): string;

  /**
   * 获取当前语言
   */
  readonly currentLanguage: Language;

  /**
   * 当控制器与宿主断开连接时清理事件监听器
   */
  hostDisconnected(): void;
}

/**
 * i18n全局实例接口
 * @description 用于全局管理国际化的实例接口
 */
export interface I18nInstance {
  /**
   * 翻译指定的键值
   * @param key - 翻译键，支持点号分隔的嵌套键值
   * @param params - 替换参数，用于替换翻译文本中的占位符
   * @returns 翻译后的文本
   */
  t(key: string, params?: Record<string, string | number>): string;

  /**
   * 获取当前语言
   * @returns 当前设置的语言
   */
  getCurrentLanguage(): Language;

  /**
   * 设置当前语言
   * @param lang - 要设置的目标语言
   */
  setCurrLanguage(lang: Language): void;
}

/**
 * i18n语言变更事件接口
 * @description 当语言发生变化时触发的自定义事件接口
 */
export interface I18nChangeEvent extends CustomEvent<Language> {
  type: 'i18n-language-change';
}

/**
 * 扩展Window接口，添加全局i18n实例
 */
declare global {
  interface Window {
    /**
     * 全局i18n实例
     */
    i18n: I18nInstance;
  }
}