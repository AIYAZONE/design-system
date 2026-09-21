import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import '../index'
import '../../popover' // Import popover definition
import { waitUpdate, mount } from '../../../../test/utils'
import { JdsTooltip } from '../index'

describe('jds-tooltip interaction', () => {
  let cleanup: () => void

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
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
    try {
      delete (window as any).matchMedia
    } catch {}
    
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
})
