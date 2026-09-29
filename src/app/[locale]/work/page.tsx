import Image from 'next/image'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { projects } from '@/content/projects'
import { workPage } from '@/content/pages'
import { t, type Locale } from '@/content/types'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: t(workPage.title, locale as Locale),
    description: t(workPage.intro, locale as Locale),
  }
}

export default async function WorkPage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  return (
    <div className="container-site pb-24 pt-28">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t(workPage.title, locale)}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{t(workPage.intro, locale)}</p>
      </header>

      <ul className="mt-16 grid gap-14 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/work/${project.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-line/30">
                <Image
                  src={project.coverUrl}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="mt-5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
                {project.year} · {project.stack.slice(0, 3).join(' · ')}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-accent">
                {t(project.title, locale)}
              </h2>
              <p className="mt-2 text-ink-muted">{t(project.summary, locale)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
