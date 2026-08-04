import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import '../index'
import '../../popover' // Import popover definition
import { waitUpdate, mount } from '../../../../test/utils'
import { JdsTooltip } from '../index'

describe('jds-tooltip interaction', () => {
  let cleanup: () => void

  beforeEach(() => {
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

  it('should still show on mouseenter when touch points are available', async () => {
    const { el: element, cleanup: c } = mount(
      'div',
      {},
      '<button id="tooltip-target">Trigger</button><jds-tooltip target="tooltip-target">Tooltip content</jds-tooltip>'
    )
    cleanup = c
    const el = element.querySelector('jds-tooltip') as JdsTooltip
    await waitUpdate(el)

    const popover = el.shadowRoot!.querySelector('jds-popover') as any
    if (!popover.show) popover.show = () => {}
    const showSpy = vi.spyOn(popover, 'show')

    const trigger = element.querySelector('#tooltip-target') as HTMLButtonElement

    fireEvent.mouseEnter(trigger)

    expect(showSpy).toHaveBeenCalled()
  })
})
