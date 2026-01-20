import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-dialog interaction', () => {
  it('Escape closes when allowed', async () => {
    const { el } = mount('jds-dialog', { open: true })
    await waitUpdate(el)
    await userEvent.keyboard('{Escape}')
    expect(el.open).toBe(false)
  })

  it('overlay click closes when allowed', async () => {
    const { el } = mount('jds-dialog', { open: true })
    const root = await waitUpdate(el)
    const overlay = root.querySelector('.dialog-polyfill') as HTMLElement
    await userEvent.click(overlay)
    expect(el.open).toBe(false)
  })
})
