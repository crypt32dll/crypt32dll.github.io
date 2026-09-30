'use client'

import { useEffect } from 'react'
import { DeferredCanvas } from '@/components/three/DeferredCanvas'
import { completeIntroImmediately } from '@/lib/experience-state'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const loadExperience = () =>
  import('@/components/experience/ExperienceScene').then((m) => ({ default: m.ExperienceScene }))

/**
 * Fixed WebGL backdrop. Always mounts the scene; reduced motion freezes animation
 * inside the scene rather than removing the background.
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
        idleTimeoutMs={reduced ? 0 : 800}
        allowWhenReduced
        fallback={<div className="experience-fallback absolute inset-0" />}
      />
      {/* Day mode uses a stronger paper veil so dark type stays readable */}
      <div className="experience-read-scrim" />
    </div>
  )
}
