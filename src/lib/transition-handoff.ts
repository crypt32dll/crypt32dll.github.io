/** Handoff for project-card ↔ case-study zoom transitions. */

export type ZoomHandoff = {
  src: string
  slug: string
  top: number
  left: number
  width: number
  height: number
}

let pendingIn: ZoomHandoff | null = null
let pendingOut: ZoomHandoff | null = null
/** Last forward-zoom origin — used as fallback target when zooming back. */
let lastOrigin: ZoomHandoff | null = null
let outgoingLayer: HTMLDivElement | null = null

export function setZoomHandoff(handoff: ZoomHandoff): void {
  pendingIn = handoff
  lastOrigin = handoff
}

export function peekZoomHandoff(): ZoomHandoff | null {
  return pendingIn
}

export function consumeZoomHandoff(): ZoomHandoff | null {
  const next = pendingIn
  pendingIn = null
  return next
}

/** Call from case-study back control before navigation. */
export function setZoomOutHandoff(
  handoff: Pick<ZoomHandoff, 'src' | 'slug'> & Partial<ZoomHandoff>,
): void {
  pendingOut = {
    src: handoff.src,
    slug: handoff.slug,
    top: handoff.top ?? 0,
    left: handoff.left ?? 0,
    width: handoff.width ?? (typeof window !== 'undefined' ? window.innerWidth : 0),
    height: handoff.height ?? (typeof window !== 'undefined' ? window.innerHeight : 0),
  }
}

export function consumeZoomOutHandoff(): ZoomHandoff | null {
  const next = pendingOut
  pendingOut = null
  return next
}

export function getLastZoomOrigin(): ZoomHandoff | null {
  return lastOrigin
}

export function clearZoomHandoff(): void {
  pendingIn = null
  pendingOut = null
}

/**
 * Freeze a visual clone of the current shell before Next swaps the route.
 * WebGL canvases are snapshotted to images — empty/hidden canvases were showing
 * as a black void around the zooming card.
 */
export function captureOutgoingSnapshot(): void {
  if (typeof document === 'undefined') return
  releaseOutgoingSnapshot()

  const shell = document.querySelector<HTMLElement>('[data-app-shell]')
  if (!shell) return

  // Capture live WebGL pixels BEFORE cloning (clone would be an empty canvas)
  const stageBitmaps = new Map<Element, string>()
  shell.querySelectorAll<HTMLElement>('[data-experience-stage]').forEach((stage) => {
    const canvas = stage.querySelector('canvas')
    if (!canvas) return
    try {
      if (canvas.width > 0 && canvas.height > 0) {
        stageBitmaps.set(stage, canvas.toDataURL('image/jpeg', 0.82))
      }
    } catch {
      // ignore tainted / unavailable frames
    }
  })

  const layer = document.createElement('div')
  layer.className = 'page-transition-outgoing'
  layer.setAttribute('aria-hidden', 'true')

  const scroll = document.createElement('div')
  scroll.className = 'page-transition-outgoing__scroll'
  scroll.style.transform = `translateY(${-window.scrollY}px)`

  const clone = shell.cloneNode(true) as HTMLElement
  clone.removeAttribute('data-app-shell')
  clone.querySelectorAll('script').forEach((node) => {
    node.remove()
  })
  clone.querySelectorAll('[data-cursor]').forEach((node) => {
    node.removeAttribute('data-cursor')
  })

  // Map cloned stages to bitmaps by index (DOM order matches)
  const liveStages = shell.querySelectorAll('[data-experience-stage]')
  const clonedStages = clone.querySelectorAll('[data-experience-stage]')
  clonedStages.forEach((stage, index) => {
    const live = liveStages[index]
    const dataUrl = live ? stageBitmaps.get(live) : undefined
    const host = stage as HTMLElement
    host.querySelectorAll('canvas').forEach((node) => {
      node.remove()
    })
    if (dataUrl) {
      const img = document.createElement('img')
      img.src = dataUrl
      img.alt = ''
      img.className = 'page-transition-stage-freeze'
      img.draggable = false
      host.appendChild(img)
    }
  })

  scroll.appendChild(clone)
  layer.appendChild(scroll)
  document.body.appendChild(layer)
  outgoingLayer = layer
}

/** Hide the clicked card in the frozen snapshot so the zoom clone isn't doubled. */
export function markOriginCardHidden(slug: string): void {
  if (!outgoingLayer) return
  const card = outgoingLayer.querySelector(`[data-project-card="${slug}"]`)
  card?.classList.add('is-transition-origin')
}

export function hasOutgoingSnapshot(): boolean {
  return Boolean(outgoingLayer?.isConnected)
}

export function getOutgoingSnapshot(): HTMLDivElement | null {
  return outgoingLayer?.isConnected ? outgoingLayer : null
}

export function releaseOutgoingSnapshot(): void {
  if (!outgoingLayer) return
  outgoingLayer.remove()
  outgoingLayer = null
}
