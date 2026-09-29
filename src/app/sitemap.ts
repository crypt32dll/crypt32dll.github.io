import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crypt32dll.github.io'

const paths = ['', '/work', '/about', '/contact', '/impressum', '/datenschutz'] as const

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}/`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      })
    }
    for (const project of projects) {
      entries.push({
        url: `${siteUrl}/${locale}/work/${project.slug}/`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return entries
}
