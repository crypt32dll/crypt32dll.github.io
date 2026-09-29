'use client'

import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type SceneCanvasProps = {
  children: (animate: boolean) => ReactNode
  camera?: { position?: [number, number, number]; fov?: number }
  className?: string
}

export function SceneCanvas({
  children,
  camera = { position: [0, 0, 5], fov: 40 },
  className,
}: SceneCanvasProps) {
  const reduced = useReducedMotion()

  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      camera={camera}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ background: 'transparent' }}
      aria-hidden
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.15} color="#f0f1ed" />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#1a8f7a" />
      {children(!reduced)}
    </Canvas>
  )
}
