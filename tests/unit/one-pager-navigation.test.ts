import { describe, expect, it } from 'vitest'
import { chapterLocal } from '@/lib/experience-state'
import {
  headerNavItems,
  homeHashHref,
  progressSections,
  SECTION_IDS,
} from '@/lib/one-pager-navigation'

describe('chapterLocal', () => {
  it('clamps outside the window', () => {
    expect(chapterLocal(0, 0.2, 0.4)).toBe(0)
    expect(chapterLocal(1, 0.2, 0.4)).toBe(1)
  })

  it('interpolates inside the window', () => {
    expect(chapterLocal(0.3, 0.2, 0.4)).toBeCloseTo(0.5)
  })
})

describe('one-pager navigation', () => {
  it('keeps contact out of the header', () => {
    expect(headerNavItems.map((s) => s.id)).toEqual(['skills', 'work', 'about'])
    expect(progressSections.map((s) => s.id)).toEqual(SECTION_IDS)
  })

  it('builds locale hash hrefs', () => {
    expect(homeHashHref('de', 'work')).toBe('/de/#work')
  })
})
