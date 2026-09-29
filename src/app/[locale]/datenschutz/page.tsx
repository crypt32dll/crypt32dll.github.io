import type { Metadata } from 'next'
import { legal } from '@/content/pages'
import { type Locale, t } from '@/content/types'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: t(legal.datenschutz.title, locale as Locale) }
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale

  return (
    <div className="container-narrow pb-24 pt-28">
      <h1 className="font-display text-4xl font-semibold text-ink">
        {t(legal.datenschutz.title, locale)}
      </h1>
      <pre className="mt-8 whitespace-pre-wrap font-body text-base leading-relaxed text-ink-muted">
        {t(legal.datenschutz.body, locale)}
      </pre>
    </div>
  )
}
