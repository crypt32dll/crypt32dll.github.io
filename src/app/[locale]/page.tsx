import type { Metadata } from 'next'
import { HomeExperience } from '@/components/experience/HomeExperience'
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
  const homepage = content.getHomepage()
  return pageMetadata({
    locale,
    title: 'Fabian Schultz-Fademrecht — Frontend Architect | Composable Systems',
    description: t(homepage.hero.subline, locale),
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params)
  const homepage = content.getHomepage()
  const about = content.getAbout()
  const projects = content.listProjects()

  return <HomeExperience locale={locale} homepage={homepage} about={about} projects={projects} />
}
