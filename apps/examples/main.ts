// 注册并加载所有核心 Web Components 与图标
import '@jackery/design-system';

// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 在开发环境下直接由入口导入 less，确保 Vite 编译生效
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme');
const resolvedTheme = theme === 'v2' || theme === 'v3' ? theme : 'v1';
const isProd = (import.meta as any).env?.PROD === true;
if (isProd) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/assets/examples-theme-${resolvedTheme}.css`;
  document.head.appendChild(link);
} else {
  const injectInlineCss = async () => {
    if (resolvedTheme === 'v3') {
      await import('@styles/themes/v3/index.less');
    } else if (resolvedTheme === 'v2') {
      await import('@styles/themes/v2/index.less');
    } else {
      await import('@styles/themes/v1/index.less');
    }
  };
  injectInlineCss();
}

import './styles/public.less';

// @ts-ignore
import { initialize, initI18nDom } from '@jackery/design-system';
initialize();
initI18nDom();

type ExamplesTheme = 'v1' | 'v2' | 'v3';

const onDomReady = (fn: () => void) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
    return;
  }
  fn();
};

const mountThemeSwitcher = (currentTheme: ExamplesTheme) => {
  if (document.querySelector('.theme-switcher')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'theme-switcher';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', '主题版本');

  const label = document.createElement('span');
  label.className = 'theme-switcher__label';
  label.textContent = 'Theme';
  wrapper.appendChild(label);

  const themes: ExamplesTheme[] = ['v1', 'v2', 'v3'];

  const switchTo = (nextTheme: ExamplesTheme) => {
    if (nextTheme === currentTheme) return;
    const url = new URL(window.location.href);
    url.searchParams.set('theme', nextTheme);
    window.location.assign(url.toString());
  };

  themes.forEach((themeValue) => {
    const btn = document.createElement('jds-button');
    btn.textContent = themeValue.toUpperCase();
    btn.setAttribute('size', 'small');
    btn.setAttribute('data-theme', themeValue);
    btn.setAttribute('aria-pressed', String(themeValue === currentTheme));
    btn.setAttribute('variant', themeValue === currentTheme ? 'primary' : 'secondary');

    const handler = () => switchTo(themeValue);
    btn.addEventListener('click', handler);
    btn.addEventListener('jds-click' as any, handler);

    wrapper.appendChild(btn);
  });

  const innerHeaderContent = document.querySelector<HTMLElement>('.header .content');
  if (innerHeaderContent) {
    const subtitle = innerHeaderContent.querySelector<HTMLElement>('.subtitle');
    if (subtitle) subtitle.insertAdjacentElement('afterend', wrapper);
    else innerHeaderContent.appendChild(wrapper);
    return;
  }

  const indexHeader = document.querySelector<HTMLElement>('.index-header');
  if (indexHeader) {
    const subtitle = indexHeader.querySelector<HTMLElement>('.subtitle');
    if (subtitle) subtitle.insertAdjacentElement('afterend', wrapper);
    else indexHeader.appendChild(wrapper);
  }
};

const patchInternalLinksWithTheme = (themeValue: ExamplesTheme) => {
  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
  anchors.forEach((a) => {
    const rawHref = a.getAttribute('href');
    if (!rawHref) return;
    if (
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
      return;
    }

    let url: URL;
    try {
      url = new URL(rawHref, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    url.searchParams.set('theme', themeValue);
    a.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  });
};

onDomReady(() => {
  const currentTheme = resolvedTheme as ExamplesTheme;
  mountThemeSwitcher(currentTheme);
  patchInternalLinksWithTheme(currentTheme);
});
