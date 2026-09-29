import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { PreferencesProvider } from '@/components/layout/PreferencesProvider'
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { localeStaticParams } from '@/i18n/params'
import { type Locale, routing } from '@/i18n/routing'
import { fontVariables } from '@/lib/fonts'
import { preferencesBootstrapScript } from '@/lib/preferences'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://crypt32dll.github.io'),
  title: {
    default: 'Fabian Schultz-Fademrecht — Frontend Architect',
    template: '%s · Fabian Schultz-Fademrecht',
  },
  description:
    'Senior Frontend Developer & Frontend Architect. Composable architectures, structured content, Next.js, Payload CMS.',
  icons: { icon: '/favicon.png' },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return localeStaticParams()
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: paramLocale } = await params

  if (!hasLocale(routing.locales, paramLocale)) {
    notFound()
  }

  const locale = (await getLocale()) as Locale
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={fontVariables}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          // Prevent theme/motion flash before hydration.
          dangerouslySetInnerHTML={{ __html: preferencesBootstrapScript }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PreferencesProvider>
            <PersonJsonLd />
            <div className="flex min-h-dvh flex-col">
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-on"
              >
                Skip to content
              </a>
              <SiteHeader locale={locale} />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter locale={locale} />
            </div>
            <ServiceWorkerRegister />
          </PreferencesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
