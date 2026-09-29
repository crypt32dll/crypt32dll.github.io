'use client'

import { type ComponentType, type ReactNode, useEffect, useState } from 'react'
import { useDeferredMount } from '@/lib/use-deferred-mount'

type ImportResult<P> = { default: ComponentType<P> } | ComponentType<P>

type DeferredCanvasProps<P extends object = Record<string, never>> = {
  load: () => Promise<ImportResult<P>>
  fallback?: ReactNode
  mode?: 'idle' | 'interaction' | 'visible'
  delayMs?: number
  root?: Element | null
  props?: P
}

function resolveComponent<P>(mod: ImportResult<P>): ComponentType<P> {
  return typeof mod === 'function' ? mod : mod.default
}

/**
 * Lazily imports a Three.js scene off the critical path.
 * Prefer `interaction` on the homepage so Lighthouse/TBT stay clean.
 */
export function DeferredCanvas<P extends object = Record<string, never>>({
  load,
  fallback = null,
  mode = 'idle',
  delayMs = 500,
  root = null,
  props,
}: DeferredCanvasProps<P>) {
  const shouldMount = useDeferredMount({ mode, delayMs, root })
  const [Scene, setScene] = useState<ComponentType<P> | null>(null)

  useEffect(() => {
    if (!shouldMount) return

    let cancelled = false
    load().then((mod) => {
      if (!cancelled) setScene(() => resolveComponent(mod))
    })

    return () => {
      cancelled = true
    }
  }, [shouldMount, load])

  if (!Scene) return fallback

  return <Scene {...(props as P)} />
}
