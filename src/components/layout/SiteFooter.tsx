import { GithubLogo, LinkedinLogo } from '@phosphor-icons/react/dist/ssr'
import { Link } from '@/i18n/navigation'
import { footerNav, site } from '@/content/site'
import { t, type Locale } from '@/content/types'

type Props = { locale: Locale }

export function SiteFooter({ locale }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-line/70 bg-paper-elevated">
      <div className="container-site flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-ink">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm text-ink-muted">{t(site.tagline, locale)}</p>
          <p className="mt-4 text-xs text-ink-faint">© {year}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <nav className="flex flex-wrap gap-4 text-sm text-ink-muted" aria-label="Legal">
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-11 py-2 transition-colors hover:text-accent"
              >
                {t(item.label, locale)}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2">
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] text-ink-muted transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              <LinkedinLogo className="size-5" weight="fill" />
            </a>
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] text-ink-muted transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <GithubLogo className="size-5" weight="fill" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
