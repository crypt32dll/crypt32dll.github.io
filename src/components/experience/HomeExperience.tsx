'use client'

import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Magnetic } from '@/components/experience/CustomCursor'
import { ExperienceCanvas } from '@/components/experience/ExperienceCanvas'
import { IntroLoader } from '@/components/experience/IntroLoader'
import { ScrollDirector } from '@/components/experience/ScrollDirector'
import { AboutPortrait } from '@/components/layout/AboutPortrait'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Button } from '@/components/ui/Button'
import type { aboutPage, homepage as homepageContent } from '@/content/pages'
import type { Project } from '@/content/projects'
import { site } from '@/content/site'
import { type Locale, t } from '@/content/types'

type Homepage = typeof homepageContent
type About = typeof aboutPage

type Props = {
  locale: Locale
  homepage: Homepage
  about: About
  projects: Project[]
}

export function HomeExperience({ locale, homepage, about, projects }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [unveiled, setUnveiled] = useState(false)
  const onLoaderDone = useCallback(() => setUnveiled(true), [])
  const { hero } = homepage

  useEffect(() => {
    if (!unveiled) return
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [unveiled])

  return (
    <div ref={root} className="relative">
      <IntroLoader locale={locale} onComplete={onLoaderDone} />
      <ExperienceCanvas />
      <ScrollDirector root={root} enabled={unveiled} />

      <section
        id="hero"
        data-chapter="hero"
        className="relative z-10 flex min-h-[100dvh] flex-col justify-end pb-20 pt-28 md:justify-center md:pb-28"
      >
        <div className="container-site copy-over-stage">
          <p
            data-reveal
            className="font-display text-sm font-semibold uppercase tracking-[0.32em] text-accent md:text-base"
          >
            {hero.brand}
          </p>
          <div className="hero-clip mt-5 overflow-hidden md:mt-7">
            <h1
              data-reveal
              data-split-headline
              className="max-w-[14ch] font-display text-[clamp(3.1rem,9vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-ink"
            >
              {t(hero.headline, locale)}
            </h1>
          </div>
          <p data-reveal className="mt-7 max-w-md text-lg text-ink/88 md:mt-9 md:text-xl">
            {t(hero.subline, locale)}
          </p>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-3 md:mt-12">
            <Magnetic>
              <Button asChild>
                <a href="#work" data-cursor="magnetic">
                  {t(hero.primaryCta, locale)}
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent-on/20">
                    <ArrowRight weight="bold" className="size-4" aria-hidden />
                  </span>
                </a>
              </Button>
            </Magnetic>
            <Magnetic strength={0.28}>
              <Button asChild variant="secondary">
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnetic"
                >
                  {t(hero.secondaryCta, locale)}
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-ink/10">
                    <ArrowUpRight weight="bold" className="size-4" aria-hidden />
                  </span>
                </a>
              </Button>
            </Magnetic>
          </div>
          <p
            data-reveal
            className="mt-14 hidden font-display text-xs uppercase tracking-[0.22em] text-ink-faint md:block"
          >
            {locale === 'de' ? 'Scroll — System entfaltet sich' : 'Scroll — the system unfolds'}
          </p>
        </div>
      </section>

      <section
        id="skills"
        data-chapter="skills"
        className="section-cv relative z-10 min-h-[100dvh] py-[var(--space-section)]"
      >
        <div className="container-site copy-over-stage">
          <div data-reveal className="max-w-2xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {t(homepage.skillsTitle, locale)}
            </p>
            <h2
              data-split-headline
              className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] text-ink"
            >
              {t(homepage.skillsIntro, locale)}
            </h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {homepage.skills.map((skill, index) => (
              <li key={skill.title.de} data-reveal className="glass-panel flex flex-col p-5 md:p-6">
                <p className="font-display text-[0.65rem] tabular-nums tracking-[0.18em] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {t(skill.title, locale)}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/90">
                  {t(skill.body, locale)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="work" data-chapter="work" className="relative z-10">
        <div className="container-site copy-over-stage py-[var(--space-section)] pb-10 md:pb-14">
          <div data-reveal className="max-w-xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {t(homepage.workTitle, locale)}
            </p>
            <h2
              data-split-headline
              className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] text-ink"
            >
              {t(homepage.workIntro, locale)}
            </h2>
          </div>
        </div>
        {/* Pin target — horizontal scrub happens while this stage sits mid-viewport */}
        <div data-work-pin className="relative flex h-[100dvh] items-center overflow-hidden">
          <ul
            data-work-rail
            className="work-rail flex w-max gap-6 px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] md:gap-8"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                density="teaser"
                reveal
                className="w-[min(78vw,22rem)] shrink-0 md:w-[24rem]"
              />
            ))}
          </ul>
        </div>
      </section>

      <section
        id="about"
        data-chapter="about"
        className="section-cv relative z-10 py-[var(--space-section)]"
      >
        <div className="container-site copy-over-stage">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div data-reveal className="max-w-xl">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {site.name}
              </p>
              <h2
                data-split-headline
                className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold text-ink"
              >
                {t(about.title, locale)}
              </h2>
              <p className="mt-5 text-lg text-ink/90">{t(about.intro, locale)}</p>
            </div>
            <div data-reveal className="about-portrait-frame">
              <AboutPortrait />
            </div>
          </div>

          <div data-reveal className="glass-panel mt-20 max-w-3xl p-6 md:p-8">
            <h3 className="font-display text-2xl font-semibold text-ink">
              {t(about.timelineTitle, locale)}
            </h3>
            <ol className="mt-8 space-y-0 border-l border-line">
              {about.timeline.map((item) => (
                <li
                  key={item.period}
                  className="relative py-8 pl-8 first:pt-0"
                  data-parallax-depth="0.12"
                >
                  <span
                    className="absolute top-10 left-[-4px] size-2 rounded-full bg-accent first:top-2"
                    aria-hidden
                  />
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {item.period}
                  </p>
                  <h4 className="mt-2 font-display text-xl font-semibold text-ink">
                    {t(item.title, locale)}
                  </h4>
                  {'org' in item && item.org ? (
                    <p className="mt-1 text-sm text-ink-muted">{item.org}</p>
                  ) : null}
                  <p className="mt-3 max-w-2xl text-ink/90">{t(item.body, locale)}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
            <div data-reveal className="glass-panel p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {t(about.educationTitle, locale)}
              </h3>
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
            <div data-reveal className="glass-panel p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {t(about.languagesTitle, locale)}
              </h3>
              <ul className="mt-6 space-y-4">
                {about.languages.map((lang) => (
                  <li
                    key={lang.name.de}
                    className="flex items-baseline justify-between border-t border-line/80 pt-4"
                  >
                    <span className="font-display font-medium text-ink">
                      {t(lang.name, locale)}
                    </span>
                    <span className="font-display text-sm text-ink/80">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <h3 data-reveal className="font-display text-2xl font-semibold text-ink">
              {t(about.stackTitle, locale)}
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {about.stack.map((tech) => (
                <li
                  key={tech}
                  data-reveal
                  className="border border-line bg-paper-elevated/60 px-3 py-2 font-display text-sm font-medium text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="contact"
        data-chapter="contact"
        className="section-cv relative z-10 border-t border-line/60 py-[var(--space-section)]"
      >
        <div className="container-site copy-over-stage grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div data-reveal>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Contact
            </p>
            <h2
              data-split-headline
              className="mt-4 max-w-xl font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold text-ink"
            >
              {locale === 'de'
                ? 'Lass uns composable Systeme bauen.'
                : 'Let’s build composable systems.'}
            </h2>
          </div>
          <div data-reveal className="flex flex-wrap gap-3 md:justify-end">
            <Magnetic>
              <Button asChild>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnetic"
                >
                  LinkedIn
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent-on/20">
                    <ArrowUpRight weight="bold" className="size-4" aria-hidden />
                  </span>
                </a>
              </Button>
            </Magnetic>
            <Magnetic strength={0.28}>
              <Button asChild variant="secondary">
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnetic"
                >
                  GitHub
                </a>
              </Button>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}
