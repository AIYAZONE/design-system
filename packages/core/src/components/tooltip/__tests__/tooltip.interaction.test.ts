import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import '../index'
import '../../popover' // Import popover definition
import { waitUpdate, mount } from '../../../../test/utils'
import { JdsTooltip } from '../index'

describe('jds-tooltip interaction', () => {
  let cleanup: () => void
  const mockMatchMedia = (matches = true) => vi.fn().mockImplementation((query: string) => ({
    matches: query === '(pointer: coarse)' ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia()
    })

    // Mock touch device environment
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      configurable: true,
      value: null
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 1
    })
  })

  afterEach(() => {
    if (cleanup) cleanup()
    // cleanup mocks
    try {
      delete (window as any).ontouchstart
    } catch {}
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia(false)
    })
    
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0
    })
  })

  it('should toggle on tap (touchstart + touchend)', async () => {
    const { el: element, cleanup: c } = mount('jds-tooltip', {}, '<button slot="tooltip-trigger">Trigger</button>')
    cleanup = c
    const el = element as JdsTooltip
    await waitUpdate(el)

    const popover = el.shadowRoot!.querySelector('jds-popover') as any
    // Ensure popover has show method (it might be on prototype or added by component)
    if (!popover.show) popover.show = () => {}
    const showSpy = vi.spyOn(popover, 'show')

    const trigger = el.querySelector('button') as HTMLButtonElement

    // Simulate tap
    fireEvent.touchStart(trigger)
    fireEvent.touchEnd(trigger)

    expect(showSpy).toHaveBeenCalled()
  })

  it('should NOT toggle on scroll (touchstart + touchmove + touchend)', async () => {
    const { el: element, cleanup: c } = mount('jds-tooltip', {}, '<button slot="tooltip-trigger">Trigger</button>')
    cleanup = c
    const el = element as JdsTooltip
    await waitUpdate(el)

    const popover = el.shadowRoot!.querySelector('jds-popover') as any
    if (!popover.show) popover.show = () => {}
    const showSpy = vi.spyOn(popover, 'show')

    const trigger = el.querySelector('button') as HTMLButtonElement

    // Simulate scroll
    fireEvent.touchStart(trigger)
    fireEvent.touchMove(trigger)
    fireEvent.touchEnd(trigger)

    expect(showSpy).not.toHaveBeenCalled()
  })

  it('should configure a safer minimum arrow inset for tooltip popovers', async () => {
    const { el: element, cleanup: c } = mount('jds-tooltip', {}, '<button slot="tooltip-trigger">Trigger</button>')
    cleanup = c
    const el = element as JdsTooltip
    await waitUpdate(el)

    const popover = el.shadowRoot!.querySelector('jds-popover') as any
    expect(popover.arrowPadding).toBe(14)
  })

  it('should hide the previous tooltip when another tooltip opens on touch devices', async () => {
    const mountedA = mount('jds-tooltip', {}, '<button slot="tooltip-trigger">Trigger A</button>')
    const mountedB = mount('jds-tooltip', {}, '<button slot="tooltip-trigger">Trigger B</button>')
    cleanup = () => {
      mountedA.cleanup()
      mountedB.cleanup()
    }

    const tooltipA = mountedA.el as JdsTooltip
    const tooltipB = mountedB.el as JdsTooltip
    await waitUpdate(tooltipA)
    await waitUpdate(tooltipB)

    const popoverA = tooltipA.shadowRoot!.querySelector('jds-popover') as any
    const popoverB = tooltipB.shadowRoot!.querySelector('jds-popover') as any
    if (!popoverA.show) popoverA.show = () => {}
    if (!popoverA.hide) popoverA.hide = () => {}
    if (!popoverB.show) popoverB.show = () => {}

    const hideSpyA = vi.spyOn(popoverA, 'hide')

    tooltipA.show()
    tooltipB.show()

    expect(hideSpyA).toHaveBeenCalled()
  })

  it('should hide the tooltip when the page scrolls on touch devices', async () => {
    vi.useFakeTimers()
    const { el: element, cleanup: c } = mount('jds-tooltip', {}, '<button slot="tooltip-trigger">Trigger</button>')
    cleanup = c
    const el = element as JdsTooltip
    await waitUpdate(el)

    const popover = el.shadowRoot!.querySelector('jds-popover') as any
    if (!popover.show) popover.show = () => {}
    if (!popover.hide) popover.hide = () => {}
    const hideSpy = vi.spyOn(popover, 'hide')

    el.show()
    fireEvent.scroll(window)
    vi.runAllTimers()

    expect(hideSpy).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
