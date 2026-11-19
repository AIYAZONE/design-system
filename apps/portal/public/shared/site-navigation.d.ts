export const navigation: string[][];
export function activeRoute(path: string): string;
export function renderNavigation(path?: string): string;
export function bindNavigation(root: HTMLElement): void;

export function getSiteTheme(): "light" | "dark";
export function setSiteTheme(theme: "light" | "dark"): void;
