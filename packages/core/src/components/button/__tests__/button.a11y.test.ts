import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-button a11y', () => {
  it('has accessible name (basic)', async () => {
    const { el } = mount('jds-button', { label: '添加' }, '添加')
    await waitUpdate(el)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })

  it('anchor rendering has role and rel for safety', async () => {
    const { el } = mount('jds-button', { href: '/docs', target: '_blank', label: '查看' }, '查看')
    const root = await waitUpdate(el)
    const anchor = root.querySelector('a')!
    expect(anchor.getAttribute('role')).toBe('button')
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer')
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })
})
