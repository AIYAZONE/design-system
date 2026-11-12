import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, waitUpdate } from '../../../../test/utils'

const {
  offsetSpy,
  flipSpy,
  shiftSpy,
  arrowSpy,
  computePositionSpy,
  autoUpdateSpy,
} = vi.hoisted(() => ({
  offsetSpy: vi.fn((value: number) => ({ name: 'offset', options: value })),
  flipSpy: vi.fn((options?: Record<string, unknown>) => ({ name: 'flip', options })),
  shiftSpy: vi.fn((options?: Record<string, unknown>) => ({ name: 'shift', options })),
  arrowSpy: vi.fn((options?: Record<string, unknown>) => ({ name: 'arrow', options })),
  computePositionSpy: vi.fn(),
  autoUpdateSpy: vi.fn((_: Element, __: Element, update: () => void) => {
    update()
    return () => {}
  }),
}))

vi.mock('@floating-ui/dom', async () => {
  const actual = await vi.importActual<typeof import('@floating-ui/dom')>('@floating-ui/dom')
  return {
    ...actual,
    autoUpdate: autoUpdateSpy,
    computePosition: computePositionSpy,
    offset: offsetSpy,
    flip: flipSpy,
    shift: shiftSpy,
    arrow: arrowSpy,
  }
})

import '../index'

describe('zone-popover interaction', () => {
  let cleanup: (() => void) | undefined
  let target: HTMLButtonElement

  beforeEach(() => {
    vi.clearAllMocks()
    computePositionSpy.mockResolvedValue({
      x: 12,
      y: 24,
      placement: 'top',
      middlewareData: {
        arrow: {
          x: 16,
          y: 0,
        },
      },
    })

    target = document.createElement('button')
    target.id = 'popover-target'
    document.body.appendChild(target)
  })

  afterEach(() => {
    cleanup?.()
    target.remove()
  })

  it('keeps top popovers shiftable on the cross axis for narrow viewports', async () => {
    const mounted = mount('zone-popover', { target: 'popover-target', placement: 'top' }, 'Tooltip content')
    cleanup = mounted.cleanup

    const el = mounted.el as any
    await waitUpdate(el)

    el.show()
    await waitUpdate(el)
    await Promise.resolve()

    expect(shiftSpy).toHaveBeenCalledWith(expect.objectContaining({
      crossAxis: true,
      padding: 8,
    }))
    expect(flipSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 8 }))
  })

  it('keeps tooltip arrows inset after viewport shifting', async () => {
    const mounted = mount('zone-popover', { target: 'popover-target', placement: 'top' }, 'Tooltip content')
    cleanup = mounted.cleanup

    const el = mounted.el as any
    await waitUpdate(el)

    el.show()
    await waitUpdate(el)
    await Promise.resolve()

    expect(arrowSpy).toHaveBeenCalledWith(expect.objectContaining({
      element: expect.any(HTMLElement),
      padding: 8,
    }))
  })
})
