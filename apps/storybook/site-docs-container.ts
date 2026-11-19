import { createElement, useEffect, useState, type ComponentProps } from "react";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { createSiteTheme } from "./site-theme";
import { getSiteTheme } from "../portal/public/shared/site-navigation.js";

/** Docs uses a separate React tree inside the preview iframe. */
export function SiteDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const [mode, setMode] = useState(getSiteTheme);
  useEffect(() => {
    const sync = () => setMode(getSiteTheme());
    window.addEventListener("site-theme-change", sync);
    return () => window.removeEventListener("site-theme-change", sync);
  }, []);
  return createElement(DocsContainer, {
    ...props,
    theme: createSiteTheme(mode),
  });
}
