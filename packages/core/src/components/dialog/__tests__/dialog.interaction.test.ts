import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('zone-dialog interaction', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.style.overflow = ''
    document.documentElement.style.paddingRight = ''
    vi.restoreAllMocks()
  })

  it('Escape closes when allowed', async () => {
    const { el } = mount('zone-dialog', { open: true })
    await waitUpdate(el)
    await userEvent.keyboard('{Escape}')
    expect(el.open).toBe(false)
  })

  it('overlay click closes when allowed', async () => {
    const { el } = mount('zone-dialog', { open: true })
    const root = await waitUpdate(el)
    const overlay = root.querySelector('.dialog-polyfill') as HTMLElement
    await userEvent.click(overlay)
    expect(el.open).toBe(false)
  })

  it('locks page scroll without moving the page and restores focus when closed by close icon', async () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 420,
    })
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const opener = document.createElement('button')
    document.body.appendChild(opener)
    const focusSpy = vi.spyOn(opener, 'focus')
    opener.focus()

    const { el } = mount('zone-dialog', { open: true })
    const root = await waitUpdate(el)

    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.body.style.position).toBe('')
    expect(scrollToSpy).not.toHaveBeenCalled()

    const closeIcon = root.querySelector('zone-icon.close') as HTMLElement
    await userEvent.click(closeIcon)
    await waitUpdate(el)

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.documentElement.style.overflow).toBe('')

    opener.remove()
  })

  it('restores focus even when body scroll lock is disabled', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    const focusSpy = vi.spyOn(opener, 'focus')
    opener.focus()
    focusSpy.mockClear()

    const { el } = mount('zone-dialog')
    ;(el as any).disableBodyScroll = false
    ;(el as any).open = true
    const root = await waitUpdate(el)
    const closeIcon = root.querySelector('zone-icon.close') as HTMLElement

    await userEvent.click(closeIcon)
    await waitUpdate(el)

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(scrollToSpy).not.toHaveBeenCalled()
    expect(document.documentElement.style.overflow).toBe('')

    opener.remove()
  })
})
