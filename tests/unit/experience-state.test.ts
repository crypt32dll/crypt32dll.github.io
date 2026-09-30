import { describe, expect, it } from 'vitest'
import {
  CHAPTER_SCRIPT,
  chapterLocal,
  resolveQualityTier,
  sampleCamera,
} from '@/lib/experience-state'
import { morphWeightsFromWindows } from '@/lib/morph-targets'

describe('CHAPTER_SCRIPT', () => {
  it('covers hero through contact without gaps in midpoints', () => {
    expect(CHAPTER_SCRIPT.map((c) => c.id)).toEqual(['hero', 'skills', 'work', 'about', 'contact'])
    expect(CHAPTER_SCRIPT[0]?.start).toBe(0)
    expect(CHAPTER_SCRIPT.at(-1)?.end).toBe(1)
  })

  it('samples camera between chapters', () => {
    const hero = sampleCamera(0)
    const contact = sampleCamera(1)
    expect(hero.fov).toBeGreaterThan(contact.fov)
    expect(hero.position[2]).toBeGreaterThan(contact.position[2])
  })
})

describe('morphWeightsFromWindows', () => {
  it('blends between adjacent chapter midpoints', () => {
    const windows = CHAPTER_SCRIPT.map((c) => ({ start: c.start, end: c.end }))
    const mid = morphWeightsFromWindows(0.27, windows)
    expect(mid.a).toBeGreaterThanOrEqual(0)
    expect(mid.b).toBeGreaterThan(mid.a)
    expect(mid.t).toBeGreaterThanOrEqual(0)
    expect(mid.t).toBeLessThanOrEqual(1)
  })
})

describe('chapterLocal', () => {
  it('clamps outside the window', () => {
    expect(chapterLocal(0, 0.2, 0.4)).toBe(0)
    expect(chapterLocal(1, 0.2, 0.4)).toBe(1)
    expect(chapterLocal(0.3, 0.2, 0.4)).toBeCloseTo(0.5)
  })
})

describe('resolveQualityTier', () => {
  it('forces lite for reduced or saveData', () => {
    expect(resolveQualityTier({ mobile: false, saveData: true, reduced: false })).toBe('lite')
    expect(resolveQualityTier({ mobile: false, saveData: false, reduced: true })).toBe('lite')
  })

  it('defaults to lite on mobile and balanced on desktop', () => {
    expect(resolveQualityTier({ mobile: true, saveData: false, reduced: false })).toBe('lite')
    expect(resolveQualityTier({ mobile: false, saveData: false, reduced: false })).toBe('balanced')
  })
})
