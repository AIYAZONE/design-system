import { create } from "storybook/theming";
import { getSiteTheme } from "../portal/public/shared/site-navigation.js";

/** Read the shared palette so manager and docs use the site's chosen appearance. */
export function createSiteTheme(mode = getSiteTheme()) {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(name).trim();
  return create({
    base: mode,
    colorPrimary: token("--portal-accent"),
    colorSecondary: token("--portal-accent"),
    appBg: token("--portal-bg"),
    appContentBg: token("--portal-surface"),
    appPreviewBg: "#FFFFFF",
    appBorderColor: token("--portal-line"),
    textColor: token("--portal-text"),
    textInverseColor: token("--portal-on-accent"),
    textMutedColor: token("--portal-muted"),
    barBg: token("--portal-surface"),
    barTextColor: token("--portal-muted"),
    barSelectedColor: token("--portal-accent"),
    inputBg: token("--portal-raised"),
    inputBorder: token("--portal-line"),
    inputTextColor: token("--portal-text"),
    fontBase: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
    brandTitle: "AIYAZONE Design System",
    brandUrl: "/index.html",
    brandImage:
      mode === "light" ? "./shared/logo-light.svg" : "./shared/logo.svg",
    brandTarget: "_self",
  });
}
export default createSiteTheme();
