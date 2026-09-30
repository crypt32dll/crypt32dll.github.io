/**
 * ExperienceRuntime — mutable store + named writers for GSAP / Lenis / R3F.
 * WebGL reads `experienceState` each frame; only writers below may mutate.
 */

import type { MorphShape } from '@/lib/morph-targets'

export type ChapterId = 'hero' | 'skills' | 'work' | 'about' | 'contact'
export type QualityTier = 'cinematic' | 'balanced' | 'lite'

export type CameraKey = {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov: number
}

export type ChapterDef = {
  id: ChapterId
  start: number
  end: number
  morph: MorphShape
  camera: CameraKey
  /** Pin length as viewport fraction (ScrollTrigger end +=N%) */
  pin?: number
  bloom: number
  dof: number
  chromatic: number
}

/** Master timeline: DOM chapters, camera, morph, and FX share these windows. */
export const CHAPTER_SCRIPT: readonly ChapterDef[] = [
  {
    id: 'hero',
    start: 0,
    end: 0.18,
    morph: 'lattice',
    camera: { position: [0.15, 0.55, 5.6], lookAt: [0, 0.2, 0], fov: 40 },
    pin: 0.28,
    bloom: 0.14,
    dof: 0,
    chromatic: 0,
  },
  {
    id: 'skills',
    start: 0.16,
    end: 0.38,
    morph: 'explode',
    camera: { position: [1.35, 0.85, 4.8], lookAt: [0, 0.25, 0], fov: 38 },
    pin: 0.32,
    bloom: 0.16,
    dof: 0,
    chromatic: 0.12,
  },
  {
    id: 'work',
    start: 0.34,
    end: 0.58,
    morph: 'constellations',
    camera: { position: [-1.1, 0.35, 4.2], lookAt: [0.2, 0.15, 0], fov: 36 },
    // Horizontal rail owns the pin for this chapter
    bloom: 0.14,
    dof: 0,
    chromatic: 0.08,
  },
  {
    id: 'about',
    start: 0.54,
    end: 0.82,
    morph: 'helix',
    camera: { position: [0.55, 0.95, 3.9], lookAt: [0, 0.4, 0], fov: 34 },
    bloom: 0.12,
    dof: 0,
    chromatic: 0.05,
  },
  {
    id: 'contact',
    start: 0.78,
    end: 1,
    morph: 'core',
    camera: { position: [0, 0.25, 3.4], lookAt: [0, 0.1, 0], fov: 32 },
    bloom: 0.1,
    dof: 0,
    chromatic: 0,
  },
] as const

/** @deprecated Prefer CHAPTER_SCRIPT — kept for assemblage chapterLocal calls */
export const CHAPTERS = {
  hero: { start: CHAPTER_SCRIPT[0]!.start, end: CHAPTER_SCRIPT[0]!.end },
  skills: { start: CHAPTER_SCRIPT[1]!.start, end: CHAPTER_SCRIPT[1]!.end },
  work: { start: CHAPTER_SCRIPT[2]!.start, end: CHAPTER_SCRIPT[2]!.end },
  about: { start: CHAPTER_SCRIPT[3]!.start, end: CHAPTER_SCRIPT[3]!.end },
  contact: { start: CHAPTER_SCRIPT[4]!.start, end: CHAPTER_SCRIPT[4]!.end },
} as const

export const MORPH_ORDER: MorphShape[] = CHAPTER_SCRIPT.map((c) => c.morph)

export type ExperienceState = {
  progress: number
  smooth: number
  pointerX: number
  pointerY: number
  reduced: boolean
  ink: string
  accent: string
  paper: string
  dark: boolean
  loadProgress: number
  ready: boolean
  unveiled: boolean
  introScale: number
  activeChapter: ChapterId
  chapterProgress: number
  scrollVelocity: number
  quality: QualityTier
  paused: boolean
  audioMuted: boolean
  bloomIntensity: number
  dofIntensity: number
  chromaticIntensity: number
}

export const experienceState: ExperienceState = {
  progress: 0,
  smooth: 0,
  pointerX: 0,
  pointerY: 0,
  reduced: false,
  ink: '#f2f0eb',
  accent: '#d4b08a',
  paper: '#08090c',
  dark: true,
  loadProgress: 0,
  ready: false,
  unveiled: false,
  introScale: 0,
  activeChapter: 'hero',
  chapterProgress: 0,
  scrollVelocity: 0,
  quality: 'cinematic',
  paused: false,
  audioMuted: true,
  bloomIntensity: 0.14,
  dofIntensity: 0,
  chromaticIntensity: 0,
}

export function setScrollProgress(progress: number): void {
  experienceState.progress = progress
  applyChapterFromProgress(progress)
}

export function setSmoothProgress(smooth: number): void {
  experienceState.smooth = smooth
}

export function syncSmoothFromProgress(delta: number, animate: boolean): void {
  if (!experienceState.reduced && animate) {
    experienceState.smooth +=
      (experienceState.progress - experienceState.smooth) * Math.min(1, delta * 2.2)
  } else {
    experienceState.smooth = experienceState.progress
  }
}

export function setPointer(x: number, y: number): void {
  if (experienceState.reduced) {
    experienceState.pointerX = 0
    experienceState.pointerY = 0
    return
  }
  experienceState.pointerX = x
  experienceState.pointerY = y
}

export function setReducedMotion(reduced: boolean): void {
  experienceState.reduced = reduced
  if (reduced) {
    experienceState.pointerX = 0
    experienceState.pointerY = 0
    experienceState.smooth = experienceState.progress
  }
}

export function setThemeTokens(tokens: {
  ink: string
  accent: string
  paper: string
  dark: boolean
}): void {
  experienceState.ink = tokens.ink
  experienceState.accent = tokens.accent
  experienceState.paper = tokens.paper
  experienceState.dark = tokens.dark
}

export function bumpLoadProgress(min: number): void {
  experienceState.loadProgress = Math.max(experienceState.loadProgress, min)
}

export function setLoadProgress(value: number): void {
  experienceState.loadProgress = value
}

export function markExperienceReady(): void {
  experienceState.ready = true
  bumpLoadProgress(0.95)
}

export function setIntroScale(scale: number): void {
  experienceState.introScale = scale
}

export function setUnveiled(unveiled: boolean): void {
  experienceState.unveiled = unveiled
}

export function completeIntroImmediately(): void {
  experienceState.ready = true
  experienceState.loadProgress = 1
  experienceState.introScale = 1
  experienceState.unveiled = true
}

export function setActiveChapter(id: ChapterId, localProgress = 0): void {
  experienceState.activeChapter = id
  experienceState.chapterProgress = localProgress
  const chapter = CHAPTER_SCRIPT.find((c) => c.id === id)
  if (!chapter) return
  experienceState.bloomIntensity = chapter.bloom
  experienceState.dofIntensity = chapter.dof
  experienceState.chromaticIntensity = chapter.chromatic
}

export function setScrollVelocity(velocity: number): void {
  experienceState.scrollVelocity = velocity
}

export function setQualityTier(tier: QualityTier): void {
  experienceState.quality = tier
}

export function setPaused(paused: boolean): void {
  experienceState.paused = paused
}

export function setAudioMuted(muted: boolean): void {
  experienceState.audioMuted = muted
}

export function chapterLocal(progress: number, start: number, end: number): number {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return (progress - start) / (end - start)
}

export function applyChapterFromProgress(progress: number): void {
  let current = CHAPTER_SCRIPT[0]!
  for (const chapter of CHAPTER_SCRIPT) {
    if (progress >= chapter.start) current = chapter
  }
  const local = chapterLocal(progress, current.start, current.end)
  setActiveChapter(current.id, local)
}

/** Interpolate camera keys between consecutive chapters from global progress. */
export function sampleCamera(progress: number): CameraKey {
  const chapters = CHAPTER_SCRIPT
  if (progress <= chapters[0]!.start) return chapters[0]!.camera
  if (progress >= chapters[chapters.length - 1]!.end) {
    return chapters[chapters.length - 1]!.camera
  }

  for (let i = 0; i < chapters.length - 1; i++) {
    const a = chapters[i]!
    const b = chapters[i + 1]!
    const midStart = (a.start + a.end) / 2
    const midEnd = (b.start + b.end) / 2
    if (progress >= midStart && progress <= midEnd) {
      const t = (progress - midStart) / Math.max(midEnd - midStart, 1e-5)
      return lerpCamera(a.camera, b.camera, smoothstep(t))
    }
    if (progress < midStart) return a.camera
  }
  return chapters[chapters.length - 1]!.camera
}

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function lerpCamera(a: CameraKey, b: CameraKey, t: number): CameraKey {
  return {
    position: [
      a.position[0] + (b.position[0] - a.position[0]) * t,
      a.position[1] + (b.position[1] - a.position[1]) * t,
      a.position[2] + (b.position[2] - a.position[2]) * t,
    ],
    lookAt: [
      a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * t,
      a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * t,
      a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * t,
    ],
    fov: a.fov + (b.fov - a.fov) * t,
  }
}

export function resolveQualityTier(opts: {
  mobile: boolean
  saveData: boolean
  reduced: boolean
  preference?: QualityTier | 'auto'
}): QualityTier {
  if (opts.reduced || opts.saveData) return 'lite'
  if (opts.preference && opts.preference !== 'auto') return opts.preference
  // Auto defaults to balanced — cinematic stays opt-in via the quality toggle
  if (opts.mobile) return 'lite'
  return 'balanced'
}
