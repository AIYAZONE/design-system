import { describe, it, expect } from 'vitest'
import '../index'
import { waitUpdate, mount } from '../../../../test/utils'

describe('jds-badge interaction', () => {
  it('renders anchor when href and is clickable', async () => {
    const { el } = mount('jds-badge', { href: '/docs' }, 'Docs')
    const root = await waitUpdate(el)
    const anchor = root.querySelector('a') as HTMLAnchorElement
    expect(anchor).toBeTruthy()
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
