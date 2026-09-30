'use client'

import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
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
 * Gates unveil on experienceState.ready (set by R3F after first frames)
 * and blends in real loadProgress bumps from the canvas.
 */
export function IntroLoader({ locale, onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [percent, setPercent] = useState(0)
  const exiting = useRef(false)
  const started = useRef(performance.now())

  useEffect(() => {
    if (reduced) {
      completeIntroImmediately()
      onComplete()
      return
    }

    let raf = 0
    const tick = () => {
      if (exiting.current) return

      const elapsed = (performance.now() - started.current) / 1000
      // Soft floor so the bar never feels stuck before WebGL reports
      const softFloor = Math.min(0.72, elapsed * 0.22)

      if (!experienceState.ready) {
        setLoadProgress(Math.max(experienceState.loadProgress, softFloor))
      } else {
        setLoadProgress(
          Math.max(
            experienceState.loadProgress,
            experienceState.loadProgress + (1 - experienceState.loadProgress) * 0.14,
          ),
        )
      }

      const p = Math.round(experienceState.loadProgress * 100)
      setPercent(p)

      const minHold = elapsed > 0.55
      if (
        experienceState.ready &&
        experienceState.loadProgress > 0.992 &&
        minHold &&
        !exiting.current
      ) {
        exiting.current = true
        setIntroScale(0)
        const el = root.current
        const tl = gsap.timeline({
          onComplete: () => {
            setUnveiled(true)
            setIntroScale(1)
            onComplete()
          },
        })
        tl.to(experienceState, { introScale: 1, duration: 1.15, ease: 'power3.out' }, 0)
        if (el) {
          tl.to(
            el,
            { opacity: 0, duration: 0.75, ease: 'power2.inOut', pointerEvents: 'none' },
            0.35,
          )
        }
        return
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, onComplete])

  if (reduced) return null

  return (
    <div
      ref={root}
      className="intro-loader"
      role="status"
      aria-busy={percent < 100}
      aria-live="polite"
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
