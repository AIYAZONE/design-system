export const navigation = [
  ['/index.html', '首页'], ['/ai-usage.html', 'AI 使用'], ['/examples/', '页面示例'],
  ['/storybook/', '组件文档'], ['/icons/', '图标'], ['/architecture.html', '架构设计'],
];
export function activeRoute(path) {
  if (path === '/ai-usage.html') return '/ai-usage.html';
  if (path === '/ai-demo.html' || path.includes('/pages/') || path.startsWith('/examples/')) return '/examples/';
  if (path.startsWith('/storybook/')) return '/storybook/';
  if (path.startsWith('/icons/')) return '/icons/';
  if (path === '/architecture.html') return path;
  return '/index.html';
}
export function renderNavigation(path = location.pathname) {
  const active = activeRoute(path);
  return `<a class="skip-link" href="#content">跳到正文</a><header class="portal-topbar"><div class="portal-topbar__inner">
    <a class="portal-brand" href="/index.html" aria-label="AIYAZONE Design System"><span class="portal-brand__logo" aria-hidden="true"></span></a>
    <button class="portal-menu" type="button" aria-expanded="false" aria-controls="site-navigation">菜单</button>
    <nav class="portal-nav" id="site-navigation" aria-label="主导航">${navigation.map(([href, text]) => `<a href="${href}" class="portal-nav__link${active === href ? ' is-active' : ''}"${active === href ? ' aria-current="page"' : ''}>${text}</a>`).join('')}</nav>
    </div></header>`;
}
export function bindNavigation(root) {
  const button = root.querySelector('.portal-menu');
  const nav = root.querySelector('.portal-nav');
  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      button.focus();
    }
  });
}
