import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('zone-badge a11y', () => {
  it('count-only has accessible name and no axe violations', async () => {
    const { el } = mount('zone-badge', { count: 99 })
    await waitUpdate(el)
    expect(el.shadowRoot.querySelector('.badge')?.getAttribute('aria-label')).toBe('Count：99')
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(results.violations).toEqual([])
  })

  it('outline variant has no structural violations (contrast requires a browser)', async () => {
    const { el } = mount('zone-badge', { variant: 'outline' }, '标签')
    await waitUpdate(el)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(results.violations).toEqual([])
  })
})
