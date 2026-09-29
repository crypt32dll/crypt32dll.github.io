'use client'

import { List, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import { Button } from '@/components/ui/Button'
import { navItems, site } from '@/content/site'
import { type Locale, t } from '@/content/types'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type Props = { locale: Locale }

export function SiteHeader({ locale }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-paper/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-tight text-ink transition-colors hover:text-accent"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-display text-sm font-medium transition-colors',
                  active ? 'text-accent' : 'text-ink-muted hover:text-ink',
                )}
              >
                {t(item.label, locale)}
              </Link>
            )
          })}
          <LocaleSwitcher locale={locale} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
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
              <X className="size-5" weight="bold" />
            ) : (
              <List className="size-5" weight="bold" />
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
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-11 px-2 py-3 font-display text-base font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  {t(item.label, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
