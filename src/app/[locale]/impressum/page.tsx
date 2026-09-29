import type { Metadata } from 'next'
import { content } from '@/content/repository'
import { t } from '@/content/types'
import { localeStaticParams, resolveLocale } from '@/i18n/params'
import { pageMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return localeStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const legal = content.getLegal()
  return pageMetadata({
    locale,
    path: 'impressum',
    title: t(legal.impressum.title, locale),
    description: t(legal.impressum.title, locale),
  })
}

export default async function ImpressumPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const legal = content.getLegal()

  return (
    <div className="container-narrow pb-24 pt-28">
      <h1 className="font-display text-4xl font-semibold text-ink">
        {t(legal.impressum.title, locale)}
      </h1>
      <pre className="mt-8 whitespace-pre-wrap font-body text-base leading-relaxed text-ink-muted">
        {t(legal.impressum.body, locale)}
      </pre>
    </div>
  )
}
