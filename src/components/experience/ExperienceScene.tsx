'use client'

import { ContactShadows, PerformanceMonitor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Color, type MeshStandardMaterial, type PerspectiveCamera, type PointLight } from 'three'
import { ArchitectureAssemblage } from '@/components/experience/ArchitectureAssemblage'
import { ParticleMorphField } from '@/components/experience/ParticleMorphField'
import { usePreferences } from '@/components/layout/PreferencesProvider'
import { PortfolioCanvas } from '@/components/three/SceneCanvas'
import {
  bumpLoadProgress,
  experienceState,
  markExperienceReady,
  type QualityTier,
  resolveQualityTier,
  sampleCamera,
  setPaused,
  setQualityTier,
  syncSmoothFromProgress,
} from '@/lib/experience-state'
import { type RenderBudget, resolveBloomIntensity, resolveRenderBudget } from '@/lib/render-budget'
import { useReducedMotion } from '@/lib/use-reduced-motion'

function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree()
  const frames = useRef(0)
  const lastFov = useRef(-1)

  useFrame((_state, delta) => {
    if (experienceState.paused) return

    frames.current += 1
    if (frames.current === 2) markExperienceReady()

    syncSmoothFromProgress(delta, animate)

    const p = experienceState.smooth
    const key = sampleCamera(p)
    const px = experienceState.reduced ? 0 : experienceState.pointerX
    const py = experienceState.reduced ? 0 : experienceState.pointerY

    const targetX = key.position[0] + px * 0.45
    const targetY = key.position[1] + py * 0.28
    const targetZ = key.position[2]

    const lerp = animate ? 0.055 : 1
    camera.position.x += (targetX - camera.position.x) * lerp
    camera.position.y += (targetY - camera.position.y) * lerp
    camera.position.z += (targetZ - camera.position.z) * lerp
    camera.lookAt(key.lookAt[0] + px * 0.08, key.lookAt[1] + py * 0.05, key.lookAt[2])

    const persp = camera as PerspectiveCamera
    if (persp.isPerspectiveCamera) {
      const nextFov = key.fov
      const fov = persp.fov + (nextFov - persp.fov) * lerp
      if (Math.abs(fov - lastFov.current) > 0.02) {
        persp.fov = fov
        persp.updateProjectionMatrix()
        lastFov.current = fov
      } else {
        persp.fov = fov
      }
    }
  })

  return null
}

function StudioLights({ animate }: { animate: boolean }) {
  const key = useRef<PointLight>(null)
  const rim = useRef<PointLight>(null)
  const fill = useRef<PointLight>(null)
  const accent = useRef(new Color('#d4b08a'))
  const t0 = useRef(0)

  useFrame(() => {
    if (experienceState.paused) return
    accent.current.set(experienceState.accent)
    if (animate) t0.current = Date.now() / 1200
    const t = t0.current
    const dark = experienceState.dark
    if (key.current) {
      key.current.color.set(dark ? '#f2f0eb' : '#ffffff')
      key.current.intensity = dark ? 1.1 : 1.35
      key.current.position.set(3.2, 4.5, 3.8)
    }
    if (fill.current) {
      fill.current.color.set(dark ? '#6a7388' : '#c8c4ba')
      fill.current.intensity = dark ? 0.35 : 0.55
      fill.current.position.set(-3.5, 1.8, 2.2)
    }
    if (rim.current) {
      rim.current.color.copy(accent.current)
      // Gentle pulse — slower to avoid perceived flicker against bloom
      rim.current.intensity = (dark ? 0.9 : 0.65) * (0.92 + Math.sin(t) * 0.08)
      rim.current.position.set(Math.sin(t * 0.45) * 3.6, 2.6, -Math.cos(t * 0.45) * 3.2)
    }
  })

  return (
    <>
      <ambientLight intensity={experienceState.dark ? 0.22 : 0.48} />
      <directionalLight
        position={[4.5, 7, 4]}
        intensity={experienceState.dark ? 0.65 : 0.95}
        color="#f5f2eb"
      />
      <pointLight ref={key} distance={22} decay={2} />
      <pointLight ref={fill} distance={18} decay={2} />
      <pointLight ref={rim} distance={16} decay={2} />
    </>
  )
}

function ThemeFog() {
  const { scene, gl } = useThree()
  useFrame(() => {
    const paper = experienceState.paper
    if (scene.fog && 'color' in scene.fog) {
      ;(scene.fog as { color: Color }).color.set(paper)
    }
    gl.setClearColor(paper, 1)
  })
  return <fog attach="fog" args={[experienceState.paper, 18, 28]} />
}

function GroundStage({ budget }: { budget: RenderBudget }) {
  const mat = useRef<MeshStandardMaterial>(null)
  useFrame(() => {
    if (!mat.current) return
    mat.current.color.set(experienceState.dark ? '#0c0d10' : '#d4d1c8')
  })
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow={budget.shadows}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          ref={mat}
          color="#0c0d10"
          metalness={experienceState.dark ? 0.28 : 0.1}
          roughness={0.78}
        />
      </mesh>
      {budget.shadows ? (
        <ContactShadows
          position={[0, -1.52, 0]}
          opacity={experienceState.dark ? 0.38 : 0.18}
          scale={16}
          blur={1.6}
          far={5}
          resolution={256}
          color="#000000"
        />
      ) : null}
    </>
  )
}

function PostFX({ budget }: { budget: RenderBudget }) {
  const bloomEffect = useRef<{ intensity: number } | null>(null)
  const lastBloom = useRef(-1)

  useFrame(() => {
    if (!bloomEffect.current) return
    const next = resolveBloomIntensity(experienceState.bloomIntensity, budget)
    if (Math.abs(next - lastBloom.current) > 0.004) {
      bloomEffect.current.intensity = next
      lastBloom.current = next
    }
  })

  if (!budget.postFx) return null

  return (
    <EffectComposer multisampling={budget.multisampling} enableNormalPass={false}>
      <Bloom
        ref={bloomEffect as never}
        intensity={budget.bloomCap}
        luminanceThreshold={budget.bloomThreshold}
        luminanceSmoothing={0.28}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.34} darkness={budget.vignetteDarkness} />
    </EffectComposer>
  )
}

function VisibilityGate({ onPaused }: { onPaused: (paused: boolean) => void }) {
  useEffect(() => {
    const onVis = () => {
      const hidden = document.hidden
      setPaused(hidden)
      onPaused(hidden)
    }
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [onPaused])
  return null
}

function ExperienceWorld({
  animate,
  budget,
  onTierDecline,
}: {
  animate: boolean
  budget: RenderBudget
  onTierDecline: () => void
}) {
  return (
    <>
      <ThemeFog />
      <StudioLights animate={animate} />
      <CameraRig animate={animate} />
      <PerformanceMonitor
        // Only decline — inclining mid-session causes AdaptiveDpr-style flicker
        onDecline={onTierDecline}
        flipflops={2}
        factor={0.85}
        step={0.15}
      />
      <group>
        <ArchitectureAssemblage animate={animate} />
        {budget.particles > 0 ? (
          <ParticleMorphField count={budget.particles} animate={animate} />
        ) : null}
      </group>
      <GroundStage budget={budget} />
      <PostFX budget={budget} />
    </>
  )
}

type ExperienceSceneProps = {
  className?: string
}

export function ExperienceScene({ className }: ExperienceSceneProps) {
  const reduced = useReducedMotion()
  const { qualityPreference } = usePreferences()
  const [tier, setTier] = useState<QualityTier>('balanced')
  const [pausedRender, setPausedRender] = useState(false)

  useEffect(() => {
    bumpLoadProgress(0.25)
    const mobile = window.matchMedia('(max-width: 768px)').matches
    const saveData =
      'connection' in navigator &&
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
      )
    const next = resolveQualityTier({
      mobile,
      saveData,
      reduced,
      preference: qualityPreference,
    })
    setTier(next)
    setQualityTier(next)
  }, [reduced, qualityPreference])

  const budget = useMemo(() => resolveRenderBudget(tier), [tier])

  const onTierDecline = () => {
    setTier((current) => {
      if (current === 'cinematic') {
        setQualityTier('balanced')
        return 'balanced'
      }
      return current
    })
  }

  return (
    <PortfolioCanvas
      className={className}
      lights="none"
      dpr={budget.dpr}
      antialias={budget.antialias}
      alpha={false}
      preserveDrawingBuffer={tier !== 'lite'}
      frameloop={pausedRender ? 'never' : 'always'}
      camera={{ position: [0.15, 0.55, 5.6], fov: 40, near: 0.1, far: 50 }}
      onCreated={({ gl }) => {
        bumpLoadProgress(0.5)
        gl.setClearColor(experienceState.paper, 1)
      }}
    >
      {({ animate }) => (
        <>
          <VisibilityGate onPaused={setPausedRender} />
          <ExperienceWorld animate={animate} budget={budget} onTierDecline={onTierDecline} />
        </>
      )}
    </PortfolioCanvas>
  )
}
