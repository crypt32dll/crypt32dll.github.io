'use client'

import { ViewTransition } from 'react'
import { ProjectCover } from '@/components/projects/ProjectCover'
import type { Project } from '@/content/projects'
import { type Locale, t } from '@/content/types'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type Density = 'teaser' | 'index'

type ProjectCardProps = {
  project: Project
  locale: Locale
  density?: Density
  className?: string
  reveal?: boolean
}

const aspect: Record<Density, string> = {
  teaser: 'aspect-[4/3]',
  index: 'aspect-[16/10]',
}

const titleSize: Record<Density, string> = {
  teaser: 'text-xl',
  index: 'text-2xl',
}

export function ProjectCard({
  project,
  locale,
  density = 'teaser',
  className,
  reveal = false,
}: ProjectCardProps) {
  const meta =
    density === 'teaser' ? t(project.role, locale) : project.stack.slice(0, 3).join(' · ')
  const isTeaser = density === 'teaser'
  const sharedName = `project-${project.slug}`

  return (
    <li
      className={cn(isTeaser && 'flex', className)}
      data-project-card={project.slug}
      {...(reveal ? { 'data-reveal': '' } : {})}
    >
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={['nav-forward', 'project-open']}
        className={cn(
          'group block',
          isTeaser &&
            'work-carousel-card glass-panel flex h-full w-full flex-col overflow-hidden p-3',
        )}
        data-cursor="view"
        data-cursor-label={locale === 'de' ? 'Mehr' : 'View'}
        draggable={false}
      >
        <ViewTransition name={sharedName} share="project-morph" default="none">
          <div
            data-project-thumb
            className={cn(
              'relative shrink-0 overflow-hidden bg-line/30',
              aspect[density],
              isTeaser && 'rounded-[0.2rem]',
            )}
          >
            <ProjectCover
              slug={project.slug}
              className="motion-safe-transform transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </ViewTransition>
        <div className={cn(isTeaser ? 'flex flex-1 flex-col px-1 pb-1 pt-3.5' : '')}>
          <p
            className={cn(
              'font-display text-xs font-semibold uppercase tracking-[0.16em]',
              isTeaser ? 'text-ink-muted' : 'mt-4 text-ink-faint',
            )}
          >
            {meta}
          </p>
          <h3
            className={cn(
              'mt-2 font-display font-semibold text-ink transition-colors group-hover:text-accent',
              titleSize[density],
            )}
          >
            {t(project.title, locale)}
          </h3>
          <p
            className={cn(
              'mt-2 leading-relaxed',
              isTeaser ? 'flex-1 text-sm text-ink/88' : 'text-ink-muted',
            )}
          >
            {t(project.summary, locale)}
          </p>
        </div>
      </Link>
    </li>
  )
}
