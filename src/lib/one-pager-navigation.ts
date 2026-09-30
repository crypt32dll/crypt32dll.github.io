import type { LocalizedString } from '@/content/types'

export type SectionId = 'hero' | 'skills' | 'work' | 'about' | 'contact'

export type SectionDef = {
  id: SectionId
  label: LocalizedString
  /** Primary header / mobile nav */
  inHeader: boolean
  /** Side progress dots */
  inProgress: boolean
}

/**
 * Canonical one-pager section registry.
 * Contact is progress-only (CTA block), not header.
 */
export const sections: readonly SectionDef[] = [
  {
    id: 'hero',
    label: { de: 'Start', en: 'Home' },
    inHeader: false,
    inProgress: true,
  },
  {
    id: 'skills',
    label: { de: 'Know-how', en: 'Know-how' },
    inHeader: true,
    inProgress: true,
  },
  {
    id: 'work',
    label: { de: 'Arbeit', en: 'Work' },
    inHeader: true,
    inProgress: true,
  },
  {
    id: 'about',
    label: { de: 'Über mich', en: 'About' },
    inHeader: true,
    inProgress: true,
  },
  {
    id: 'contact',
    label: { de: 'Kontakt', en: 'Contact' },
    inHeader: false,
    inProgress: true,
  },
] as const

export const SECTION_IDS = sections.map((s) => s.id) as SectionId[]

export const headerNavItems = sections.filter((s) => s.inHeader)

export const progressSections = sections.filter((s) => s.inProgress)

export function homeHashHref(locale: string, id: SectionId): string {
  return `/${locale}/#${id}`
}

export function scrollToSection(id: SectionId, behavior: ScrollBehavior = 'smooth'): void {
  document.getElementById(id)?.scrollIntoView({ behavior })
}
