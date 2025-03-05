import type { I18nInstance } from '../i18n/types/types';

declare global {
  interface Window {
    i18n: I18nInstance;
  }
}