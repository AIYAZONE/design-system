let iconPath =
  "https://cdn.jsdelivr.net/npm/@trendyol/baklava-icons@latest/icons";

// let iconPath = "https://f2e-cdn.jackery.com/@jackery/icons/0.0.1/icons";

export function setIconPath(path: string) {
  iconPath = path;
}

export function getIconPath() {
  return iconPath;
}
