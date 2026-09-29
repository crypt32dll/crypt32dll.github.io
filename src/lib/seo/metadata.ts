import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crypt32dll.github.io'

export function localeAlternates(locale: Locale, path = ''): Metadata['alternates'] {
  const normalized = path.replace(/\/$/, '')
  const suffix = normalized ? `${normalized}/` : ''

  return {
    canonical: `${siteUrl}/${locale}/${suffix}`,
    languages: {
      de: `${siteUrl}/de/${suffix}`,
      en: `${siteUrl}/en/${suffix}`,
      'x-default': `${siteUrl}/de/${suffix}`,
    },
  }
}

export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale
  path?: string
  title: string
  description: string
  absoluteTitle?: boolean
}): Metadata {
  const url = `${siteUrl}/${locale}/${path ? `${path.replace(/\/$/, '')}/` : ''}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
      url,
    },
  }
}
