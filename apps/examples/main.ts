import "@aiyazone/design-system";
import { mountPresentation } from "./presentation";
import { mountUsageDocs } from "./usage-docs";
import "./styles/public.less";
import "../portal/public/shared/site-header.css";
import "../portal/public/shared/page-intro.css";
import "../portal/public/shared/site-footer.css";
import "./styles/details.less";
import "../portal/public/shared/site-header.js";
import "../portal/public/shared/site-footer.js";
import { initialize, initI18nDom, ZoneI18n } from "@aiyazone/design-system";

// HTML 中的翻译组件也需要保留在生产构建内。
if (!customElements.get("zone-i18n"))
  customElements.define("zone-i18n", ZoneI18n);

const theme = new URLSearchParams(location.search).get("theme");
const current = theme === "v2" || theme === "v3" ? theme : "v1";
if (import.meta.env.PROD) {
  const base = import.meta.url;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`examples-theme-${current}.css`, base).href;
  document.head.append(link);
} else {
  if (current === "v3") void import("@styles/themes/v3/index.less");
  else if (current === "v2") void import("@styles/themes/v2/index.less");
  else void import("@styles/themes/v1/index.less");
}
initialize();
initI18nDom();

function mountExamples() {
  document.body.classList.add("examples-site");
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "content";
  const header = document.querySelector(".header, .index-header");
  if (header) {
    const title = header.querySelector("h1");
    if (title) {
      title.id ||= "example-page-title";
      header.setAttribute("role", "group");
      header.setAttribute("aria-labelledby", title.id);
    }
    const back = document.createElement("a");
    back.href = location.pathname.startsWith("/examples/") ? "/examples/" : "/";
    back.className = "examples-back";
    back.textContent = "← 返回页面与组件示例";
    if (!document.querySelector(".index-header")) header.before(back);
    const toolbar = document.createElement("div");
    toolbar.className = "theme-switcher";
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "组件主题");
    toolbar.innerHTML = `<span>组件主题</span>${["v1", "v2", "v3"].map((value) => `<button type="button" class="theme-switcher__btn${value === current ? " is-active" : ""}" aria-pressed="${value === current}" data-theme="${value}">${value.toUpperCase()}</button>`).join("")}`;
    header.after(toolbar);
    toolbar.querySelectorAll<HTMLButtonElement>("button").forEach((button) =>
      button.addEventListener("click", () => {
        const url = new URL(location.href);
        url.searchParams.set("theme", button.dataset.theme!);
        location.assign(url.href);
      }),
    );
  }
  mountUsageDocs(current);
  mountPresentation(current);
  document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    if (anchor.getAttribute("href")?.startsWith("#")) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin) return;
    if (
      url.pathname.startsWith("/examples/") ||
      url.pathname.startsWith("/pages/")
    )
      url.searchParams.set("theme", current);
    else url.searchParams.delete("theme");
    anchor.href = `${url.pathname}${url.search}${url.hash}`;
  });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", mountExamples, { once: true });
else mountExamples();
