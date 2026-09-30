'use client'

import { AboutPortrait } from '@/components/layout/AboutPortrait'
import type { aboutPage } from '@/content/pages'
import { site } from '@/content/site'
import { type Locale, t } from '@/content/types'

type About = typeof aboutPage

type Props = {
  locale: Locale
  about: About
}

export function AboutPageView({ locale, about }: Props) {
  return (
    <div className="pb-24 pt-28">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {site.name}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold text-ink">
              {t(about.title, locale)}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/90">{t(about.intro, locale)}</p>
          </div>
          <div className="about-portrait-frame">
            <AboutPortrait />
          </div>
        </div>

        <div className="mt-20 max-w-3xl">
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
                <p className="mt-3 max-w-2xl text-ink/90">{t(item.body, locale)}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {t(about.educationTitle, locale)}
            </h2>
            <ul className="mt-6 space-y-6">
              {about.education.map((item) => (
                <li key={item.period} className="border-t border-line/80 pt-5">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {item.period}
                  </p>
                  <p className="mt-2 font-display font-semibold text-ink">
                    {t(item.title, locale)}
                  </p>
                  <p className="mt-1 text-sm text-ink/85">{item.org}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {t(about.languagesTitle, locale)}
            </h2>
            <ul className="mt-6 space-y-4">
              {about.languages.map((lang) => (
                <li
                  key={lang.name.de}
                  className="flex items-baseline justify-between border-t border-line/80 pt-4"
                >
                  <span className="font-display font-medium text-ink">{t(lang.name, locale)}</span>
                  <span className="font-display text-sm text-ink/80">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {t(about.stackTitle, locale)}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {about.stack.map((tech) => (
              <li
                key={tech}
                className="border border-line bg-paper-elevated/60 px-3 py-2 font-display text-sm font-medium text-ink"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
