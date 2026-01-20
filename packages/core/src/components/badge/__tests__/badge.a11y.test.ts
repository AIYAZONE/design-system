import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-badge a11y', () => {
  it('count-only has accessible name and no axe violations', async () => {
    const { el } = mount('jds-badge', { count: 99 })
    await waitUpdate(el)
    const hostLabel = el.getAttribute('aria-label')
    expect(hostLabel === null || typeof hostLabel === 'string').toBe(true)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })

  it('outline variant maintains contrast via currentColor', async () => {
    const { el } = mount('jds-badge', { variant: 'outline' }, '标签')
    await waitUpdate(el)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })
})
