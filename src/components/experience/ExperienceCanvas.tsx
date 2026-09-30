'use client'

import { useEffect } from 'react'
import { DeferredCanvas } from '@/components/three/DeferredCanvas'
import { completeIntroImmediately } from '@/lib/experience-state'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const loadExperience = () =>
  import('@/components/experience/ExperienceScene').then((m) => ({ default: m.ExperienceScene }))

/**
 * Fixed WebGL backdrop. Boots on idle during the intro (covered by IntroLoader)
 * so the first painted frame already has the scene when the gate lifts.
 */
export function ExperienceCanvas() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) completeIntroImmediately()
  }, [reduced])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" data-experience-stage>
      <div className="experience-atmosphere absolute inset-0" />
      <DeferredCanvas
        load={loadExperience}
        mode="idle"
        delayMs={0}
        idleTimeoutMs={reduced ? 0 : 120}
        allowWhenReduced
        fallback={<div className="experience-fallback absolute inset-0" />}
      />
      <div className="experience-read-scrim" />
    </div>
  )
}
