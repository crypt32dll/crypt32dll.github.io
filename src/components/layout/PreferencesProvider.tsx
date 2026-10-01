'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from 'react'
import { setAmbientMutedFlag, startAmbient, stopAmbient } from '@/lib/ambient-audio'
import { isCoarsePointer, requestDeviceOrientationPermission } from '@/lib/device-orientation'
import { setAudioMuted, setReducedMotion, setThemeTokens } from '@/lib/experience-state'
import {
  AUDIO_STORAGE_KEY,
  applyDocumentPreferences,
  isMotionPreference,
  isThemePreference,
  MOTION_STORAGE_KEY,
  type MotionPreference,
  nextMotionPreference,
  nextTheme,
  resolveReducedMotion,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '@/lib/preferences'

type PreferencesContextValue = {
  themePreference: ThemePreference
  resolvedTheme: 'light' | 'dark'
  motionPreference: MotionPreference
  reducedMotion: boolean
  audioMuted: boolean
  setThemePreference: (value: ThemePreference) => void
  cycleTheme: () => void
  setMotionPreference: (value: MotionPreference) => void
  toggleReducedMotion: () => void
  toggleAudioMuted: () => void
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null)

function readStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return isThemePreference(stored) ? stored : 'system'
}

function readStoredMotion(): MotionPreference {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(MOTION_STORAGE_KEY)
  if (isMotionPreference(stored)) return stored
  // Touch devices start with reduced motion; user can opt into full animation.
  return isCoarsePointer() ? 'reduce' : 'system'
}

function readDomReducedMotion(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.reduceMotion === 'true'
}

function readStoredAudioMuted(): boolean {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem(AUDIO_STORAGE_KEY)
  if (stored === null) return true
  return stored === 'true'
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('dark')
  const [motionPreference, setMotionPreferenceState] = useState<MotionPreference>('system')
  const [audioMuted, setAudioMutedState] = useState(true)
  const [systemDark, setSystemDark] = useState(false)
  const [systemReduce, setSystemReduce] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)
  const [ready, setReady] = useState(false)

  const syncFromSystem = useEffectEvent(() => {
    setSystemDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    setSystemReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setCoarsePointer(isCoarsePointer())
  })

  useEffect(() => {
    setThemePreferenceState(readStoredTheme())
    setMotionPreferenceState(readStoredMotion())
    setAudioMutedState(readStoredAudioMuted())
    try {
      localStorage.removeItem('pref-quality')
    } catch {
      // ignore
    }
    syncFromSystem()
    setReady(true)

    const colorMq = window.matchMedia('(prefers-color-scheme: dark)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseMq = window.matchMedia('(pointer: coarse)')
    const onColor = () => setSystemDark(colorMq.matches)
    const onMotion = () => setSystemReduce(motionMq.matches)
    const onCoarse = () => setCoarsePointer(isCoarsePointer())
    colorMq.addEventListener('change', onColor)
    motionMq.addEventListener('change', onMotion)
    coarseMq.addEventListener('change', onCoarse)
    return () => {
      colorMq.removeEventListener('change', onColor)
      motionMq.removeEventListener('change', onMotion)
      coarseMq.removeEventListener('change', onCoarse)
    }
  }, [])

  const resolvedTheme = resolveTheme(themePreference, systemDark)
  const reducedMotion = ready
    ? resolveReducedMotion(motionPreference, systemReduce, coarsePointer)
    : readDomReducedMotion()

  useEffect(() => {
    if (!ready) return
    applyDocumentPreferences(resolvedTheme, motionPreference, systemReduce, coarsePointer)
    setReducedMotion(reducedMotion)
    setAudioMuted(audioMuted)
    const styles = getComputedStyle(document.documentElement)
    setThemeTokens({
      ink: styles.getPropertyValue('--color-ink').trim() || '#f2f0eb',
      accent: styles.getPropertyValue('--color-accent').trim() || '#d4b08a',
      paper: styles.getPropertyValue('--color-paper').trim() || '#08090c',
      dark: resolvedTheme === 'dark',
    })
  }, [
    ready,
    resolvedTheme,
    motionPreference,
    systemReduce,
    coarsePointer,
    reducedMotion,
    audioMuted,
  ])

  const setThemePreference = useCallback((value: ThemePreference) => {
    setThemePreferenceState(value)
    localStorage.setItem(THEME_STORAGE_KEY, value)
  }, [])

  const cycleTheme = useCallback(() => {
    setThemePreferenceState((current) => {
      const next = nextTheme(current)
      localStorage.setItem(THEME_STORAGE_KEY, next)
      return next
    })
  }, [])

  const setMotionPreference = useCallback((value: MotionPreference) => {
    setMotionPreferenceState(value)
    localStorage.setItem(MOTION_STORAGE_KEY, value)
  }, [])

  const toggleReducedMotion = useCallback(() => {
    const coarse = isCoarsePointer()
    const currentlyReduced = resolveReducedMotion(
      motionPreference,
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      coarse,
    )

    const applyNext = () => {
      setMotionPreferenceState((current) => {
        const next = nextMotionPreference(
          current,
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          coarse,
        )
        localStorage.setItem(MOTION_STORAGE_KEY, next)
        return next
      })
    }

    // Enabling animation on mobile: request gyro access from this tap gesture (iOS).
    if (currentlyReduced && coarse) {
      void requestDeviceOrientationPermission().finally(applyNext)
      return
    }
    applyNext()
  }, [motionPreference])

  const toggleAudioMuted = useCallback(() => {
    setAudioMutedState((current) => {
      const next = !current
      localStorage.setItem(AUDIO_STORAGE_KEY, String(next))
      setAudioMuted(next)
      setAmbientMutedFlag(next)
      if (next) void stopAmbient()
      else void startAmbient()
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      themePreference,
      resolvedTheme,
      motionPreference,
      reducedMotion,
      audioMuted,
      setThemePreference,
      cycleTheme,
      setMotionPreference,
      toggleReducedMotion,
      toggleAudioMuted,
    }),
    [
      themePreference,
      resolvedTheme,
      motionPreference,
      reducedMotion,
      audioMuted,
      setThemePreference,
      cycleTheme,
      setMotionPreference,
      toggleReducedMotion,
      toggleAudioMuted,
    ],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return context
}
