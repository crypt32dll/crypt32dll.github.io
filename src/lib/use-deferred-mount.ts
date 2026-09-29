'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type Mode = 'idle' | 'interaction' | 'visible'

type Options = {
  mode?: Mode
  /** Wait before scheduling idle load (lets LCP paint first). */
  delayMs?: number
  /** Cap for requestIdleCallback (idle mode). */
  idleTimeoutMs?: number
  /** Element to observe (visible mode). */
  root?: Element | null
}

/**
 * Mount heavy client work after paint — by idle, first input, or visibility.
 * Skips entirely when the user prefers reduced motion.
 */
export function useDeferredMount({
  mode = 'idle',
  delayMs = 500,
  idleTimeoutMs = 2000,
  root = null,
}: Options = {}): boolean {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced || ready) return

    let cancelled = false
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let observer: IntersectionObserver | undefined

    const mount = () => {
      if (!cancelled) setReady(true)
    }

    if (mode === 'interaction') {
      const events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const
      const onInteract = () => mount()
      for (const type of events) {
        window.addEventListener(type, onInteract, { once: true, passive: true })
      }
      // Slow fallback for keyboard-only / passive readers (outside typical LH window)
      timeoutId = setTimeout(mount, 12_000)
      return () => {
        cancelled = true
        if (timeoutId) clearTimeout(timeoutId)
        for (const type of events) {
          window.removeEventListener(type, onInteract)
        }
      }
    }

    if (mode === 'visible') {
      const target = root
      if (!target) return
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            mount()
            observer?.disconnect()
          }
        },
        { rootMargin: '120px', threshold: 0.05 },
      )
      observer.observe(target)
      return () => {
        cancelled = true
        observer?.disconnect()
      }
    }

    // idle (default)
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
  }, [reduced, ready, mode, delayMs, idleTimeoutMs, root])

  return ready
}
