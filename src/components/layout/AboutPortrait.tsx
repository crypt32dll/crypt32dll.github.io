'use client'

import { useCallback, useState } from 'react'
import { ViewportActivity } from '@/components/experience/ViewportActivity'
import { DeferredCanvas } from '@/components/three/DeferredCanvas'
import { cn } from '@/lib/utils'

const loadAboutPortrait = () =>
  import('@/components/three/AboutPortraitScene').then((m) => ({
    default: m.AboutPortraitScene,
  }))

function PortraitLoader({ done }: { done: boolean }) {
  return (
    <div className={cn('portrait-loader', done && 'portrait-loader--done')} aria-hidden>
      <span className="portrait-loader__ring" />
      <span className="portrait-loader__ring portrait-loader__ring--delay" />
      <span className="portrait-loader__core" />
    </div>
  )
}

export function AboutPortrait() {
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)
  const ref = useCallback((node: HTMLDivElement | null) => {
    setHost(node)
  }, [])

  const onReady = useCallback(() => {
    setReady(true)
  }, [])

  return (
    <ViewportActivity
      name="about-portrait"
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
    >
      <div ref={ref} className="relative h-full w-full">
        <PortraitLoader done={ready} />
        <DeferredCanvas
          load={loadAboutPortrait}
          mode="visible"
          root={host}
          allowWhenReduced
          delayMs={0}
          idleTimeoutMs={400}
          props={{ onReady }}
          fallback={null}
        />
      </div>
    </ViewportActivity>
  )
}
