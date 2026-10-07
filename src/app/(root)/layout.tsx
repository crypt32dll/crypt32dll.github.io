import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Fabian Schultz-Fademrecht',
  icons: { icon: '/favicon.png' },
  // Google Search Console verifies the domain root (`/`), not locale pages.
  verification: {
    google: 'X8faXOtKHppt-hBYr2X_aCgG2y-lbpAR25fo2FI_Xy0',
  },
}

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={fontVariables}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
