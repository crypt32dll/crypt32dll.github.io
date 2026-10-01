'use client'

import { type TransitionEvent, useEffect, useRef, useState } from 'react'
import { SiteLogo } from '@/components/layout/SiteLogo'
import {
  completeIntroImmediately,
  experienceState,
  setIntroScale,
  setLoadProgress,
  setUnveiled,
} from '@/lib/experience-state'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type Props = {
  locale: 'de' | 'en'
  onComplete: () => void
}

/** Hold the brand gate until WebGL reports ready, without hanging forever. */
const MIN_HOLD_S = 0.45
const MAX_HOLD_S = 2.8

function shouldSkipIntro(reduced: boolean): boolean {
  if (reduced) return true
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.reduceMotion === 'true'
}

/**
 * Brand gate — centered monogram, CSS exit, no GSAP on the critical path.
 * Dismisses once the backdrop marks ready (or after MAX_HOLD_S).
 */
export function IntroLoader({ locale, onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [percent, setPercent] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const exiting = useRef(false)
  const done = useRef(false)
  const started = useRef(0)

  const finishExit = () => {
    if (done.current) return
    done.current = true
    setUnveiled(true)
    onComplete()
  }

  useEffect(() => {
    // Skip after mount so SSR HTML matches the first client paint (no hydration gap).
    if (shouldSkipIntro(reduced)) {
      completeIntroImmediately()
      onComplete()
      setDismissed(true)
      return
    }

    started.current = performance.now()
    let raf = 0

    const finish = () => {
      if (exiting.current) return
      exiting.current = true
      setPercent(100)
      setLoadProgress(1)
      setIntroScale(1)
      setLeaving(true)
    }

    const tick = () => {
      if (exiting.current) return

      const elapsed = (performance.now() - started.current) / 1000
      // Soft floor so the meter advances even before the scene reports progress.
      const soft = Math.min(0.92, elapsed / MAX_HOLD_S)
      const next = Math.max(experienceState.loadProgress, soft)
      setLoadProgress(next)
      setPercent(Math.min(99, Math.round(next * 100)))

      const ready = experienceState.ready
      if ((ready && elapsed >= MIN_HOLD_S) || elapsed >= MAX_HOLD_S) {
        finish()
        return
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, onComplete])

  useEffect(() => {
    if (!leaving) return
    const id = window.setTimeout(finishExit, 560)
    return () => window.clearTimeout(id)
  }, [leaving, onComplete])

  const onExitEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!leaving) return
    if (event.target !== root.current) return
    if (event.propertyName !== 'opacity') return
    finishExit()
  }

  if (dismissed) return null

  return (
    <div
      ref={root}
      className={`intro-loader${leaving ? ' intro-loader--leave' : ''}`}
      role="status"
      aria-busy={percent < 100}
      aria-live="polite"
      onTransitionEnd={onExitEnd}
    >
      <div className="intro-loader__aura" aria-hidden />

      <div className="intro-loader__mark-bg" aria-hidden>
        <SiteLogo size={480} className="intro-loader__mark-bg-img" />
      </div>

      <div className="intro-loader__stage">
        <div className="intro-loader__mark">
          <SiteLogo size={200} className="intro-loader__mark-img" priority />
        </div>

        <p className="intro-loader__eyebrow">Fabian Schultz-Fademrecht</p>
        <p className="intro-loader__title">
          {locale === 'de' ? 'System wird geladen' : 'System loading'}
        </p>

        <div className="intro-loader__meter" aria-hidden>
          <div className="intro-loader__meter-track">
            <div className="intro-loader__meter-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="intro-loader__meter-value">{String(percent).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  )
}
