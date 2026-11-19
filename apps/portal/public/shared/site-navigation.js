import "./site-color-mode.js";

export const getSiteTheme = () => window.__aiyazoneColorMode.getTheme();
export const setSiteTheme = (theme) =>
  window.__aiyazoneColorMode.setTheme(theme);

export const navigation = [
  ["/index.html", "首页"],
  ["/ai-usage.html", "AI 指南"],
  ["/examples/", "示例"],
  ["/storybook/", "组件"],
  ["/icons/", "图标"],
  ["/architecture.html", "架构"],
];
export function activeRoute(path) {
  if (path === "/ai-usage.html") return "/ai-usage.html";
  if (
    path === "/ai-demo.html" ||
    path.includes("/pages/") ||
    path.startsWith("/examples/")
  )
    return "/examples/";
  if (path.startsWith("/storybook/")) return "/storybook/";
  if (path.startsWith("/icons/")) return "/icons/";
  if (path === "/architecture.html" || path === "/architecture-reference.html")
    return "/architecture.html";
  return "/index.html";
}
export function renderNavigation(path = location.pathname) {
  const active = activeRoute(path);
  return `<a class="skip-link" href="#content">跳到正文</a><header class="portal-topbar"><div class="portal-topbar__inner">
    <a class="portal-brand" href="/index.html" aria-label="AIYAZONE Design System"><span class="portal-brand__logo" aria-hidden="true"></span></a>
    <nav class="portal-nav" id="site-navigation" aria-label="主导航">${navigation.map(([href, text]) => `<a href="${href}" class="portal-nav__link${active === href ? " is-active" : ""}"${active === href ? ' aria-current="page"' : ""}>${text}</a>`).join("")}</nav>
    <button class="site-theme-toggle" type="button" data-site-theme-toggle aria-label="切换到深色主题" aria-pressed="true">
      <svg class="site-theme-icon site-theme-icon--sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg class="site-theme-icon site-theme-icon--moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 14.2A9 9 0 0 1 9.8 3.2a9 9 0 1 0 11 11Z"/></svg>
      <span data-site-theme-label>浅色</span>
    </button>
    </div></header>`;
}
export function bindNavigation(root) {
  const header = root.querySelector(".portal-topbar");
  if (!header) return;
  root.classList.add("portal-header-host");
  const updateScrollState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("pageshow", updateScrollState);
  updateScrollState();
  const button = header.querySelector("[data-site-theme-toggle]");
  const updateThemeControl = () => {
    const light = getSiteTheme() === "light";
    button?.setAttribute("aria-pressed", String(light));
    button?.setAttribute(
      "aria-label",
      light ? "切换到深色主题" : "切换到浅色主题",
    );
    button?.setAttribute("title", light ? "切换到深色主题" : "切换到浅色主题");
    const label = button?.querySelector("[data-site-theme-label]");
    if (label) label.textContent = light ? "浅色" : "深色";
  };
  button?.addEventListener("click", () =>
    setSiteTheme(getSiteTheme() === "dark" ? "light" : "dark"),
  );
  window.addEventListener("site-theme-change", updateThemeControl);
  updateThemeControl();
  const observer = new ResizeObserver(() => {
    document.documentElement.style.setProperty(
      "--portal-header-height",
      `${header.getBoundingClientRect().height}px`,
    );
  });
  observer.observe(header);
  window.addEventListener(
    "pagehide",
    (event) => {
      if (event.persisted) return;
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("pageshow", updateScrollState);
      window.removeEventListener("site-theme-change", updateThemeControl);
    },
    { once: true },
  );
}
