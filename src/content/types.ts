import type { Locale } from '@/i18n/routing'

export type { Locale }

export type LocalizedString = Record<Locale, string>

export function t(value: LocalizedString, locale: Locale): string {
  return value[locale] ?? value.de
}
