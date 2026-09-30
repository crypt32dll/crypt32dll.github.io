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
  return pageMetadata({
    locale,
    path: 'work',
    title: locale === 'de' ? 'Arbeit' : 'Work',
    description:
      locale === 'de'
        ? 'Ausgewählte Projekte — composable Systeme, Structured Content, Frontend Platforms.'
        : 'Selected work — composable systems, structured content, frontend platforms.',
  })
}

export default async function WorkIndexPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const projects = content.listProjects()
  const copy = content.getWorkPage()

  return (
    <div className="pb-24 pt-28">
      <div className="container-site">
        <header className="max-w-2xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t(copy.title, locale)}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold text-ink">
            {t(copy.intro, locale)}
          </h1>
        </header>
        <ul className="mt-14 grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              density="index"
              className="border border-line/70 bg-paper-elevated/40 p-4"
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
