import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Hero } from '@/components/layout/Hero'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Button } from '@/components/ui/Button'
import { content } from '@/content/repository'
import { t } from '@/content/types'
import { Link } from '@/i18n/navigation'
import { localeStaticParams, resolveLocale } from '@/i18n/params'
import { pageMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return localeStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const homepage = content.getHomepage()
  return pageMetadata({
    locale,
    title: 'Fabian Schultz-Fademrecht — Frontend Architect | Composable Systems',
    description: t(homepage.hero.subline, locale),
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params)
  const homepage = content.getHomepage()
  const featured = content.listFeaturedProjects()

  return (
    <>
      <Hero locale={locale} />

      <section className="container-site py-[var(--space-section)]">
        <div className="reveal-on-scroll max-w-2xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t(homepage.skillsTitle, locale)}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
            {t(homepage.skillsIntro, locale)}
          </h2>
        </div>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2">
          {homepage.skills.map((skill) => (
            <li key={skill.title.de} className="reveal-on-scroll border-t border-line pt-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                {t(skill.title, locale)}
              </h3>
              <p className="mt-3 text-ink-muted">{t(skill.body, locale)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line/70 bg-paper-elevated/60 py-[var(--space-section)]">
        <div className="container-site">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {t(homepage.workTitle, locale)}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                {t(homepage.workIntro, locale)}
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/work">
                {t(homepage.workCta, locale)}
                <ArrowUpRight className="size-4" weight="bold" />
              </Link>
            </Button>
          </div>

          <ul className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} density="teaser" />
            ))}
          </ul>
        </div>
      </section>

      <section className="container-site py-[var(--space-section)]">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t(homepage.aboutTeaser.title, locale)}
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink md:text-4xl">
              {t(homepage.aboutTeaser.body, locale)}
            </h2>
            <div className="mt-8">
              <Button asChild>
                <Link href="/about">{t(homepage.aboutTeaser.cta, locale)}</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-line/40">
            <Image
              src="/images/portrait/about-editorial.webp"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority={false}
            />
          </div>
        </div>
      </section>
    </>
  )
}
