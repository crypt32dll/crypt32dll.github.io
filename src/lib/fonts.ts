import { Archivo, Space_Grotesk } from 'next/font/google'

export const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-archivo',
  display: 'swap',
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const fontVariables = `${archivo.variable} ${spaceGrotesk.variable}`
