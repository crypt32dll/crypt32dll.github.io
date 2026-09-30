'use client'

import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { cn } from '@/lib/utils'

type CursorMode = 'default' | 'magnetic' | 'view' | 'drag'

function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return fine
}

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
        // Size comes from CSS per mode — avoid scaling the label out of the ring
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

type MagneticProps = {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  useEffect(() => {
    const el = root.current
    if (!el || reduced || !fine) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.45,
        ease: 'power3.out',
      })
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'power3.out' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, fine, strength])

  return (
    <div
      ref={root}
      className={cn('inline-flex will-change-transform', className)}
      data-cursor="magnetic"
    >
      {children}
    </div>
  )
}
