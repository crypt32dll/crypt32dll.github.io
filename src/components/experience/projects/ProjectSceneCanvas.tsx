'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type Group, type InstancedMesh, Object3D, type Points } from 'three'
import { PortfolioCanvas } from '@/components/three/SceneCanvas'

export type ProjectSceneId =
  | 'commerce-pipeline'
  | 'content-lake'
  | 'platform-graph'
  | 'performance-pulse'

type Props = {
  sceneId: ProjectSceneId
  className?: string
}

function CommercePipeline({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const accent = useRef(new Color('#c9a27a'))
  const tint = useRef(new Color())
  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: (i % 6) * 0.55 - 1.4,
        y: Math.floor(i / 6) * 0.55 - 0.55,
        z: (i % 3) * 0.2,
      })),
    [],
  )

  useFrame((state) => {
    const root = group.current
    const inst = mesh.current
    if (!root || !inst) return
    const t = animate ? state.clock.elapsedTime : 0
    nodes.forEach((n, i) => {
      const wave = Math.sin(t * 1.2 + i * 0.35) * 0.08
      dummy.position.set(n.x, n.y + wave, n.z)
      dummy.scale.setScalar(0.28 + (i % 3) * 0.05)
      dummy.rotation.set(0, t * 0.2 + i * 0.1, 0)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      tint.current.copy(accent.current).offsetHSL(0, 0, (i % 4) * 0.04)
      inst.setColorAt(i, tint.current)
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
    root.rotation.y = Math.sin(t * 0.25) * 0.25
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.55} roughness={0.35} />
      </instancedMesh>
    </group>
  )
}

function ContentLake({ animate }: { animate: boolean }) {
  const points = useRef<Points>(null)
  const baseY = useRef<Float32Array | null>(null)
  const positions = useMemo(() => {
    const count = 420
    const arr = new Float32Array(count * 3)
    const y = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const x = (i % 20) * 0.14 - 1.4
      const z = Math.floor(i / 20) * 0.14 - 1.0
      y[i] = ((i * 17) % 7) * 0.08
      arr[i * 3] = x
      arr[i * 3 + 1] = y[i]!
      arr[i * 3 + 2] = z
    }
    baseY.current = y
    return arr
  }, [])

  useFrame((state) => {
    const mesh = points.current
    const bases = baseY.current
    if (!mesh || !bases) return
    const t = animate ? state.clock.elapsedTime : 0
    mesh.rotation.y = t * 0.12
    const attr = mesh.geometry.attributes.position
    const arr = attr.array as Float32Array
    for (let i = 0; i < bases.length; i++) {
      arr[i * 3 + 1] = bases[i]! + Math.sin(t * 1.5 + i * 0.05) * 0.12
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#c9a27a" transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

function PlatformGraph({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (!group.current) return
    const t = animate ? state.clock.elapsedTime : 0
    group.current.rotation.y = t * 0.18
    group.current.rotation.x = Math.sin(t * 0.4) * 0.12
  })

  const rings = [0.6, 1.0, 1.45]
  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[r, 0.025, 8, 64]} />
          <meshStandardMaterial
            color="#c9a27a"
            metalness={0.7}
            roughness={0.25}
            emissive="#c9a27a"
            emissiveIntensity={0.15 + i * 0.08}
          />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 1.0, Math.sin(a * 2) * 0.2, Math.sin(a) * 1.0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#f2f0eb" metalness={0.4} roughness={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

function PerformancePulse({ animate }: { animate: boolean }) {
  const bars = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useFrame((state) => {
    const inst = bars.current
    if (!inst) return
    const t = animate ? state.clock.elapsedTime : 0
    for (let i = 0; i < 24; i++) {
      const h = 0.35 + Math.abs(Math.sin(t * 2 + i * 0.35)) * 1.4
      dummy.position.set((i - 11.5) * 0.18, h / 2 - 0.5, 0)
      dummy.scale.set(0.1, h, 0.1)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={bars} args={[undefined, undefined, 24]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c9a27a" metalness={0.5} roughness={0.35} />
    </instancedMesh>
  )
}

function ProjectSceneInner({ sceneId, animate }: { sceneId: ProjectSceneId; animate: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={0.85} />
      <pointLight position={[-2, 2, 3]} intensity={0.55} color="#c9a27a" />
      {sceneId === 'commerce-pipeline' ? <CommercePipeline animate={animate} /> : null}
      {sceneId === 'content-lake' ? <ContentLake animate={animate} /> : null}
      {sceneId === 'platform-graph' ? <PlatformGraph animate={animate} /> : null}
      {sceneId === 'performance-pulse' ? <PerformancePulse animate={animate} /> : null}
    </>
  )
}

export function ProjectSceneCanvas({ sceneId, className }: Props) {
  return (
    <PortfolioCanvas
      className={className}
      lights="none"
      camera={{ position: [0, 0.4, 4.2], fov: 42 }}
    >
      {({ animate }) => <ProjectSceneInner sceneId={sceneId} animate={animate} />}
    </PortfolioCanvas>
  )
}
