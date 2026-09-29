import type { LocalizedString } from './types'

export const site = {
  name: 'Fabian Schultz-Fademrecht',
  shortName: 'Fabian Schultz',
  tagline: {
    de: 'Frontend Architect · Composable Systems',
    en: 'Frontend Architect · Composable Systems',
  } satisfies LocalizedString,
  social: {
    linkedin: 'https://www.linkedin.com/in/fabian-schultz-fademrecht-2223162a0/',
    github: 'https://github.com/crypt32dll',
    xing: 'https://www.xing.com/profile/Fabian_SchultzFademrecht',
  },
} as const

export const navItems = [
  { href: '/work', label: { de: 'Arbeit', en: 'Work' } satisfies LocalizedString },
  { href: '/about', label: { de: 'Über mich', en: 'About' } satisfies LocalizedString },
] as const

export const footerNav = [
  { href: '/impressum', label: { de: 'Impressum', en: 'Legal notice' } satisfies LocalizedString },
  {
    href: '/datenschutz',
    label: { de: 'Datenschutz', en: 'Privacy' } satisfies LocalizedString,
  },
] as const
