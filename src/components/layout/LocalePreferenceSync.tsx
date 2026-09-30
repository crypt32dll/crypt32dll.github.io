'use client'

import { useEffect } from 'react'
import type { Locale } from '@/i18n/routing'
import { writeStoredLocale } from '@/lib/locale-preference'

/** Persist the active URL locale so `/` can restore it later. */
export function LocalePreferenceSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    writeStoredLocale(locale)
  }, [locale])

  return null
}
