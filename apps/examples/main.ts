// 注册并加载所有核心 Web Components 与图标
import '@aiyazone/design-system';

// 保证全局设计令牌优先加载，再加载示例站样式覆盖
// 在开发环境下直接由入口导入 less，确保 Vite 编译生效
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme');
const resolvedTheme = theme === 'v2' || theme === 'v3' ? theme : 'v1';
const isProd = (import.meta as any).env?.PROD === true;
if (isProd) {
  // 动态拼接文件名，避免 Vite 在构建时尝试解析这些尚不存在的文件
  // 这些文件会由 vite.config.js 的 input 和 assetFileNames 配置生成
  // 关键：将 import.meta.url 赋值给变量，阻断 Vite 的静态分析替换
  const baseUrl = import.meta.url;
  const getThemeUrl = (filename: string) => new URL(filename, baseUrl).href;
  
  const themeMap: Record<string, string> = {
    v1: getThemeUrl('examples-theme-v1.css'),
    v2: getThemeUrl('examples-theme-v2.css'),
    v3: getThemeUrl('examples-theme-v3.css')
  };
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = themeMap[resolvedTheme] || themeMap['v1'];
  document.head.appendChild(link);
} else {
  const injectInlineStyles = async () => {
    if (resolvedTheme === 'v3') {
      await import('@styles/themes/v3/index.less');
    } else if (resolvedTheme === 'v2') {
      await import('@styles/themes/v2/index.less');
    } else {
      await import('@styles/themes/v1/index.less');
    }
  };
  injectInlineStyles();
}

import './styles/public.less';

// @ts-ignore
import { initialize, initI18nDom } from '@aiyazone/design-system';
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

const ensureSiteHeader = async () => {
  if (!document.querySelector('[data-site-header]')) {
    const slot = document.createElement('div');
    slot.setAttribute('data-site-header', '');
    slot.setAttribute('data-app', 'examples');
    document.body.insertAdjacentElement('afterbegin', slot);
  }

  try {
    await import('../portal/public/shared/site-header.css');
    await import('../portal/public/shared/site-header.js');
  } catch {}
};

const ensureSiteFooter = async () => {
  try {
    await import('../portal/public/shared/site-footer.css');
    await import('../portal/public/shared/site-footer.js');
  } catch {}
};

const mountThemeSwitcher = (currentTheme: ExamplesTheme) => {
  if (document.querySelector('.theme-switcher')) return;
  if (document.querySelector('[data-site-header]')) return;

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
    const btn = document.createElement('zone-button');
    btn.textContent = themeValue.toUpperCase();
    btn.setAttribute('size', 'small');
    btn.setAttribute('data-theme', themeValue);
    btn.setAttribute('aria-pressed', String(themeValue === currentTheme));
    btn.setAttribute('variant', themeValue === currentTheme ? 'primary' : 'secondary');

    const handler = () => switchTo(themeValue);
    btn.addEventListener('click', handler);
    btn.addEventListener('zone-click' as any, handler);

    wrapper.appendChild(btn);
  });

  const portalActions = document.querySelector<HTMLElement>('.portal-actions');
  if (portalActions) {
    portalActions.appendChild(wrapper);
    return;
  }

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

const setActivePortalNav = () => {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.portal-nav__link'));
  if (links.length === 0) return;

  const currentPath = window.location.pathname;
  const normalizedCurrent = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;

  const getActivePath = () => {
    if (normalizedCurrent.startsWith('/storybook/')) return '/storybook/';
    if (normalizedCurrent.startsWith('/examples/')) return '/examples/';
    if (normalizedCurrent.startsWith('/icons/')) return '/icons/';
    return '/';
  };

  const activePath = getActivePath();

  links.forEach((a) => {
    a.classList.remove('is-active');
    a.removeAttribute('aria-current');

    let linkPathname = '';
    try {
      const url = new URL(a.getAttribute('href') || '', window.location.href);
      linkPathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    } catch {}

    if (linkPathname === '/index.html/' || linkPathname === '/index.html') {
      linkPathname = '/';
    }

    if (linkPathname === activePath) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
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
  ensureSiteHeader().then(() => {
    if (document.querySelector('[data-site-header] .portal-topbar')) return;
    mountThemeSwitcher(currentTheme);
    patchInternalLinksWithTheme(currentTheme);
    setActivePortalNav();
  });
  ensureSiteFooter();
});
