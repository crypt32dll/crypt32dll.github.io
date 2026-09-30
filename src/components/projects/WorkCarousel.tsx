'use client'

import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ProjectCard } from '@/components/projects/ProjectCard'
import type { Project } from '@/content/projects'
import type { Locale } from '@/content/types'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { cn } from '@/lib/utils'

type Props = {
  projects: Project[]
  locale: Locale
}

const DRAG_THRESHOLD = 8
const FLICK_VELOCITY = 0.35

const arrowClass = cn(
  'absolute top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center',
  'rounded-[var(--radius)] border border-ink/20 bg-paper-elevated/90 text-ink backdrop-blur-sm',
  'transition-colors hover:border-accent hover:text-accent',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
  'disabled:pointer-events-none disabled:opacity-30',
)

function nearestStopIndex(stops: number[], offset: number) {
  let best = 0
  let bestDist = Number.POSITIVE_INFINITY
  for (let i = 0; i < stops.length; i++) {
    const dist = Math.abs(stops[i]! - offset)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

export function WorkCarousel({ projects, locale }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [stops, setStops] = useState<number[]>([0])
  const [maxTravel, setMaxTravel] = useState(0)
  const [dragOffset, setDragOffset] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const reduced = useReducedMotion()

  const drag = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startOffset: 0,
    currentOffset: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: false,
  })

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const cards = Array.from(track.children) as HTMLElement[]
    if (!cards.length) {
      setStops([0])
      setMaxTravel(0)
      return
    }

    const styles = getComputedStyle(track)
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 24
    const padL = Number.parseFloat(styles.paddingLeft) || 0
    const widths = cards.map((card) => card.getBoundingClientRect().width)
    // Padding lives on the track so trailing inset scrolls into view with the last card
    const travel = Math.max(0, track.scrollWidth - viewport.clientWidth)

    const positions: number[] = [0]
    let acc = padL
    for (let i = 0; i < widths.length - 1; i++) {
      acc += widths[i]! + gap
      const stop = acc - padL
      if (stop <= travel + 0.5) positions.push(stop)
      else break
    }
    if (travel > 0 && positions[positions.length - 1]! < travel - 0.5) {
      positions.push(travel)
    }

    setStops(positions)
    setMaxTravel(travel)
    setIndex((current) => Math.min(current, positions.length - 1))
  }, [])

  useEffect(() => {
    measure()
    const viewport = viewportRef.current
    if (!viewport) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(viewport)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [measure, projects.length])

  const maxIndex = Math.max(0, stops.length - 1)
  const settled = stops[Math.min(index, maxIndex)] ?? 0
  const offset = dragOffset ?? settled
  const atStart = index <= 0 && dragOffset === null
  const atEnd = index >= maxIndex && dragOffset === null

  const go = (dir: -1 | 1) => {
    setIndex((current) => Math.min(maxIndex, Math.max(0, current + dir)))
  }

  const finishDrag = useCallback(() => {
    const state = drag.current
    if (!state.active) return

    const wasMoved = state.moved
    const current = wasMoved ? state.currentOffset : settled
    let next = nearestStopIndex(stops, current)

    if (wasMoved && Math.abs(state.velocity) >= FLICK_VELOCITY) {
      next = state.velocity > 0 ? Math.max(0, next - 1) : Math.min(maxIndex, next + 1)
    }

    setIndex(next)
    setDragOffset(null)
    setDragging(false)
    state.active = false
    state.pointerId = -1
    state.velocity = 0

    if (wasMoved) {
      window.setTimeout(() => {
        drag.current.moved = false
      }, 50)
    }
  }, [settled, stops, maxIndex])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || maxTravel <= 0) return
    const state = drag.current
    state.active = true
    state.pointerId = event.pointerId
    state.startX = event.clientX
    state.startOffset = settled
    state.currentOffset = settled
    state.lastX = event.clientX
    state.lastT = performance.now()
    state.velocity = 0
    state.moved = false
    // Do not capture yet — capture would steal the click from card Links.
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state.active || event.pointerId !== state.pointerId) return

    const dx = event.clientX - state.startX
    if (!state.moved && Math.abs(dx) < DRAG_THRESHOLD) return

    if (!state.moved) {
      state.moved = true
      setDragging(true)
      // Capture only once we are actually dragging
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    const now = performance.now()
    const dt = Math.max(1, now - state.lastT)
    state.velocity = ((event.clientX - state.lastX) / dt) * 16
    state.lastX = event.clientX
    state.lastT = now

    let next = state.startOffset - dx
    if (next < 0) next *= 0.35
    else if (next > maxTravel) next = maxTravel + (next - maxTravel) * 0.35

    state.currentOffset = next
    setDragOffset(next)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state.active || event.pointerId !== state.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    finishDrag()
  }

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.moved) return
    event.preventDefault()
    event.stopPropagation()
    drag.current.moved = false
  }

  return (
    <div className="work-carousel relative">
      <button
        type="button"
        className={cn(arrowClass, 'left-[max(0.5rem,calc((100vw-72rem)/2-0.25rem))]')}
        aria-label={locale === 'de' ? 'Vorheriges Projekt' : 'Previous project'}
        disabled={atStart}
        onClick={() => go(-1)}
      >
        <CaretLeft weight="bold" className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        className={cn(arrowClass, 'right-[max(0.5rem,calc((100vw-72rem)/2-0.25rem))]')}
        aria-label={locale === 'de' ? 'Nächstes Projekt' : 'Next project'}
        disabled={atEnd}
        onClick={() => go(1)}
      >
        <CaretRight weight="bold" className="size-5" aria-hidden />
      </button>

      <div
        ref={viewportRef}
        className={cn(
          'overflow-hidden',
          'touch-pan-y cursor-grab active:cursor-grabbing',
          dragging && 'select-none',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <ul
          ref={trackRef}
          className={cn(
            'flex w-max items-stretch gap-6 px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] md:gap-8',
            !reduced &&
              !dragging &&
              'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          )}
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              density="teaser"
              reveal
              className="w-[min(78vw,22rem)] shrink-0 md:w-[24rem]"
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
