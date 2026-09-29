import { describe, expect, it } from 'vitest'
import {
  nextMotionPreference,
  nextTheme,
  resolveReducedMotion,
  resolveTheme,
} from '@/lib/preferences'

describe('resolveTheme', () => {
  it('honors explicit light and dark', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('follows system when preference is system', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
})

describe('resolveReducedMotion', () => {
  it('forces reduce or full', () => {
    expect(resolveReducedMotion('reduce', false)).toBe(true)
    expect(resolveReducedMotion('full', true)).toBe(false)
  })

  it('follows system when preference is system', () => {
    expect(resolveReducedMotion('system', true)).toBe(true)
    expect(resolveReducedMotion('system', false)).toBe(false)
  })
})

describe('nextTheme', () => {
  it('cycles system → light → dark → system', () => {
    expect(nextTheme('system')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('system')
  })
})

describe('nextMotionPreference', () => {
  it('enables reduce when motion is currently allowed', () => {
    expect(nextMotionPreference('system', false)).toBe('reduce')
    expect(nextMotionPreference('full', true)).toBe('reduce')
  })

  it('returns to system when OS does not reduce', () => {
    expect(nextMotionPreference('reduce', false)).toBe('system')
  })

  it('overrides OS reduce with full', () => {
    expect(nextMotionPreference('system', true)).toBe('full')
    expect(nextMotionPreference('reduce', true)).toBe('full')
  })
})
