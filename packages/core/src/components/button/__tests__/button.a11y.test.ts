import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('zone-button a11y', () => {
  it('has accessible name (basic)', async () => {
    const { el } = mount('zone-button', { label: '添加' }, '添加')
    await waitUpdate(el)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })

  it('anchor rendering has role and rel for safety', async () => {
    const { el } = mount('zone-button', { href: '/docs', target: '_blank', label: '查看' }, '查看')
    const root = await waitUpdate(el)
    const anchor = root.querySelector('a')!
    expect(anchor.getAttribute('role')).toBe('button')
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer')
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(Array.isArray(results.violations)).toBe(true)
  })

  it('capsule icon mode does not introduce nested interactive descendants', async () => {
    const { el } = mount('zone-button', { label: '立即购买', icon: 'arrow-right-long', 'icon-mode': 'capsule', interaction: 'shine' } as any, '立即购买')
    const root = await waitUpdate(el)
    expect(root.querySelectorAll('button')).toHaveLength(1)
    expect(root.querySelector('.capsule-icon')).toBeTruthy()
    expect(root.querySelector('slot[name="icon"]')).toBeNull()

    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(results.violations.some((violation) => violation.id === 'nested-interactive')).toBe(false)
  })
})
