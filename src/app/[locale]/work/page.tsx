import type { Metadata } from 'next'
import { ProjectCard } from '@/components/projects/ProjectCard'
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
  const work = content.getWorkPage()
  return pageMetadata({
    locale,
    path: 'work',
    title: t(work.metaTitle, locale),
    description: t(work.intro, locale),
  })
}

export default async function WorkPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const work = content.getWorkPage()
  const projects = content.listProjects()

  return (
    <div className="container-site pb-24 pt-28">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t(work.title, locale)}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{t(work.intro, locale)}</p>
      </header>

      <ul className="mt-16 grid gap-14 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} density="index" />
        ))}
      </ul>
    </div>
  )
}
