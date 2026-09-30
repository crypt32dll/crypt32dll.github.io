'use client'

import { useCallback, useState } from 'react'
import {
  ProjectSceneCanvas,
  type ProjectSceneId,
} from '@/components/experience/projects/ProjectSceneCanvas'
import { ViewportActivity } from '@/components/experience/ViewportActivity'
import { DeferredCanvas } from '@/components/three/DeferredCanvas'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const loadProjectScene = () =>
  import('@/components/experience/projects/ProjectSceneCanvas').then((m) => ({
    default: m.ProjectSceneCanvas,
  }))

type Props = {
  sceneId: ProjectSceneId
  className?: string
}

export function ProjectExperience({ sceneId, className }: Props) {
  const reduced = useReducedMotion()
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const ref = useCallback((node: HTMLDivElement | null) => {
    setHost(node)
  }, [])

  if (reduced) {
    return (
      <div
        className={className}
        style={{
          background:
            'radial-gradient(circle at 40% 40%, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 60%)',
        }}
        aria-hidden
      />
    )
  }

  return (
    <ViewportActivity name={`project-scene-${sceneId}`} className={className}>
      <div ref={ref} className="absolute inset-0">
        <DeferredCanvas
          load={loadProjectScene}
          mode="visible"
          root={host}
          props={{ sceneId, className: 'absolute inset-0 h-full w-full' }}
          fallback={
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 40% 40%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 60%)',
              }}
            />
          }
        />
      </div>
    </ViewportActivity>
  )
}

export type { ProjectSceneId }
export { ProjectSceneCanvas }
