/**
 * Device orientation → normalized pointer for the WebGL stage (mobile).
 * iOS requires a user gesture + requestPermission before events fire.
 */

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1)
  )
}

type DeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>
}

/** Call from a tap handler before enabling full motion on iOS. */
export async function requestDeviceOrientationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  const DOE = DeviceOrientationEvent as DeviceOrientationConstructor
  if (typeof DOE.requestPermission === 'function') {
    try {
      const result = await DOE.requestPermission()
      return result === 'granted'
    } catch {
      return false
    }
  }
  return true
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Map device tilt to the same -1…1 range as pointermove.
 * Assumes phone held roughly upright (beta ≈ 45–65°).
 */
export function orientationToPointer(
  beta: number | null,
  gamma: number | null,
): { x: number; y: number } | null {
  if (beta == null || gamma == null || Number.isNaN(beta) || Number.isNaN(gamma)) {
    return null
  }
  const x = clamp(gamma / 32, -1, 1)
  const y = clamp((beta - 55) / 36, -1, 1)
  return { x: x || 0, y: -(y || 0) || 0 }
}
