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
import {
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
  setThemePreference: (value: ThemePreference) => void
  cycleTheme: () => void
  setMotionPreference: (value: MotionPreference) => void
  toggleReducedMotion: () => void
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
  return isMotionPreference(stored) ? stored : 'system'
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system')
  const [motionPreference, setMotionPreferenceState] = useState<MotionPreference>('system')
  const [systemDark, setSystemDark] = useState(false)
  const [systemReduce, setSystemReduce] = useState(false)
  const [ready, setReady] = useState(false)

  const syncFromSystem = useEffectEvent(() => {
    setSystemDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    setSystemReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  })

  useEffect(() => {
    setThemePreferenceState(readStoredTheme())
    setMotionPreferenceState(readStoredMotion())
    syncFromSystem()
    setReady(true)

    const colorMq = window.matchMedia('(prefers-color-scheme: dark)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onColor = () => setSystemDark(colorMq.matches)
    const onMotion = () => setSystemReduce(motionMq.matches)
    colorMq.addEventListener('change', onColor)
    motionMq.addEventListener('change', onMotion)
    return () => {
      colorMq.removeEventListener('change', onColor)
      motionMq.removeEventListener('change', onMotion)
    }
  }, [])

  const resolvedTheme = resolveTheme(themePreference, systemDark)
  const reducedMotion = resolveReducedMotion(motionPreference, systemReduce)

  useEffect(() => {
    // Wait until stored prefs + system media queries are read so we don't
    // overwrite the blocking bootstrap script with SSR defaults.
    if (!ready) return
    applyDocumentPreferences(resolvedTheme, motionPreference, systemReduce)
  }, [ready, resolvedTheme, motionPreference, systemReduce])

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
    setMotionPreferenceState((current) => {
      const next = nextMotionPreference(
        current,
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )
      localStorage.setItem(MOTION_STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      themePreference,
      resolvedTheme,
      motionPreference,
      reducedMotion,
      setThemePreference,
      cycleTheme,
      setMotionPreference,
      toggleReducedMotion,
    }),
    [
      themePreference,
      resolvedTheme,
      motionPreference,
      reducedMotion,
      setThemePreference,
      cycleTheme,
      setMotionPreference,
      toggleReducedMotion,
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
