'use client'

import { useEffect } from 'react'

/** Registers the static-asset service worker (GitHub Pages cache workaround). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* ignore — private mode / GH Pages quirks */
      })
    }

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(register, { timeout: 4000 })
    } else {
      setTimeout(register, 2000)
    }
  }, [])

  return null
}
