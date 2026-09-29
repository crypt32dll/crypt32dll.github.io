'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type Options = {
  /** Wait before scheduling idle load (lets LCP paint first). */
  delayMs?: number
  /** Cap for requestIdleCallback. */
  idleTimeoutMs?: number
}

/**
 * Mount heavy client work after first paint + idle time.
 * Skips entirely when the user prefers reduced motion.
 */
export function useDeferredMount({ delayMs = 500, idleTimeoutMs = 2000 }: Options = {}): boolean {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const mount = () => {
      if (!cancelled) setReady(true)
    }

    const scheduleIdle = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(mount, { timeout: idleTimeoutMs })
      } else {
        timeoutId = setTimeout(mount, idleTimeoutMs)
      }
    }

    timeoutId = setTimeout(scheduleIdle, delayMs)

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [reduced, delayMs, idleTimeoutMs])

  return ready
}
