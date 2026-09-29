import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Fabian Schultz-Fademrecht',
  icons: { icon: '/favicon.png' },
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
