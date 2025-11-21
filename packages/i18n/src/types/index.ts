import { Language } from './languages';

/**
 * 翻译消息的基本类型
 * @description 用于定义翻译文本的数据结构
 */
export type MessageSchema = {
  [key: string]: string | MessageSchema;
};

/**
 * 国际化错误类型定义
 * @description 用于定义国际化过程中可能出现的错误类型
 */
export type I18nError = {
  /**
   * 错误类型
   * - MISSING_KEY: 翻译键不存在
   * - INVALID_PARAMS: 参数无效
   * - INTERNAL_ERROR: 内部错误
   */
  type: 'MISSING_KEY' | 'INVALID_PARAMS' | 'INTERNAL_ERROR';
  /**
   * 发生错误的翻译键
   */
  key: string;
  /**
   * 错误信息描述
   */
  message: string;
  /**
   * 可选的错误相关参数
   * @description 记录错误发生时的相关参数信息
   */
  params?: Record<string, string | number>;
};

// 错误处理函数
export type ErrorHandler = (error: I18nError) => void;

/**
 * 国际化配置接口
 * @description 用于定义国际化功能的配置选项
 */
export interface I18nConfig {
  /**
   * 默认语言
   * @description 系统初始化时使用的默认语言
   */
  defaultLanguage?: Language;

  /**
   * 后备语言
   * @description 当目标语言翻译缺失时，将使用该语言作为备选
   */
  fallbackLanguage?: Language;

  /**
   * 错误处理函数
   * @description 用于处理国际化过程中出现的错误，如缺失翻译等
   */
  errorHandler?: ErrorHandler;

  /**
   * 缓存大小
   * @description 翻译结果的缓存条目数量上限，用于优化性能
   */
  cacheSize?: number;
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
  t: (key: string, params?: Record<string, string | number>) => string;
   /**
   * 获取当前语言
   * @returns 当前设置的语言
   */
  getCurrLanguage: () => Language;
  /**
   * 设置当前语言
   * @param lang - 要设置的目标语言
   */
  setCurrLanguage: (lang: Language) => void;
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