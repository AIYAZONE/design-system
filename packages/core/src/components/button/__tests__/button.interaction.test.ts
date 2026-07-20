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

  it('keeps secondary interactive when shine interaction is set', async () => {
    const { el } = mount('jds-button', { variant: 'secondary', interaction: 'shine' }, '提交')
    const clicked: any = []
    el.addEventListener('jds-click', () => clicked.push(true))
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(clicked.length).toBe(1)
  })

  it('keeps text variant interactive when shine interaction is set', async () => {
    const { el } = mount('jds-button', { variant: 'text', interaction: 'shine' }, '查看详情')
    const clicked: any = []
    el.addEventListener('jds-click', () => clicked.push(true))
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(clicked.length).toBe(1)
  })

  it('keeps capsule icon mode interactive when combined with shine', async () => {
    const { el } = mount('jds-button', { interaction: 'shine', icon: 'arrow-right-long', 'icon-mode': 'capsule' } as any, '立即购买')
    const clicked: any = []
    el.addEventListener('jds-click', () => clicked.push(true))
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(clicked.length).toBe(1)
  })

  it('falls back safely for secondary variant when capsule mode is set', async () => {
    const { el } = mount('jds-button', { variant: 'secondary', icon: 'arrow-right-long', 'icon-mode': 'capsule' } as any, '查看详情')
    const clicked: any = []
    el.addEventListener('jds-click', () => clicked.push(true))
    const root = await waitUpdate(el)
    const button = root.querySelector('button') as HTMLButtonElement
    expect(button.querySelector('.capsule-icon')).toBeNull()
    await userEvent.click(button)
    expect(clicked.length).toBe(1)
  })
})
