'use client'

import { List, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import { PreferenceControls } from '@/components/layout/PreferenceControls'
import { Button } from '@/components/ui/Button'
import { site } from '@/content/site'
import { type Locale, t } from '@/content/types'
import { Link, usePathname } from '@/i18n/navigation'
import { homeHashHref, type SectionId, scrollToSection } from '@/lib/one-pager-navigation'
import { cn } from '@/lib/utils'

type Props = { locale: Locale }

const nav = [
  { id: 'skills' as const, kind: 'hash' as const, label: { de: 'Know-how', en: 'Know-how' } },
  {
    id: 'work' as const,
    kind: 'route' as const,
    href: '/work',
    label: { de: 'Arbeit', en: 'Work' },
  },
  {
    id: 'about' as const,
    kind: 'route' as const,
    href: '/about',
    label: { de: 'Über mich', en: 'About' },
  },
]

function goToSection(locale: Locale, onHome: boolean, id: SectionId) {
  if (onHome) {
    scrollToSection(id)
  } else {
    window.location.href = homeHashHref(locale, id)
  }
}

export function SiteHeader({ locale }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const onHome = pathname === '/' || pathname === ''
  // Case studies lead with cover + WebGL — hide chrome so the stage owns the viewport
  const hideOnCaseStudy = /^\/work\/.+/.test(pathname)

  if (hideOnCaseStudy) return null

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/50 bg-paper/70 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-tight text-ink transition-colors hover:text-accent"
          onClick={() => setOpen(false)}
        >
          {site.shortName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((item) =>
            item.kind === 'route' ? (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'font-display text-sm font-medium transition-colors',
                  pathname.startsWith(item.href) ? 'text-accent' : 'text-ink-muted hover:text-ink',
                )}
                onClick={() => setOpen(false)}
              >
                {t(item.label, locale)}
              </Link>
            ) : (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-display text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                onClick={(event) => {
                  event.preventDefault()
                  goToSection(locale, onHome, item.id)
                }}
              >
                {t(item.label, locale)}
              </a>
            ),
          )}
          <PreferenceControls />
          <LocaleSwitcher locale={locale} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <PreferenceControls />
          <LocaleSwitcher locale={locale} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5" weight="bold" aria-hidden />
            ) : (
              <List className="size-5" weight="bold" aria-hidden />
            )}
          </Button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-line/60 bg-paper px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                {item.kind === 'route' ? (
                  <Link
                    href={item.href}
                    className="block min-h-11 px-2 py-3 font-display text-base font-medium text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {t(item.label, locale)}
                  </Link>
                ) : (
                  <a
                    href={`#${item.id}`}
                    className="block min-h-11 px-2 py-3 font-display text-base font-medium text-ink"
                    onClick={(event) => {
                      event.preventDefault()
                      setOpen(false)
                      goToSection(locale, onHome, item.id)
                    }}
                  >
                    {t(item.label, locale)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
