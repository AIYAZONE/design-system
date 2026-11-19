/** Shared early initializer; also imported by bundled navigation and Storybook. */
(() => {
  if (window.__aiyazoneColorMode) return;
  const key = "aiyazone-site-theme";
  const valid = (value) => value === "light" || value === "dark";
  const read = () => {
    try {
      const saved = localStorage.getItem(key);
      return valid(saved) ? saved : "light";
    } catch {
      return "light";
    }
  };
  const getTheme = () =>
    document.documentElement.dataset.siteTheme === "dark" ? "dark" : "light";
  const apply = (theme, persist = false) => {
    if (!valid(theme)) return;
    const changed = document.documentElement.dataset.siteTheme !== theme;
    document.documentElement.dataset.siteTheme = theme;
    if (persist) {
      try {
        localStorage.setItem(key, theme);
      } catch {
        /* Switching remains available when storage is blocked. */
      }
    }
    if (!changed) return;
    window.dispatchEvent(
      new CustomEvent("site-theme-change", { detail: { theme } }),
    );
    for (let index = 0; index < window.frames.length; index++) {
      window.frames[index].postMessage(
        { source: "aiyazone-site-theme", theme },
        location.origin,
      );
    }
  };
  window.__aiyazoneColorMode = {
    getTheme,
    setTheme: (theme) => apply(theme, true),
  };
  apply(read());
  window.addEventListener("pageshow", () => apply(read()));
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) apply(read());
  });
  window.addEventListener("message", (event) => {
    if (
      event.origin === location.origin &&
      event.source === window.parent &&
      event.data?.source === "aiyazone-site-theme"
    )
      apply(event.data.theme);
  });
})();
