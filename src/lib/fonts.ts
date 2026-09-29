import { Archivo, Space_Grotesk } from 'next/font/google'

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const fontVariables = `${archivo.variable} ${spaceGrotesk.variable}`
