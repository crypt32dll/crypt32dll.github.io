import Image from 'next/image'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { aboutPage } from '@/content/pages'
import { routing } from '@/i18n/routing'
import { t, type Locale } from '@/content/types'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: t(aboutPage.title, locale as Locale),
    description: t(aboutPage.intro, locale as Locale),
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  return (
    <div className="pb-24 pt-28">
      <div className="container-site">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <header className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              {t(aboutPage.title, locale)}
            </h1>
            <p className="mt-5 text-lg text-ink-muted">{t(aboutPage.intro, locale)}</p>
          </header>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-line/30 lg:mx-0 lg:justify-self-end">
            <Image
              src="/images/portrait/avatar.jpg"
              alt="Fabian Schultz-Fademrecht"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 28rem"
              priority
            />
          </div>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {t(aboutPage.timelineTitle, locale)}
          </h2>
          <ol className="mt-8 space-y-0 border-l border-line">
            {aboutPage.timeline.map((item) => (
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
              {t(aboutPage.educationTitle, locale)}
            </h2>
            <ul className="mt-6 space-y-6">
              {aboutPage.education.map((item) => (
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
              {t(aboutPage.languagesTitle, locale)}
            </h2>
            <ul className="mt-6 space-y-3">
              {aboutPage.languages.map((lang) => (
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
            {t(aboutPage.stackTitle, locale)}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {aboutPage.stack.map((tech) => (
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
