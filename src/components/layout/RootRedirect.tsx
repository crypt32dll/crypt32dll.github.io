'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { resolvePreferredLocale, writeStoredLocale } from '@/lib/locale-preference'

/** Client redirect for GitHub Pages static root (no middleware). */
export function RootRedirect() {
  useEffect(() => {
    const locale = resolvePreferredLocale()
    writeStoredLocale(locale)
    window.location.replace(`/${locale}/`)
  }, [])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-paper px-6 text-center text-ink">
      <p className="font-display text-lg font-semibold">Fabian Schultz-Fademrecht</p>
      <p className="text-sm text-ink-muted">Redirecting…</p>
      <nav className="flex gap-6 text-sm" aria-label="Language">
        <Link
          className="underline decoration-accent underline-offset-4 hover:text-accent"
          href="/de/"
          onClick={() => writeStoredLocale('de')}
        >
          Deutsch
        </Link>
        <Link
          className="underline decoration-accent underline-offset-4 hover:text-accent"
          href="/en/"
          onClick={() => writeStoredLocale('en')}
        >
          English
        </Link>
      </nav>
    </main>
  )
}
