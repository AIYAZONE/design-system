import { addons } from "@storybook/manager-api";
import jackeryDesignSystem from "./jackery-d";

addons.setConfig({
  theme: jackeryDesignSystem,
});

const NAV_LINKS = [
  { href: '/index.html', text: '概览' },
  { href: '/storybook/', text: '文档' },
  { href: '/examples/', text: '示例' },
  { href: '/icons/', text: '图标' },
  { href: '/jbc/', text: '业务组件' }
];

const normalizePath = (path: string) => (path.endsWith('/') ? path : `${path}/`);

const getActivePath = (pathname: string) => {
  const p = normalizePath(pathname);
  if (p.startsWith('/storybook/')) return '/storybook/';
  if (p.startsWith('/examples/')) return '/examples/';
  if (p.startsWith('/icons/')) return '/icons/';
  if (p.startsWith('/jbc/')) return '/jbc/';
  return '/';
};

const renderHeader = () => {
  const active = getActivePath(window.location.pathname);
  const links = NAV_LINKS.map((l) => {
    const linkPath = normalizePath(new URL(l.href, window.location.origin).pathname.replace('/index.html', '/'));
    const isActive = linkPath === active;
    const cls = `portal-nav__link${isActive ? ' is-active' : ''}`;
    const current = isActive ? ' aria-current="page"' : '';
    return `<a class="${cls}" href="${l.href}"${current}>${l.text}</a>`;
  }).join('');

  return `
    <div class="portal-topbar__inner">
      <a href="/index.html" class="portal-brand">
        <span class="portal-brand__mark">JDS</span>
        <span class="portal-brand__text">
          <span>Jackery</span>
          <span class="portal-brand__accent">Design System</span>
        </span>
      </a>
      <nav class="portal-nav" aria-label="主导航">
        ${links}
      </nav>
    </div>
  `.trim();
};

const HEADER_STYLES = `
  :root {
    --site-header-bg: rgba(255, 255, 255, 0.82);
    --site-header-border: rgba(0, 0, 0, 0.08);
    --site-header-ink: #111827;
    --site-header-muted: #4b5563;
    --site-header-brand: #ff5000;
    --portal-header-height: 60px;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  #root {
    margin-top: var(--portal-header-height) !important;
    height: calc(100vh - var(--portal-header-height)) !important;
  }

  .css-1nolumm {
    height: 100% !important;
  }

  .portal-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    width: 100%;
    height: var(--portal-header-height);
    background: var(--site-header-bg);
    border-bottom: 1px solid var(--site-header-border);
    backdrop-filter: blur(12px);
    box-sizing: border-box;
  }

  .portal-topbar__inner {
    display: flex;
    align-items: center;
    gap: 24px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 12px 24px;
    height: 100%;
    box-sizing: border-box;
  }

  .portal-brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--site-header-ink);
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    white-space: nowrap;
    font-size: 1.25rem;
  }

  .portal-brand__mark {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    border-radius: 0.5rem;
    background: var(--site-header-brand);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0;
  }

  .portal-brand__text {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
  }

  .portal-brand__accent {
    color: var(--site-header-brand);
  }

  .portal-nav {
    display: flex;
    align-items: center;
    gap: 24px;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 2px;
    margin-left: auto;
  }

  .portal-nav::-webkit-scrollbar {
    display: none;
  }

  .portal-nav__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--site-header-muted);
    padding: 8px 0;
    transition: color 0.2s ease;
    white-space: nowrap;
  }

  .portal-nav__link:hover {
    color: var(--site-header-brand);
  }

  .portal-nav__link.is-active {
    color: var(--site-header-brand);
  }

  .portal-nav__link.is-active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: rgba(255, 80, 0, 0.85);
    border-radius: 2px;
  }
`;

const injectStyles = () => {
  if (document.querySelector('style[data-portal-header]')) return;

  const style = document.createElement('style');
  style.setAttribute('data-portal-header', 'true');
  style.textContent = HEADER_STYLES;
  
  const head = document.head || document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(style);
  }
};

const injectHeader = () => {
  if (document.querySelector('.portal-topbar')) return;

  const header = document.createElement('header');
  header.className = 'portal-topbar';
  header.innerHTML = renderHeader();
  document.body.insertAdjacentElement('afterbegin', header);
};

const mount = () => {
  injectStyles();
  injectHeader();
};

(function init() {
  if (document.head && document.body) {
    mount();
    return;
  }

  let observer: MutationObserver | null = null;
  
  const check = () => {
    if (document.head && document.body) {
      if (observer) {
        observer.disconnect();
      }
      mount();
    }
  };

  observer = new MutationObserver(check);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  
  check();
})();
