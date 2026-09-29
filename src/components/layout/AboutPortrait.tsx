'use client'

import { useCallback, useState } from 'react'
import { DeferredCanvas } from '@/components/three/DeferredCanvas'

const loadAboutPortrait = () =>
  import('@/components/three/AboutPortraitScene').then((m) => ({
    default: m.AboutPortraitScene,
  }))

export function AboutPortrait() {
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const ref = useCallback((node: HTMLDivElement | null) => {
    setHost(node)
  }, [])

  return (
    <div ref={ref}>
      <DeferredCanvas
        load={loadAboutPortrait}
        mode="visible"
        root={host}
        fallback={
          <div
            className="aspect-square w-full max-w-md bg-line/40 lg:max-w-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 65%)',
            }}
            aria-hidden
          />
        }
      />
    </div>
  )
}
