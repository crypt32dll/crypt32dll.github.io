'use client'

import { type TransitionEvent, useEffect, useRef, useState } from 'react'
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
 * Short brand gate — does not wait on WebGL (deferred to interaction).
 * Exit uses CSS only so gsap stays out of the critical path.
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
      // Soft progress; unveil without R3F so Three.js can stay deferred
      const soft = Math.min(1, elapsed / 0.4)
      const next = Math.max(experienceState.loadProgress, soft)
      setLoadProgress(next)
      setPercent(Math.round(next * 100))

      if (elapsed > 0.45 || (experienceState.ready && next > 0.992 && elapsed > 0.25)) {
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
    const id = window.setTimeout(finishExit, 500)
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
      <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
        Fabian Schultz-Fademrecht
      </p>
      <p className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {locale === 'de' ? 'System wird geladen' : 'System loading'}
      </p>
      <div className="flex w-52 flex-col gap-2">
        <div className="h-px w-full overflow-hidden bg-line">
          <div
            className="h-full bg-accent transition-[width] duration-100"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="font-display text-xs tabular-nums tracking-[0.18em] text-ink-faint">
          {String(percent).padStart(3, '0')}
        </p>
      </div>
    </div>
  )
}
