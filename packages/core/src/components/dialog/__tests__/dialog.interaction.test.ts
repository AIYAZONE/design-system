import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-dialog interaction', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    vi.restoreAllMocks()
  })

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

  it('restores scroll position and focus without scrolling when closed by close icon', async () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 420,
    })
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const opener = document.createElement('button')
    document.body.appendChild(opener)
    const focusSpy = vi.spyOn(opener, 'focus')
    opener.focus()

    const { el } = mount('jds-dialog', { open: true })
    const root = await waitUpdate(el)

    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-420px')

    const closeIcon = root.querySelector('jds-icon.close') as HTMLElement
    await userEvent.click(closeIcon)
    await waitUpdate(el)

    expect(scrollToSpy).toHaveBeenCalledWith(0, 420)
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.body.style.position).toBe('')
    expect(document.body.style.top).toBe('')

    opener.remove()
  })

  it('restores focus even when body scroll lock is disabled', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    const focusSpy = vi.spyOn(opener, 'focus')
    opener.focus()
    focusSpy.mockClear()

    const { el } = mount('jds-dialog')
    ;(el as any).disableBodyScroll = false
    ;(el as any).open = true
    const root = await waitUpdate(el)
    const closeIcon = root.querySelector('jds-icon.close') as HTMLElement

    await userEvent.click(closeIcon)
    await waitUpdate(el)

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(scrollToSpy).not.toHaveBeenCalled()
    expect(document.body.style.position).toBe('')

    opener.remove()
  })
})
