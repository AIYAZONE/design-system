import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('zone-checkbox interaction', () => {
  it('click toggles and emits change payload', async () => {
    const { el } = mount('zone-checkbox', { label: '同意' })
    const payloads: any[] = []
    el.addEventListener('change', (e: any) => payloads.push(e.detail))
    const root = await waitUpdate(el)
    const input = root.querySelector('input[type=\"checkbox\"]') as HTMLInputElement
    await userEvent.click(input)
    expect(payloads.length).toBeGreaterThan(0)
    const last = payloads[payloads.length - 1]
    expect(typeof last?.checked).toBe('boolean')
  })
})
