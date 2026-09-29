import { site } from '@/content/site'

export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: 'Senior Frontend Developer | Frontend Architect',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://crypt32dll.github.io',
    sameAs: [site.social.linkedin, site.social.github, site.social.xing],
    knowsAbout: [
      'Frontend Architecture',
      'Composable Architecture',
      'Next.js',
      'React',
      'TypeScript',
      'Payload CMS',
      'Structured Content',
      'Sanity',
      'Storyblok',
      'SEO',
      'GEO',
      'JSON-LD',
      'Core Web Vitals',
      'Three.js',
      'Tailwind CSS',
      'Zod',
      'Internationalization',
      'Jamstack',
    ],
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
