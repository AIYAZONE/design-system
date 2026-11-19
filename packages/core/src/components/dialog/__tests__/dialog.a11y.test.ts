import { describe, it, expect } from 'vitest'
import axe from 'axe-core'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('zone-dialog a11y', () => {
  it('dialog has role/aria-modal (basic)', async () => {
    const { el } = mount('zone-dialog', { open: true, ariaLabelText: '确认操作' })
    await waitUpdate(el)
    const root = el.shadowRoot!
    const roleEl = root.querySelector('[role="dialog"]') as HTMLElement | null
    const hasRole = roleEl !== null || el.getAttribute('role') === 'dialog'
    expect(hasRole).toBe(true)
    const results = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } as any })
    expect(roleEl?.getAttribute('aria-modal')).toBe('true')
    expect(roleEl?.getAttribute('aria-label')).toBe('确认操作')
    expect(results.violations).toEqual([])
    expect(root.querySelector('button[part="dialog-close"]')?.getAttribute('aria-label')).toBe('Close')
  })

  it('moves focus through slotted controls and restores the shadow trigger', async () => {
    const { el: trigger } = mount('zone-button', {}, '打开')
    await waitUpdate(trigger)
    trigger.shadowRoot.querySelector('button').focus()
    const { el } = mount('zone-dialog', { ariaLabelText: '编辑', initialFocus: '#first' },
      '<input id="first"><zone-button id="last">保存</zone-button>')
    await waitUpdate(el)
    await waitUpdate(el.querySelector('zone-button'))
    el.open = true
    await waitUpdate(el)
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(document.activeElement).toBe(el.querySelector('#first'))
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab', bubbles: true }))
    expect(el.querySelector('#last').shadowRoot.activeElement).toBe(el.querySelector('#last').shadowRoot.querySelector('button'))
    el.open = false
    await waitUpdate(el)
    expect(trigger.shadowRoot.activeElement).toBe(trigger.shadowRoot.querySelector('button'))
  })
})
