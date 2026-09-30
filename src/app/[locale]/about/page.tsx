import type { Metadata } from 'next'
import { AboutPageView } from '@/components/experience/AboutPageView'
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
  const about = content.getAbout()
  return pageMetadata({
    locale,
    path: 'about',
    title: t(about.title, locale),
    description: t(about.intro, locale),
  })
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const about = content.getAbout()
  return <AboutPageView locale={locale} about={about} />
}
