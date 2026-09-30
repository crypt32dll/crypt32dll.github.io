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

/**
 * Brand gate — centered monogram, CSS exit, no GSAP on the critical path.
 */
export function IntroLoader({ locale, onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [percent, setPercent] = useState(0)
  const [leaving, setLeaving] = useState(false)
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
    if (reduced) {
      completeIntroImmediately()
      onComplete()
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
      const soft = Math.min(1, elapsed / 0.55)
      const next = Math.max(experienceState.loadProgress, soft)
      setLoadProgress(next)
      setPercent(Math.round(next * 100))

      if (elapsed > 0.7 || (experienceState.ready && next > 0.992 && elapsed > 0.35)) {
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

  if (reduced) return null

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
