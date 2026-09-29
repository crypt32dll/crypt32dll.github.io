import { Archivo, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
