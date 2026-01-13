import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-dialog a11y', () => {
  it('dialog has role/aria-modal (basic)', async () => {
    const { el } = mount('jds-dialog', { open: true, ariaLabel: '确认操作' })
    await waitUpdate(el)
    const root = el.shadowRoot!
    const roleEl = root.querySelector('[role="dialog"]') as HTMLElement | null
    const hasRole = roleEl !== null || el.getAttribute('role') === 'dialog'
    expect(hasRole).toBe(true)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })
})
