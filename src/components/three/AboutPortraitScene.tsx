'use client'

import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'
import { SceneCanvas } from '@/components/three/SceneCanvas'

function PortraitRig({ animate }: { animate: boolean }) {
  const root = useRef<Group>(null)
  const rings = useRef<Group>(null)
  const orbit = useRef<Group>(null)
  const portrait = useRef<Mesh>(null)
  const texture = useTexture('/images/portrait/avatar.webp')

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.repeat.set(0.9, 0.88)
    texture.offset.set(0.05, 0.02)
    texture.needsUpdate = true
  }, [texture])

  const accentRing = useMemo(() => new THREE.TorusGeometry(1.42, 0.012, 12, 96), [])
  const outerRing = useMemo(() => new THREE.TorusGeometry(1.68, 0.008, 8, 120), [])
  const discGeo = useMemo(() => new THREE.CircleGeometry(1.18, 64), [])

  useFrame((state) => {
    if (!root.current) return
    const t = state.clock.elapsedTime
    const { x, y } = state.pointer

    if (animate) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, x * 0.18, 0.05)
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -y * 0.1, 0.05)
      if (rings.current) {
        rings.current.rotation.z = t * 0.16
        rings.current.rotation.x = Math.sin(t * 0.35) * 0.1
      }
      if (orbit.current) {
        orbit.current.rotation.y = -t * 0.24
        orbit.current.rotation.z = Math.sin(t * 0.4) * 0.06
      }
      if (portrait.current) {
        portrait.current.position.y = Math.sin(t * 0.8) * 0.03
      }
    } else {
      root.current.rotation.set(0, 0, 0)
    }
  })

  return (
    <group ref={root} scale={0.88}>
      <mesh ref={portrait} position={[0, 0, 0.02]}>
        <circleGeometry args={[1.12, 64]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, -0.04]} geometry={discGeo}>
        <meshStandardMaterial color="#e6e8e3" roughness={0.9} metalness={0} />
      </mesh>

      <group ref={rings}>
        <mesh geometry={accentRing} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <meshBasicMaterial color="#0d6b5c" transparent opacity={0.9} />
        </mesh>
        <mesh geometry={outerRing} rotation={[Math.PI / 2.1, -0.15, 0.4]}>
          <meshBasicMaterial color="#12141a" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[0.9, 0.3, 0.2]}>
          <ringGeometry args={[1.22, 1.25, 64]} />
          <meshBasicMaterial color="#1a8f7a" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={orbit}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2
          const r = 1.78
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * r, Math.sin(angle) * r * 0.55, Math.sin(angle) * 0.3]}
              rotation={[angle, angle * 0.5, 0]}
            >
              <boxGeometry args={[0.07, 0.07 + (i % 3) * 0.04, 0.07]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#0d6b5c' : '#12141a'}
                roughness={0.45}
                metalness={0.2}
                transparent
                opacity={0.75}
              />
            </mesh>
          )
        })}
        <mesh position={[1.25, 0.8, 0.5]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color="#0d6b5c" wireframe transparent opacity={0.45} />
        </mesh>
        <mesh position={[-1.35, -0.65, 0.35]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#1a8f7a" roughness={0.35} metalness={0.25} />
        </mesh>
      </group>
    </group>
  )
}

export function AboutPortraitScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg lg:max-w-none">
      <div
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_40%_35%,color-mix(in_srgb,var(--color-accent)_28%,transparent),transparent_68%)] opacity-80 mix-blend-multiply"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_60%_70%,color-mix(in_srgb,var(--color-ink)_10%,transparent),transparent_60%)] mix-blend-soft-light"
        aria-hidden
      />
      <SceneCanvas
        className="relative z-10 !h-full !w-full"
        camera={{ position: [0, 0, 5.1], fov: 36 }}
      >
        {(animate) => <PortraitRig animate={animate} />}
      </SceneCanvas>
      <span className="sr-only">Portrait of Fabian Schultz-Fademrecht</span>
    </div>
  )
}
