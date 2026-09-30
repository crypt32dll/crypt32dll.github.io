'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import { useFinePointer } from '@/lib/use-fine-pointer'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { cn } from '@/lib/utils'

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

/** Pointer pull — fine pointers only. GSAP loads on demand. */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  useEffect(() => {
    const el = root.current
    if (!el || reduced || !fine) return

    let cancelled = false
    let onMove: ((e: PointerEvent) => void) | undefined
    let onLeave: (() => void) | undefined

    void import('gsap').then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      const node = root.current
      onMove = (e: PointerEvent) => {
        const rect = node.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsap.to(node, {
          x: x * strength,
          y: y * strength,
          duration: 0.45,
          ease: 'power3.out',
        })
      }
      onLeave = () => {
        gsap.to(node, { x: 0, y: 0, duration: 0.55, ease: 'power3.out' })
      }
      node.addEventListener('pointermove', onMove)
      node.addEventListener('pointerleave', onLeave)
    })

    return () => {
      cancelled = true
      if (onMove) el.removeEventListener('pointermove', onMove)
      if (onLeave) el.removeEventListener('pointerleave', onLeave)
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
