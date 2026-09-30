'use client'

import { ArrowLeft } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef, ViewTransition } from 'react'
import {
  ProjectExperience,
  type ProjectSceneId,
} from '@/components/experience/projects/ProjectExperience'
import { Button } from '@/components/ui/Button'
import type { Project } from '@/content/projects'
import { type Locale, t } from '@/content/types'
import { Link } from '@/i18n/navigation'
import { useReducedMotion } from '@/lib/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  project: Project
  locale: Locale
}

export function ProjectCaseStudy({ project, locale }: Props) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const sceneId = project.sceneId as ProjectSceneId | undefined
  const sharedName = `project-${project.slug}`

  useEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const reveals = el.querySelectorAll<HTMLElement>('[data-case-reveal]')
    gsap.set(reveals, { opacity: 0, y: 28 })
    const triggers = Array.from(reveals).map((node) =>
      ScrollTrigger.create({
        trigger: node,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(node, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' })
        },
      }),
    )
    return () => {
      for (const tr of triggers) {
        tr.kill()
      }
    }
  }, [reduced])

  return (
    <article ref={root} className="pb-24">
      <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-16 pt-20 md:pb-20 md:pt-24">
        <ViewTransition name={sharedName} share="project-morph" default="none">
          <div data-project-hero className="absolute inset-0">
            <Image
              src={project.coverUrl}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/85 to-paper/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper/90 via-paper/55 to-transparent md:via-paper/40" />

        <ViewTransition
          enter={{
            'nav-forward': 'page-fade-in',
            'project-open': 'page-fade-in',
            'nav-back': 'page-fade-in',
            default: 'none',
          }}
          exit={{
            'nav-forward': 'page-fade-out',
            'project-open': 'page-fade-out',
            'nav-back': 'page-fade-out',
            default: 'none',
          }}
          default="none"
        >
          <div className="container-site relative z-10" data-project-hero-copy>
            <Link
              href="/work"
              transitionTypes={['nav-back']}
              className="inline-flex min-h-11 items-center gap-2 font-display text-sm text-ink/80 transition-colors hover:text-accent"
              data-cursor="magnetic"
            >
              <ArrowLeft className="size-4" weight="bold" />
              {locale === 'de' ? 'Alle Projekte' : 'All projects'}
            </Link>

            <p className="mt-10 font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {t(project.role, locale)}
            </p>
            <h1 className="mt-3 max-w-[16ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink">
              {t(project.title, locale)}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/90 md:text-xl">
              {t(project.summary, locale)}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {project.stack.slice(0, 5).map((tech) => (
                <li
                  key={tech}
                  className="rounded-[var(--radius)] border border-line/80 bg-paper/50 px-2.5 py-1 font-display text-xs text-ink/85 backdrop-blur-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </ViewTransition>
      </section>

      <div className="container-site mt-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div data-case-reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-ink/90">
              {t(project.body, locale)}
            </p>
            <ul className="mt-8 space-y-3">
              {project.highlights.map((item) => (
                <li
                  key={item.de}
                  className="border-l-2 border-accent/70 pl-4 text-ink/90"
                  data-case-reveal
                >
                  {t(item, locale)}
                </li>
              ))}
            </ul>
          </div>
          <aside data-case-reveal className="space-y-6">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Stack
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-[var(--radius)] border border-line px-3 py-1.5 font-display text-sm text-ink"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            {project.links.length ? (
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <Button key={link.url} asChild variant="secondary">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {t(link.label, locale)}
                    </a>
                  </Button>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {sceneId ? (
        <div
          data-case-reveal
          className="relative mt-20 aspect-[21/9] overflow-hidden rounded-[var(--radius)] border border-line/60 bg-paper-elevated/40"
        >
          <ProjectExperience sceneId={sceneId} className="absolute inset-0 h-full w-full" />
        </div>
      ) : null}
    </article>
  )
}
