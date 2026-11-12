const NAV_LINKS = [
  { href: '/index.html', text: '概览' },
  { href: '/storybook/', text: '文档' },
  { href: '/examples/', text: '示例' },
  { href: '/icons/', text: '图标' }
];

const THEMES = ['v1', 'v2', 'v3'];

const normalizePath = (path) => (path.endsWith('/') ? path : `${path}/`);

const getApp = (container) => {
  const app = container?.getAttribute?.('data-app') || container?.getAttribute?.('data-site') || '';
  return app === 'examples' || app === 'portal' ? app : '';
};

const isThemeEnabled = (app, pathname) => {
  if (app === 'examples') return true;
  const p = normalizePath(pathname);
  return p.startsWith('/examples/');
};

const getActivePath = (pathname) => {
  const p = normalizePath(pathname);
  if (p.startsWith('/storybook/')) return '/storybook/';
  if (p.startsWith('/examples/')) return '/examples/';
  if (p.startsWith('/icons/')) return '/icons/';
  return '/';
};

const getTheme = () => {
  const url = new URL(window.location.href);
  const theme = url.searchParams.get('theme');
  return theme === 'v2' || theme === 'v3' ? theme : 'v1';
};

const withTheme = (href, theme) => {
  const url = new URL(href, window.location.origin);
  url.searchParams.set('theme', theme);
  return `${url.pathname}${url.search}${url.hash}`;
};

const withoutTheme = (href) => {
  const url = new URL(href, window.location.origin);
  url.searchParams.delete('theme');
  return `${url.pathname}${url.search}${url.hash}`;
};

const setThemeLinkIfPresent = (theme) => {
  const link = document.getElementById('zone-theme');
  if (!(link instanceof HTMLLinkElement)) return;

  const raw = link.getAttribute('href') || '';
  if (!raw) return;

  let url;
  try {
    url = new URL(raw, window.location.origin);
  } catch {
    return;
  }

  const pathname = url.pathname;
  const dir = pathname.includes('/') ? pathname.slice(0, pathname.lastIndexOf('/') + 1) : '/';
  const filename = theme === 'v2' ? 'index-v2.css' : theme === 'v3' ? 'index-v3.css' : 'index.css';
  url.pathname = `${dir}${filename}`;
  link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
};

const shouldPatchThemeForPath = (app, pathname) => {
  if (app === 'examples') return normalizePath(pathname).startsWith('/examples/');
  return false;
};

const patchInternalLinksWithTheme = (theme, app) => {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  anchors.forEach((a) => {
    if (!(a instanceof HTMLAnchorElement)) return;
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

    let url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (!shouldPatchThemeForPath(app, url.pathname)) return;
    url.searchParams.set('theme', theme);
    a.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  });
};

const render = ({ themeEnabled, theme }) => {
  const active = getActivePath(window.location.pathname);

  const links = NAV_LINKS.map((l) => {
    const linkPath = normalizePath(new URL(l.href, window.location.origin).pathname.replace('/index.html', '/'));
    const isActive = linkPath === active;
    const isThemeRoute = linkPath === '/examples/';
    const href = themeEnabled && isThemeRoute ? withTheme(l.href, theme) : withoutTheme(l.href);
    const cls = `portal-nav__link${isActive ? ' is-active' : ''}`;
    const current = isActive ? ' aria-current="page"' : '';
    return `<a class="${cls}" href="${href}"${current}>${l.text}</a>`;
  }).join('');

  const themeBtns = themeEnabled
    ? THEMES.map((t) => {
        const isActive = t === theme;
        return `<button class="theme-switcher__btn${isActive ? ' is-active' : ''}" type="button" data-theme="${t}" aria-pressed="${isActive ? 'true' : 'false'}">${t.toUpperCase()}</button>`;
      }).join('')
    : '';

  return `
    <header class="portal-topbar">
      <div class="portal-topbar__inner">
        <a href="${withoutTheme('/index.html')}" class="portal-brand">
          <span class="portal-brand__mark">ZONE</span>
          <span class="portal-brand__text">
            <span>AIYAZONE</span>
            <span class="portal-brand__accent">Design System</span>
          </span>
        </a>
        <nav class="portal-nav" aria-label="主导航">
          ${links}
        </nav>
        ${
          themeEnabled
            ? `<div class="portal-actions">
                <div class="theme-switcher" role="group" aria-label="主题版本">
                  <span class="theme-switcher__label">Theme</span>${themeBtns}
                </div>
              </div>`
            : ''
        }
      </div>
    </header>
  `.trim();
};

const mount = () => {
  Array.from(document.querySelectorAll('.portal-topbar')).forEach((el) => el.remove());

  const container =
    document.querySelector('[data-site-header]') ||
    (() => {
      const el = document.createElement('div');
      el.setAttribute('data-site-header', '');
      document.body.insertAdjacentElement('afterbegin', el);
      return el;
    })();

  const app = getApp(container);
  const themeEnabled = isThemeEnabled(app, window.location.pathname);
  const theme = themeEnabled ? getTheme() : '';

  container.innerHTML = render({ themeEnabled, theme });

  if (themeEnabled) {
    container.querySelectorAll('[data-theme]').forEach((btn) => {
      if (!(btn instanceof HTMLButtonElement)) return;
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-theme');
        if (!next || next === theme) return;
        const url = new URL(window.location.href);
        url.searchParams.set('theme', next);
        window.location.assign(url.toString());
      });
    });

    setThemeLinkIfPresent(theme);
    patchInternalLinksWithTheme(theme, app);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
