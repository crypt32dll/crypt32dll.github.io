import { describe, expect, it } from 'vitest'
import { orientationToPointer } from '@/lib/device-orientation'
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

  it('follows system when preference is system on fine pointers', () => {
    expect(resolveReducedMotion('system', true)).toBe(true)
    expect(resolveReducedMotion('system', false)).toBe(false)
  })

  it('defaults to reduced on coarse pointers unless full is set', () => {
    expect(resolveReducedMotion('system', false, true)).toBe(true)
    expect(resolveReducedMotion('full', false, true)).toBe(false)
    expect(resolveReducedMotion('reduce', false, true)).toBe(true)
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

  it('returns to full when leaving reduced (including mobile system)', () => {
    expect(nextMotionPreference('reduce', false)).toBe('full')
    expect(nextMotionPreference('system', true)).toBe('full')
    expect(nextMotionPreference('system', false, true)).toBe('full')
  })
})

describe('orientationToPointer', () => {
  it('maps gamma / beta into a clamped pointer', () => {
    const centered = orientationToPointer(55, 0)
    expect(centered?.x).toBe(0)
    expect(centered?.y).toBe(0)
    expect(orientationToPointer(55, 32)?.x).toBe(1)
    expect(orientationToPointer(null, 10)).toBeNull()
  })
})
