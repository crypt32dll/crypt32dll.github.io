'use client'

import dynamic from 'next/dynamic'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'
import { homepage } from '@/content/pages'
import { site } from '@/content/site'
import { t, type Locale } from '@/content/types'

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((m) => m.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-paper" aria-hidden /> },
)

type Props = {
  locale: Locale
}

export function Hero({ locale }: Props) {
  const { hero } = homepage

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <HeroScene />

      <div className="container-site relative z-10 flex min-h-[100dvh] flex-col justify-center pb-20 pt-28">
        <p className="hero-enter font-display text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          {hero.brand}
        </p>
        <h1 className="hero-enter hero-enter-delay-1 mt-5 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.75rem)] font-semibold leading-[1.05] text-ink">
          {t(hero.headline, locale)}
        </h1>
        <p className="hero-enter hero-enter-delay-2 mt-6 max-w-xl text-lg text-ink-muted">
          {t(hero.subline, locale)}
        </p>
        <div className="hero-enter hero-enter-delay-3 mt-10 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/work">
              {t(hero.primaryCta, locale)}
              <ArrowRight weight="bold" className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
              {t(hero.secondaryCta, locale)}
              <ArrowUpRight weight="bold" className="size-4" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
