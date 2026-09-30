'use client'

import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  type Group,
  type InstancedMesh,
  type LineSegments,
  MathUtils,
  Object3D,
} from 'three'
import { CHAPTERS, chapterLocal, experienceState } from '@/lib/experience-state'

type Props = { animate: boolean }

const COLS = 5
const ROWS = 4
const DEPTH = 4
const COUNT = COLS * ROWS * DEPTH

/**
 * Primary set piece — owns the scroll morph (explode / reassemble via CHAPTERS).
 * ParticleMorphField is atmosphere only and must not compete for the same story.
 */
export function ArchitectureAssemblage({ animate }: Props) {
  const group = useRef<Group>(null)
  const mesh = useRef<InstancedMesh>(null)
  const edges = useRef<LineSegments>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const lastP = useRef(-1)
  const lastPtr = useRef({ x: 0, y: 0 })
  const lastIntro = useRef(-1)
  const base = useMemo(() => {
    const positions: { x: number; y: number; z: number; sx: number; sy: number; sz: number }[] = []
    let i = 0
    for (let z = 0; z < DEPTH; z++) {
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          positions.push({
            x: (x - (COLS - 1) / 2) * 0.72,
            y: (y - (ROWS - 1) / 2) * 0.62,
            z: (z - (DEPTH - 1) / 2) * 0.7,
            sx: 0.38 + (i % 3) * 0.08,
            sy: 0.28 + (i % 4) * 0.1,
            sz: 0.32 + (i % 2) * 0.12,
          })
          i++
        }
      }
    }
    return positions
  }, [])

  const cellGeo = useMemo(() => new BoxGeometry(1, 1, 1), [])
  const edgeGeo = useMemo(() => new EdgesGeometry(new BoxGeometry(3.8, 2.8, 3.2)), [])
  const ink = useRef(new Color('#12141a'))
  const accent = useRef(new Color('#0d6b5c'))
  const tint = useRef(new Color())

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    base.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.set(p.sx, p.sy, p.sz)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, ink.current)
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [base, dummy])

  useFrame((_state, delta) => {
    if (experienceState.paused) return
    const inst = mesh.current
    const root = group.current
    if (!inst || !root) return

    const p =
      experienceState.reduced || !animate ? experienceState.progress : experienceState.smooth
    const px = experienceState.pointerX
    const py = experienceState.pointerY
    const intro = experienceState.introScale
    const needsIdleSpin = animate && p < 0.05
    const resting =
      Math.abs(experienceState.scrollVelocity) < 0.04 &&
      Math.abs(p - lastP.current) < 0.0002 &&
      Math.abs(px - lastPtr.current.x) < 0.003 &&
      Math.abs(py - lastPtr.current.y) < 0.003 &&
      Math.abs(intro - lastIntro.current) < 0.002

    if (resting && !needsIdleSpin) return

    lastP.current = p
    lastPtr.current = { x: px, y: py }
    lastIntro.current = intro

    ink.current.set(experienceState.ink)
    accent.current.set(experienceState.accent)

    const skills = chapterLocal(p, CHAPTERS.skills.start, CHAPTERS.skills.end)
    const work = chapterLocal(p, CHAPTERS.work.start, CHAPTERS.work.end)
    const about = chapterLocal(p, CHAPTERS.about.start, CHAPTERS.about.end)

    const explode = Math.max(skills * (1 - work * 0.85), 0)
    const reassemble = about

    base.forEach((cell, i) => {
      const n = i / COUNT
      const burst = 1 + explode * (1.2 + (i % 7) * 0.18)
      const swirl = explode * n * Math.PI * 1.4
      const ox = Math.cos(swirl + i) * explode * (0.6 + (i % 5) * 0.15)
      const oy = Math.sin(swirl * 0.7) * explode * 0.5
      const oz = Math.sin(i * 0.4) * explode * 0.9

      const rx = MathUtils.lerp(cell.x * burst + ox, cell.x * 0.35, reassemble)
      const ry = MathUtils.lerp(cell.y * burst + oy, cell.y * 0.35 + Math.sin(i) * 0.05, reassemble)
      const rz = MathUtils.lerp(cell.z * burst + oz, cell.z * 0.35, reassemble)

      dummy.position.set(rx, ry, rz)
      dummy.rotation.set(
        explode * 0.4 * ((i % 3) - 1),
        explode * 0.55 * ((i % 5) - 2) + reassemble * Math.PI * 0.15,
        explode * 0.25 * ((i % 4) - 1.5),
      )
      const s = MathUtils.lerp(1, 0.72 + (i % 3) * 0.08, reassemble)
      dummy.scale.set(cell.sx * s, cell.sy * s, cell.sz * s)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)

      tint.current.copy(ink.current).lerp(accent.current, (i % 7 === 0 ? 0.55 : 0.08) + work * 0.25)
      inst.setColorAt(i, tint.current)
    })

    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true

    root.rotation.y = p * 0.65 + px * 0.25
    root.rotation.x = -0.12 + py * 0.12 + Math.sin(p * Math.PI) * 0.06
    root.position.y = MathUtils.lerp(0.15, -0.35, p)
    root.scale.setScalar(Math.max(0.001, intro))

    if (edges.current) {
      edges.current.rotation.y = -p * 0.9
      edges.current.scale.setScalar(MathUtils.lerp(1, 1.35 + skills * 0.4, skills))
      const mat = edges.current.material
      if (!Array.isArray(mat) && 'opacity' in mat) {
        mat.opacity = MathUtils.lerp(0.75, 0.2, work)
      }
    }

    if (needsIdleSpin) {
      root.rotation.y += delta * 0.08
      // Allow next frame to keep spinning without needing scroll delta
      lastP.current = p - 0.001
    }
  })

  return (
    <group ref={group}>
      <lineSegments ref={edges} geometry={edgeGeo}>
        <lineBasicMaterial color="#c9a27a" transparent opacity={0.75} />
      </lineSegments>
      <instancedMesh ref={mesh} args={[cellGeo, undefined, COUNT]}>
        <meshStandardMaterial roughness={0.42} metalness={0.4} transparent opacity={0.86} />
      </instancedMesh>
    </group>
  )
}
