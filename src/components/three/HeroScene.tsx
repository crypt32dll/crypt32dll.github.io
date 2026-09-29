'use client'

import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BoxGeometry,
  DoubleSide,
  EdgesGeometry,
  type Group,
  type InstancedMesh,
  type LineSegments,
  Object3D,
} from 'three'
import { SceneCanvas } from '@/components/three/SceneCanvas'

function ArchitectureLattice({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)
  const frame = useRef<LineSegments>(null)
  const grid = useRef<InstancedMesh>(null)

  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(2.4, 2.4, 2.4)), [])
  const cellGeo = useMemo(() => new BoxGeometry(0.06, 0.08, 0.06), [])

  const cellCount = 7 * 7

  useLayoutEffect(() => {
    const mesh = grid.current
    if (!mesh) return
    const dummy = new Object3D()
    const size = 3
    const step = 0.55
    let i = 0
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        dummy.position.set(x * step * 0.35, Math.sin(i * 0.7) * 0.15, z * step * 0.35)
        dummy.scale.set(1, 1 + (i % 5) * 0.5, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        i++
      }
    }
    mesh.instanceMatrix.needsUpdate = true
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
        <ringGeometry args={[1.1, 1.14, 48]} />
        <meshBasicMaterial color="#12141a" transparent opacity={0.25} side={DoubleSide} />
      </mesh>

      <instancedMesh ref={grid} args={[cellGeo, undefined, cellCount]}>
        <meshStandardMaterial
          color="#12141a"
          roughness={0.65}
          metalness={0.15}
          transparent
          opacity={0.55}
        />
      </instancedMesh>

      <mesh position={[0.9, 0.6, 0.4]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#0d6b5c" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-0" aria-hidden="true">
      <SceneCanvas camera={{ position: [0, 0.4, 5.2], fov: 42 }} className="h-full w-full">
        {(animate) => <ArchitectureLattice animate={animate} />}
      </SceneCanvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
    </div>
  )
}
