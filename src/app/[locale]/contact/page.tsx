import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { ContactForm } from '@/components/forms/ContactForm'
import { contactPage } from '@/content/pages'
import { site } from '@/content/site'
import { routing } from '@/i18n/routing'
import { t, type Locale } from '@/content/types'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: t(contactPage.title, locale as Locale),
    description: t(contactPage.intro, locale as Locale),
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  return (
    <div className="container-site pb-24 pt-28">
      <header className="max-w-xl">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t(contactPage.title, locale)}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{t(contactPage.intro, locale)}</p>
        <p className="mt-4 text-sm text-ink-faint">
          <a className="underline decoration-line underline-offset-4 hover:text-accent" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
      </header>

      <div className="mt-12 max-w-xl">
        <ContactForm locale={locale} />
      </div>
    </div>
  )
}
