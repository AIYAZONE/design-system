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

describe('zone-checkbox partial selection', () => {
  it('exposes mixed state to the native control and clears it on user selection', async () => {
    const { el } = mount('zone-checkbox', { label: '选择全部', indeterminate: true })
    const root = await waitUpdate(el)
    const input = root.querySelector('input') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
    await userEvent.click(input)
    await waitUpdate(el)
    expect(el.indeterminate).toBe(false)
    expect(input.indeterminate).toBe(false)
    expect(el.checked).toBe(true)
  })
  it('keeps disabled mixed controls unchanged and clears mixed state on reset', async () => {
    const { el } = mount('zone-checkbox', { label: '选择全部', indeterminate: true, disabled: true })
    const root = await waitUpdate(el)
    await userEvent.click(root.querySelector('input')!)
    expect(el.indeterminate).toBe(true)
    expect(el.checked).toBe(false)
    el.formResetCallback()
    await waitUpdate(el)
    expect(el.indeterminate).toBe(false)
  })
})
