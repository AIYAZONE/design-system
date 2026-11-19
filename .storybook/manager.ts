import { addons } from "storybook/manager-api";
import "./manager.css";
import zoneDesignSystem, { createSiteTheme } from "./zone-d";
import {
  renderNavigation,
  bindNavigation,
} from "../apps/portal/public/shared/site-navigation.js";

addons.setConfig({ theme: zoneDesignSystem });
window.addEventListener("site-theme-change", () =>
  addons.setConfig({ theme: createSiteTheme() }),
);
const entryParams = new URLSearchParams(location.search);
if (!entryParams.has("path") && !entryParams.has("id")) {
  const entryUrl = new URL(location.href);
  entryUrl.searchParams.set("path", "/docs/介绍--document");
  location.replace(entryUrl.href);
}
function mount() {
  if (document.querySelector(".portal-topbar")) return;
  const slot = document.createElement("div");
  slot.innerHTML = renderNavigation("/storybook/");
  document.body.prepend(slot);
  bindNavigation(slot);
  const style = document.createElement("style");
  style.textContent = `
    body { margin:0; }
    #root { position:relative; top:var(--portal-header-height); height:calc(100dvh - var(--portal-header-height)); }
    #root > div { height:100%; min-height:0; }
    .portal-topbar { position:fixed; inset:0 0 auto; }
    .sidebar-item[data-selected="true"] a, .sidebar-item[data-selected="true"] svg { color:var(--portal-on-accent); }
    @media(max-width:900px) {
      #root > div > div:has(> .sb-bar > button[aria-label="Open navigation menu"]) { height:49px; flex-basis:49px; }
      .sb-bar:has(> button[aria-label="Open navigation menu"]) { height:48px; }
    }`;
  document.head.append(style);
  slot.querySelector(".skip-link")?.setAttribute("href", "#root");
  document.getElementById("root")?.setAttribute("tabindex", "-1");
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", mount, { once: true });
else mount();
