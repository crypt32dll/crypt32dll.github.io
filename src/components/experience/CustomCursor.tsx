'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useFinePointer } from '@/lib/use-fine-pointer'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type CursorMode = 'default' | 'magnetic' | 'view' | 'drag'

export function CustomCursor() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const enabled = fine && !reduced
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const mode = useRef<CursorMode>('default')

  useEffect(() => {
    if (!enabled) return

    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    const setMode = (next: CursorMode, text = '') => {
      mode.current = next
      if (ring.current) {
        ring.current.dataset.mode = next
      }
      if (label.current) {
        label.current.textContent = text
        label.current.style.opacity = text ? '1' : '0'
      }
    }

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null
      if (!el) {
        setMode('default')
        return
      }
      const kind = (el.dataset.cursor as CursorMode) || 'magnetic'
      setMode(kind, el.dataset.cursorLabel ?? '')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })

    let raf = 0
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.32
      pos.current.y += (target.current.y - pos.current.y) * 0.32
      const lagX = pos.current.x + (target.current.x - pos.current.x) * 0.45
      const lagY = pos.current.y + (target.current.y - pos.current.y) * 0.45

      if (dot.current) {
        gsap.set(dot.current, {
          x: target.current.x,
          y: target.current.y,
          opacity: mode.current === 'view' ? 0 : 1,
          scale: mode.current === 'view' ? 0 : 1,
        })
      }
      if (ring.current) {
        gsap.set(ring.current, { x: lagX, y: lagY })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="custom-cursor" aria-hidden>
      <div ref={dot} className="custom-cursor__dot" />
      <div ref={ring} className="custom-cursor__ring" data-mode="default">
        <span ref={label} className="custom-cursor__label" />
      </div>
    </div>
  )
}

/** @deprecated Import from `@/components/experience/Magnetic` */
export { Magnetic } from '@/components/experience/Magnetic'
