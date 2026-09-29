import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { content } from '@/content/repository'
import { t } from '@/content/types'
import { Link } from '@/i18n/navigation'
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

  return (
    <article className="pb-24 pt-28">
      <div className="container-site">
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" weight="bold" />
          {locale === 'de' ? 'Alle Projekte' : 'All projects'}
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {project.year} · {t(project.role, locale)}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            {t(project.title, locale)}
          </h1>
          <p className="mt-5 text-lg text-ink-muted">{t(project.summary, locale)}</p>
        </header>

        <div className="relative mt-12 aspect-[16/9] overflow-hidden bg-line/30">
          <Image
            src={project.coverUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_16rem]">
          <div className="container-narrow mx-0 max-w-2xl space-y-6 text-ink-muted">
            <p className="text-lg leading-relaxed text-ink">{t(project.body, locale)}</p>
            <ul className="space-y-3 border-t border-line pt-6">
              {project.highlights.map((item) => (
                <li key={item.de} className="flex gap-3 text-ink">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {t(item, locale)}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit border border-line bg-paper-elevated/80 p-6">
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-line px-2.5 py-1 font-display text-xs font-medium text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  )
}
