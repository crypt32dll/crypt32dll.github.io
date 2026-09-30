import type { QualityTier } from '@/lib/experience-state'

/** Frame-local GL policy — resolved once from quality, consumed by canvas + PostFX. */
export type RenderBudget = {
  tier: QualityTier
  particles: number
  environment: boolean
  shadows: boolean
  postFx: boolean
  /** Multiplier applied to chapter bloomIntensity */
  bloomScale: number
  bloomCap: number
  bloomThreshold: number
  multisampling: number
  /** DoF stays gated off — soft bokeh fought the cube read */
  dof: boolean
  allowChromatic: boolean
  dpr: [number, number]
  antialias: boolean
  noiseOpacity: number
  vignetteDarkness: number
}

const BUDGETS: Record<QualityTier, RenderBudget> = {
  cinematic: {
    tier: 'cinematic',
    particles: 220,
    environment: false,
    shadows: true,
    postFx: true,
    bloomScale: 0.36,
    bloomCap: 0.12,
    bloomThreshold: 0.66,
    // EffectComposer MSAA is costly; keep low to avoid frame hitch flicker
    multisampling: 0,
    dof: false,
    allowChromatic: false,
    dpr: [1, 1.5],
    antialias: true,
    noiseOpacity: 0,
    vignetteDarkness: 0.26,
  },
  balanced: {
    tier: 'balanced',
    particles: 120,
    environment: false,
    shadows: false,
    postFx: true,
    bloomScale: 0.28,
    bloomCap: 0.08,
    bloomThreshold: 0.7,
    multisampling: 0,
    dof: false,
    allowChromatic: false,
    dpr: [1, 1.25],
    antialias: true,
    noiseOpacity: 0,
    vignetteDarkness: 0.28,
  },
  lite: {
    tier: 'lite',
    particles: 0,
    environment: false,
    shadows: false,
    postFx: false,
    bloomScale: 0,
    bloomCap: 0,
    bloomThreshold: 1,
    multisampling: 0,
    dof: false,
    allowChromatic: false,
    dpr: [1, 1],
    antialias: false,
    noiseOpacity: 0,
    vignetteDarkness: 0,
  },
}

export function resolveRenderBudget(tier: QualityTier): RenderBudget {
  return BUDGETS[tier]
}

/** Cap chapter bloom against the active budget. */
export function resolveBloomIntensity(chapterBloom: number, budget: RenderBudget): number {
  if (!budget.postFx) return 0
  return Math.min(budget.bloomCap, chapterBloom * budget.bloomScale)
}
