import { describe, expect, it } from 'vitest'
import { CHAPTER_SCRIPT } from '@/lib/experience-state'
import { resolveBloomIntensity, resolveRenderBudget } from '@/lib/render-budget'
import {
  clampScrollVelocity,
  pinEndFromFraction,
  planChapterPins,
  readDocumentProgress,
  tokenizeHeadline,
  workRailTravel,
} from '@/lib/scroll/adapters'

describe('resolveRenderBudget', () => {
  it('gates DoF on every tier', () => {
    for (const tier of ['cinematic', 'balanced', 'lite'] as const) {
      expect(resolveRenderBudget(tier).dof).toBe(false)
    }
  })

  it('keeps AA on cinematic while capping MSAA for EffectComposer cost', () => {
    const cinematic = resolveRenderBudget('cinematic')
    expect(cinematic.antialias).toBe(true)
    expect(cinematic.multisampling).toBe(0)
    expect(cinematic.dpr[1]).toBeLessThanOrEqual(1.5)
    expect(cinematic.particles).toBeLessThanOrEqual(240)
  })

  it('caps bloom below soft wash levels', () => {
    const cinematic = resolveRenderBudget('cinematic')
    expect(resolveBloomIntensity(0.5, cinematic)).toBeLessThanOrEqual(cinematic.bloomCap)
    expect(cinematic.bloomCap).toBeLessThanOrEqual(0.16)
  })

  it('disables postFx on lite', () => {
    expect(resolveRenderBudget('lite').postFx).toBe(false)
    expect(resolveBloomIntensity(0.2, resolveRenderBudget('lite'))).toBe(0)
  })
})

describe('scroll adapters', () => {
  it('reads document progress', () => {
    expect(readDocumentProgress(0, 2000, 1000)).toBe(0)
    expect(readDocumentProgress(500, 2000, 1000)).toBe(0.5)
    expect(readDocumentProgress(0, 800, 1000)).toBe(0)
  })

  it('clamps Lenis velocity into bus range', () => {
    expect(clampScrollVelocity(80)).toBe(1.5)
    expect(clampScrollVelocity(-80)).toBe(-1.5)
    expect(clampScrollVelocity(20)).toBe(0.5)
  })

  it('plans chapter pins from CHAPTER_SCRIPT', () => {
    const pins = planChapterPins(CHAPTER_SCRIPT)
    expect(pins.every((p) => p.end.startsWith('+='))).toBe(true)
    expect(pins.map((p) => p.id)).toEqual(CHAPTER_SCRIPT.filter((c) => c.pin).map((c) => c.id))
    expect(pinEndFromFraction(0.28)).toBe('+=28%')
  })

  it('computes work rail travel', () => {
    expect(workRailTravel(2400, 1200)).toBe(1200)
    expect(workRailTravel(800, 1200)).toBe(0)
  })

  it('tokenizes headlines without DOM', () => {
    expect(tokenizeHeadline('Hello world')).toEqual([
      { kind: 'word', value: 'Hello' },
      { kind: 'space', value: ' ' },
      { kind: 'word', value: 'world' },
    ])
  })
})
