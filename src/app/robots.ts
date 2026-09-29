import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crypt32dll.github.io'
const allowIndexing = process.env.ALLOW_SEARCH_INDEXING !== 'false'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: allowIndexing ? '/' : undefined,
      disallow: allowIndexing ? undefined : '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
