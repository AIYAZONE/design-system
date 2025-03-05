import type { I18nInstance } from '../utils/i18n/types';

declare global {
  interface Window {
    i18n: I18nInstance;
  }
}