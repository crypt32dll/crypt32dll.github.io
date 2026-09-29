import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { type Locale, routing } from '@/i18n/routing'

export function localeStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return locale
}
