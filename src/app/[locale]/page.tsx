import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { Link } from '@/i18n/navigation'
import { getFeaturedProjects, type Project } from '@/content/projects'
import { homepage } from '@/content/pages'
import { Hero } from '@/components/layout/Hero'
import { Button } from '@/components/ui/Button'
import { t, type Locale } from '@/content/types'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  const featured = getFeaturedProjects()

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
              <ProjectTeaser key={project.slug} project={project} locale={locale} />
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
              src="/images/portrait/about-editorial.jpg"
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

function ProjectTeaser({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <li>
      <Link href={`/work/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-line/30">
          <Image
            src={project.coverUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <p className="mt-4 font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {project.year} · {t(project.role, locale)}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent">
          {t(project.title, locale)}
        </h3>
        <p className="mt-2 text-sm text-ink-muted">{t(project.summary, locale)}</p>
      </Link>
    </li>
  )
}
