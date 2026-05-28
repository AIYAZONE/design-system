import internalStylesText from '../../../../src/styles/internal.less?inline';

let sharedSheet: CSSStyleSheet | null = null;

function getSharedSheet(): CSSStyleSheet {
  if (!sharedSheet) {
    sharedSheet = new CSSStyleSheet();
    sharedSheet.replaceSync(internalStylesText);
  }
  return sharedSheet;
}

export function adoptInternalStyles(root: Element | ShadowRoot): void {
  const anyRoot = root as any;
  const adopted: CSSStyleSheet[] | undefined = anyRoot.adoptedStyleSheets;
  if (adopted) {
    const sheet = getSharedSheet();
    if (!adopted.includes(sheet)) {
      anyRoot.adoptedStyleSheets = [...adopted, sheet];
    }
    return;
  }
  const marker = root.querySelector('style[data-jds-internal]');
  if (!marker) {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-jds-internal', 'true');
    styleEl.textContent = internalStylesText;
    root.prepend(styleEl);
  }
}
