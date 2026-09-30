import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectCaseStudy } from '@/components/experience/projects/ProjectCaseStudy'
import { content } from '@/content/repository'
import { t } from '@/content/types'
import { resolveLocale } from '@/i18n/params'
import { routing } from '@/i18n/routing'
import { pageMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    content.listProjects().map((project) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale = await resolveLocale(params)
  const project = content.getProject(slug)
  if (!project) return {}
  return pageMetadata({
    locale,
    path: `work/${project.slug}`,
    title: `${t(project.title, locale)} — Case Study`,
    description: t(project.summary, locale),
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const locale = await resolveLocale(params)
  const project = content.getProject(slug)
  if (!project) notFound()

  return <ProjectCaseStudy project={project} locale={locale} />
}
