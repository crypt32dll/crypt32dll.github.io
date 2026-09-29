'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, LineSegments } from 'three'
import * as THREE from 'three'
import { useReducedMotion } from '@/lib/use-reduced-motion'

function ArchitectureLattice({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)
  const frame = useRef<LineSegments>(null)

  const edges = useMemo(() => {
    const geo = new THREE.BoxGeometry(2.4, 2.4, 2.4)
    return new THREE.EdgesGeometry(geo)
  }, [])

  const grid = useMemo(() => {
    const points: THREE.Vector3[] = []
    const size = 3
    const step = 0.55
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        points.push(new THREE.Vector3(x * step * 0.35, 0, z * step * 0.35))
      }
    }
    return points
  }, [])

  useFrame((state) => {
    if (!animate || !group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = t * 0.12
    group.current.rotation.x = Math.sin(t * 0.2) * 0.08
    if (frame.current) {
      frame.current.rotation.y = -t * 0.18
      frame.current.position.y = Math.sin(t * 0.7) * 0.08
    }
  })

  return (
    <group ref={group}>
      <lineSegments ref={frame} geometry={edges}>
        <lineBasicMaterial color="#0d6b5c" transparent opacity={0.85} />
      </lineSegments>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <ringGeometry args={[1.1, 1.14, 64]} />
        <meshBasicMaterial color="#12141a" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {grid.map((p, i) => (
        <mesh key={i} position={[p.x, Math.sin(i * 0.7) * 0.15, p.z]}>
          <boxGeometry args={[0.06, 0.06 + (i % 5) * 0.04, 0.06]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? '#1a8f7a' : '#12141a'}
            roughness={0.65}
            metalness={0.15}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}

      <mesh position={[0.9, 0.6, 0.4]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#0d6b5c" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function HeroScene() {
  const reduced = useReducedMotion()

  return (
    <div className="absolute inset-0 -z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 2]} intensity={1.1} color="#f0f1ed" />
        <directionalLight position={[-3, -2, -4]} intensity={0.35} color="#1a8f7a" />
        <ArchitectureLattice animate={!reduced} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
    </div>
  )
}
