// 轻量示例脚本：提供基本的 window.i18n 翻译能力，并填充 data-i18n-* 文本
// 注意：真实项目请使用 @jackery/i18n 包提供的完整功能。本脚本仅用于示例站演示。

type Dict = Record<string, Record<string, string>>;

const dict: Dict = {
  en: {
    'common.ok': 'OK',
    'common.yes': 'Yes',
    'common.welcome': 'Welcome, {{name}}!',
  },
  zh: {
    'common.ok': '确定',
    'common.yes': '是',
    'common.welcome': '欢迎，{{name}}！',
  },
};

function format(str: string, params?: Record<string, string>) {
  if (!params) return str;
  return Object.keys(params).reduce((s, k) => s.replace(new RegExp(`{{${k}}}`, 'g'), params[k]), str);
}

const getLang = (): keyof Dict => {
  const fromQuery = new URLSearchParams(location.search).get('lang');
  if (fromQuery === 'zh') return 'zh';
  return 'en';
};

// 提供 window.i18n.t 接口
// @ts-ignore
window.i18n = {
  t(key: string, params?: Record<string, string>) {
    const lang = getLang();
    const raw = dict[lang]?.[key] ?? key;
    return format(raw, params);
  }
};

function applyDeclarativeTranslations() {
  document.querySelectorAll<HTMLElement>('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key') || '';
    const paramsAttr = el.getAttribute('data-i18n-params');
    let params: Record<string, string> | undefined;
    try { params = paramsAttr ? JSON.parse(paramsAttr) : undefined; } catch {}
    el.textContent = window.i18n.t(key, params);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyDeclarativeTranslations();
});