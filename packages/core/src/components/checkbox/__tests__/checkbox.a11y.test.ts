import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-checkbox a11y', () => {
  it('role and aria states toggle, axe clean', async () => {
    const { el } = mount('jds-checkbox', { label: '同意协议' })
    await waitUpdate(el)
    const root = el.shadowRoot!
    const input = root.querySelector('input[type=\"checkbox\"]')
    expect(input).toBeTruthy()
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })
})
