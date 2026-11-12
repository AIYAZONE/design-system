export async function waitUpdate(el: any) {
  if (el?.updateComplete) await el.updateComplete
  return el?.shadowRoot as ShadowRoot
}

export function mount(tag: string, props?: Record<string, any>, children?: string) {
  const el = document.createElement(tag) as any
  if (props) {
    Object.entries(props).forEach(([k, v]) => {
      if (typeof v === 'boolean') {
        v ? el.setAttribute(k, '') : el.removeAttribute(k)
      } else {
        el.setAttribute(k, String(v))
      }
    })
  }
  if (children) el.innerHTML = children
  document.body.appendChild(el)
  const cleanup = () => {
    try {
      document.body.removeChild(el)
    } catch {}
  }
  return { el, cleanup }
}
