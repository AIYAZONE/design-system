export type Language = 'en' | 'zh' | 'ja';

export type MessageSchema = {
  [key: string]: string | MessageSchema;
};

export interface I18nInstance {
  t: (key: string, params?: Record<string, string | number>) => string;
  getCurrentLanguage: () => Language;
  setLanguage: (lang: Language) => void;
}

export type I18nError = {
  type: 'MISSING_KEY' | 'INVALID_PARAMS' | 'INTERNAL_ERROR';
  key: string;
  message: string;
  params?: Record<string, string | number>;
};

export type ErrorHandler = (error: I18nError) => void;

export interface I18nConfig {
  defaultLanguage?: Language;
  fallbackLanguage?: Language;
  errorHandler?: ErrorHandler;
  cacheSize?: number;
}