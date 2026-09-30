import { type Locale, routing } from '@/i18n/routing'

export const LOCALE_STORAGE_KEY = 'pref-locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && (routing.locales as readonly string[]).includes(value))
}

export function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    return isLocale(stored) ? stored : null
  } catch {
    return null
  }
}

export function writeStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // private mode / quota
  }
}

/** Prefer stored choice, then browser language, then defaultLocale. */
export function resolvePreferredLocale(): Locale {
  const stored = readStoredLocale()
  if (stored) return stored
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return routing.defaultLocale
}
