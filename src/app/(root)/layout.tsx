import type { Metadata } from 'next'
import { Archivo, Space_Grotesk } from 'next/font/google'
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
  title: 'Fabian Schultz-Fademrecht',
  icons: { icon: '/favicon.png' },
}

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
