import type { Metadata } from 'next'
import { AboutPortrait } from '@/components/layout/AboutPortrait'
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
    title: t(about.metaTitle, locale),
    description: t(about.intro, locale),
  })
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const about = content.getAbout()

  return (
    <div className="pb-24 pt-28">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <header className="max-w-2xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Fabian Schultz-Fademrecht
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
              {t(about.title, locale)}
            </h1>
            <p className="mt-5 text-lg text-ink-muted">{t(about.intro, locale)}</p>
          </header>
          <AboutPortrait />
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {t(about.timelineTitle, locale)}
          </h2>
          <ol className="mt-8 space-y-0 border-l border-line">
            {about.timeline.map((item) => (
              <li key={item.period} className="relative py-8 pl-8 first:pt-0">
                <span
                  className="absolute top-10 left-[-4px] size-2 rounded-full bg-accent first:top-2"
                  aria-hidden
                />
                <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {item.period}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {t(item.title, locale)}
                </h3>
                {'org' in item && item.org ? (
                  <p className="mt-1 text-sm text-ink-muted">{item.org}</p>
                ) : null}
                <p className="mt-3 max-w-2xl text-ink-muted">{t(item.body, locale)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {t(about.educationTitle, locale)}
            </h2>
            <ul className="mt-6 space-y-6">
              {about.education.map((item) => (
                <li key={item.period} className="border-t border-line pt-5">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
                    {item.period}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                    {t(item.title, locale)}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.org}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {t(about.languagesTitle, locale)}
            </h2>
            <ul className="mt-6 space-y-3">
              {about.languages.map((lang) => (
                <li
                  key={lang.level}
                  className="flex items-baseline justify-between border-t border-line pt-3"
                >
                  <span className="font-display font-medium text-ink">{t(lang.name, locale)}</span>
                  <span className="text-sm text-ink-muted">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {t(about.stackTitle, locale)}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {about.stack.map((tech) => (
              <li
                key={tech}
                className="border border-line bg-paper-elevated px-3 py-2 font-display text-sm font-medium text-ink"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
