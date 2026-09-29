'use client'

import { useContext, useEffect, useState } from 'react'
import { PreferencesContext } from '@/components/layout/PreferencesProvider'

/**
 * Reduced-motion signal: OS preference and/or explicit site override.
 * Falls back to matchMedia when used outside PreferencesProvider.
 */
export function useReducedMotion(): boolean {
  const preferences = useContext(PreferencesContext)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (preferences) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setFallback(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [preferences])

  return preferences?.reducedMotion ?? fallback
}
