import type { Metadata } from 'next'
import { Archivo, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { type Locale, routing } from '@/i18n/routing'
import '../globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://crypt32dll.github.io'),
  title: {
    default: 'Fabian Schultz-Fademrecht — Frontend Architect',
    template: '%s · Fabian Schultz',
  },
  description:
    'Senior Frontend Developer & Frontend Architect. Composable architectures, structured content, Next.js.',
  icons: { icon: '/favicon.png' },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
