import { MathUtils, Vector3 } from 'three'

export type MorphShape = 'lattice' | 'explode' | 'constellations' | 'helix' | 'core'

const TMP = new Vector3()

function hash(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Dense architectural grid — hero identity */
function lattice(i: number, count: number, out: Float32Array, offset: number) {
  const side = Math.ceil(Math.cbrt(count))
  const x = (i % side) - side / 2
  const y = (Math.floor(i / side) % side) - side / 2
  const z = Math.floor(i / (side * side)) - side / 2
  const spacing = 0.42
  const jitter = 0.04
  out[offset] = x * spacing + (hash(i, 1) - 0.5) * jitter
  out[offset + 1] = y * spacing + (hash(i, 2) - 0.5) * jitter
  out[offset + 2] = z * spacing + (hash(i, 3) - 0.5) * jitter
}

/** Exploded modules — skills / composable layers */
function explode(i: number, count: number, out: Float32Array, offset: number) {
  const t = i / count
  const layer = Math.floor(t * 6)
  const inLayer = (t * 6) % 1
  const angle = inLayer * Math.PI * 2 + layer * 0.4
  const radius = 1.2 + layer * 0.55 + hash(i, 4) * 0.35
  out[offset] = Math.cos(angle) * radius
  out[offset + 1] = (layer - 2.5) * 0.55 + (hash(i, 5) - 0.5) * 0.2
  out[offset + 2] = Math.sin(angle) * radius
}

/** Three case-study clusters — work */
function constellations(i: number, _count: number, out: Float32Array, offset: number) {
  const centers = [
    new Vector3(-2.2, 0.4, 0.2),
    new Vector3(2.0, -0.2, -0.4),
    new Vector3(0.1, 1.6, 0.8),
  ]
  const c = centers[i % 3]!
  const r = 0.35 + hash(i, 6) * 0.55
  const theta = hash(i, 7) * Math.PI * 2
  const phi = Math.acos(2 * hash(i, 8) - 1)
  TMP.setFromSphericalCoords(r, phi, theta).add(c)
  out[offset] = TMP.x
  out[offset + 1] = TMP.y
  out[offset + 2] = TMP.z
}

/** Spiral / content stream — about */
function helix(i: number, count: number, out: Float32Array, offset: number) {
  const t = i / count
  const turns = 4.5
  const angle = t * Math.PI * 2 * turns
  const radius = 0.9 + Math.sin(t * Math.PI) * 0.35
  out[offset] = Math.cos(angle) * radius
  out[offset + 1] = (t - 0.5) * 4.2
  out[offset + 2] = Math.sin(angle) * radius
}

/** Tight signature core — end state */
function core(i: number, count: number, out: Float32Array, offset: number) {
  const t = i / Math.max(count - 1, 1)
  const shell = Math.floor(hash(i, 9) * 3)
  const r = 0.55 + shell * 0.35
  const theta = t * Math.PI * 2 * 7 + shell
  const y = Math.cos(t * Math.PI * 3) * (0.9 - shell * 0.15)
  out[offset] = Math.cos(theta) * r * (1 - Math.abs(y) * 0.25)
  out[offset + 1] = y
  out[offset + 2] = Math.sin(theta) * r * (1 - Math.abs(y) * 0.25)
}

const GENERATORS: Record<MorphShape, typeof lattice> = {
  lattice,
  explode,
  constellations,
  helix,
  core,
}

export function createMorphBuffers(count: number, shapes: MorphShape[]): Float32Array[] {
  return shapes.map((shape) => {
    const buf = new Float32Array(count * 3)
    const gen = GENERATORS[shape]
    for (let i = 0; i < count; i++) gen(i, count, buf, i * 3)
    return buf
  })
}

/** Sample between consecutive morph targets using global progress 0→1 */
export function morphWeights(
  progress: number,
  stages: number,
): { a: number; b: number; t: number } {
  const clamped = MathUtils.clamp(progress, 0, 0.9999)
  const scaled = clamped * (stages - 1)
  const a = Math.floor(scaled)
  const b = Math.min(a + 1, stages - 1)
  return { a, b, t: scaled - a }
}

/**
 * Chapter-aligned morph: each stage owns a progress window from CHAPTER_SCRIPT.
 * Falls back to even spacing when windows are omitted.
 */
export function morphWeightsFromWindows(
  progress: number,
  windows: readonly { start: number; end: number }[],
): { a: number; b: number; t: number } {
  if (windows.length < 2) return { a: 0, b: 0, t: 0 }
  const p = MathUtils.clamp(progress, 0, 1)
  for (let i = 0; i < windows.length - 1; i++) {
    const a = windows[i]!
    const b = windows[i + 1]!
    const from = (a.start + a.end) / 2
    const to = (b.start + b.end) / 2
    if (p <= to) {
      const t = MathUtils.clamp((p - from) / Math.max(to - from, 1e-5), 0, 1)
      return { a: i, b: i + 1, t }
    }
  }
  const last = windows.length - 1
  return { a: last, b: last, t: 0 }
}
