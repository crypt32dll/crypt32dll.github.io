import { headerNavItems } from '@/lib/one-pager-navigation'

export const site = {
  name: 'Fabian Schultz-Fademrecht',
  shortName: 'Fabian',
  tagline: {
    de: 'Frontend Architect · Composable Systems',
    en: 'Frontend Architect · Composable Systems',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/fabian-schultz-fademrecht-2223162a0/',
    github: 'https://github.com/crypt32dll',
    xing: 'https://www.xing.com/profile/Fabian_SchultzFademrecht',
  },
} as const

/** @deprecated Prefer `headerNavItems` from `@/lib/one-pager-navigation` */
export const navItems = headerNavItems.map((item) => ({
  href: `/#${item.id}`,
  hash: item.id,
  label: item.label,
}))

export const footerNav = [
  { href: '/impressum', label: { de: 'Impressum', en: 'Legal notice' } },
  {
    href: '/datenschutz',
    label: { de: 'Datenschutz', en: 'Privacy' },
  },
] as const
