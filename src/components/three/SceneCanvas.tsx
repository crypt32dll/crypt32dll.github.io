'use client'

import { Canvas, type CanvasProps, type RootState } from '@react-three/fiber'
import type { CSSProperties, ReactNode } from 'react'
import { useViewportPlay } from '@/components/experience/ViewportActivity'
import { useReducedMotion } from '@/lib/use-reduced-motion'

export type PortfolioCanvasProps = {
  children: ReactNode | ((ctx: { animate: boolean }) => ReactNode)
  camera?: { position?: [number, number, number]; fov?: number; near?: number; far?: number }
  className?: string
  /** Extra lights beyond shared ambient/key/fill — Experience adds orbit lights itself */
  lights?: 'portrait' | 'none'
  style?: CSSProperties
  onCreated?: (state: RootState) => void
  /** Pixel ratio floor/ceiling — fixed (no AdaptiveDpr) to avoid scroll flicker */
  dpr?: number | [number, number]
  antialias?: boolean
  /** Opaque clear avoids transparent-canvas compositing flicker over CSS washes */
  alpha?: boolean
  /** Needed so transition snapshots can read WebGL pixels via toDataURL */
  preserveDrawingBuffer?: boolean
  frameloop?: CanvasProps['frameloop']
}

/**
 * Shared R3F host for Experience + About portrait.
 * Motion flag comes from preferences (browser + toggle).
 */
export function PortfolioCanvas({
  children,
  camera = { position: [0, 0, 5], fov: 40 },
  className,
  lights = 'portrait',
  style,
  onCreated,
  dpr = [1, 1.25],
  antialias = true,
  alpha = true,
  preserveDrawingBuffer = false,
  frameloop,
}: PortfolioCanvasProps) {
  const reduced = useReducedMotion()
  const viewportPlay = useViewportPlay()
  const animate = !reduced
  const loop = frameloop ?? (viewportPlay ? 'always' : 'never')

  return (
    <Canvas
      className={className}
      dpr={dpr}
      camera={camera}
      frameloop={loop}
      gl={{
        antialias: antialias && !reduced,
        alpha,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        preserveDrawingBuffer,
      }}
      style={{ background: alpha ? 'transparent' : undefined, ...style }}
      aria-hidden
      onCreated={onCreated}
    >
      {lights === 'portrait' ? (
        <>
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 5]} intensity={1.05} color="#f2f0eb" />
          <directionalLight position={[-3.5, -1.5, -2.5]} intensity={0.45} color="#c9a27a" />
          <pointLight position={[1.6, 1.2, 2.4]} intensity={0.55} distance={8} color="#dbb892" />
        </>
      ) : null}
      {typeof children === 'function' ? children({ animate }) : children}
    </Canvas>
  )
}

/** @deprecated Use PortfolioCanvas */
export function SceneCanvas(props: PortfolioCanvasProps) {
  return <PortfolioCanvas {...props} lights={props.lights ?? 'portrait'} />
}
