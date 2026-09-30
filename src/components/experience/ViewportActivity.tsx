'use client'

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react'

const ViewportPlayContext = createContext(true)

/** True while the nearest ViewportActivity host intersects the viewport. */
export function useViewportPlay(): boolean {
  return useContext(ViewportPlayContext)
}

type Props = {
  children: ReactNode
  /** Expand when this far from the viewport (IntersectionObserver rootMargin). */
  rootMargin?: string
  /** Kept for call-site labels; no longer passed to React Activity. */
  name?: string
  className?: string
}

/**
 * Keeps children mounted and signals play/pause via context when off-screen.
 * Nested PortfolioCanvas reads useViewportPlay() and sets frameloop accordingly.
 *
 * Avoids React 19.2 <Activity> — DevTools currently asserts on hidden→visible
 * ("The children should not have changed if we pass in the same set").
 */
export function ViewportActivity({ children, rootMargin = '25% 0px', className }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setPlaying(entry.isIntersecting)
      },
      { rootMargin, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div ref={host} className={className}>
      <ViewportPlayContext.Provider value={playing}>{children}</ViewportPlayContext.Provider>
    </div>
  )
}
