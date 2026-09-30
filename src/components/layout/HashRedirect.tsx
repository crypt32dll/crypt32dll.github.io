'use client'

import { useEffect } from 'react'

type Props = {
  locale: string
  hash: string
}

/** HTTP redirects drop URL hashes — jump client-side instead. */
export function HashRedirect({ locale, hash }: Props) {
  useEffect(() => {
    window.location.replace(`/${locale}/#${hash}`)
  }, [locale, hash])

  return (
    <p className="px-6 py-24 text-center text-ink-muted" role="status">
      Redirecting…
    </p>
  )
}
