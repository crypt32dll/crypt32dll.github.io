'use client'

import type { Locale } from '@/content/types'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const labels: Record<Locale, string> = { de: 'DE', en: 'EN' }

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const next: Locale = locale === 'de' ? 'en' : 'de'

  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-[var(--radius)] border border-line px-2 font-display text-xs font-semibold tracking-wider text-ink-muted transition-colors hover:border-accent hover:text-accent',
      )}
      aria-label={locale === 'de' ? 'Switch to English' : 'Auf Deutsch umschalten'}
      onClick={() => router.replace(pathname, { locale: next })}
    >
      {labels[next]}
    </button>
  )
}
