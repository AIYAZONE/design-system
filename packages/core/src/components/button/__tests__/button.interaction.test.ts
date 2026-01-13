import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-button interaction', () => {
  it('click triggers jds-click when enabled', async () => {
    const { el } = mount('jds-button', {}, '提交')
    const clicked: any = []
    el.addEventListener('jds-click', () => clicked.push(true))
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    await userEvent.click(button)
    await userEvent.click(button)
    expect(clicked.length).toBe(2)
  })

  it('disabled prevents click', async () => {
    const { el } = mount('jds-button', { disabled: true }, '提交')
    const clicked: any = []
    el.addEventListener('jds-click', () => clicked.push(true))
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(clicked.length).toBe(0)
  })

  it('type=submit submits nearest form', async () => {
    const form = document.createElement('form')
    form.id = 'f1'
    document.body.appendChild(form)
    const submitSpy = vi.fn((e: Event) => e.preventDefault())
    form.addEventListener('submit', submitSpy)
    const { el } = mount('jds-button', { type: 'submit' }, '提交')
    form.appendChild(el)
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(submitSpy).toHaveBeenCalledTimes(1)
  })
})
