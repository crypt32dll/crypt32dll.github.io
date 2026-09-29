import Image from 'next/image'
import type { Project } from '@/content/projects'
import { type Locale, t } from '@/content/types'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type Density = 'teaser' | 'index'

type ProjectCardProps = {
  project: Project
  locale: Locale
  density?: Density
}

const aspect: Record<Density, string> = {
  teaser: 'aspect-[4/3]',
  index: 'aspect-[16/10]',
}

const titleSize: Record<Density, string> = {
  teaser: 'text-xl',
  index: 'text-2xl',
}

const imageSizes: Record<Density, string> = {
  teaser: '(max-width: 768px) 100vw, 33vw',
  index: '(max-width: 768px) 100vw, 50vw',
}

export function ProjectCard({ project, locale, density = 'teaser' }: ProjectCardProps) {
  const meta =
    density === 'teaser' ? t(project.role, locale) : project.stack.slice(0, 3).join(' · ')

  return (
    <li>
      <Link href={`/work/${project.slug}`} className="group block">
        <div className={cn('relative overflow-hidden bg-line/30', aspect[density])}>
          <Image
            src={project.coverUrl}
            alt=""
            fill
            className="motion-safe-transform object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={imageSizes[density]}
          />
        </div>
        <p className="mt-4 font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
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
        <p className={cn('mt-2 text-ink-muted', density === 'teaser' ? 'text-sm' : '')}>
          {t(project.summary, locale)}
        </p>
      </Link>
    </li>
  )
}
