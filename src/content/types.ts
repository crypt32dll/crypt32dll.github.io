export type Locale = 'de' | 'en'

export type LocalizedString = Record<Locale, string>

export function t(value: LocalizedString, locale: Locale): string {
  return value[locale] ?? value.de
}
