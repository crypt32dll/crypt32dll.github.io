import type { LocalizedString } from './types'

export type Project = {
  slug: string
  title: LocalizedString
  summary: LocalizedString
  role: LocalizedString
  year: string
  stack: string[]
  featured: boolean
  coverUrl: string
  links: { label: LocalizedString; url: string }[]
  body: LocalizedString
  highlights: LocalizedString[]
}

export const projects: Project[] = [
  {
    slug: 'composable-commerce',
    title: {
      de: 'Composable Commerce Plattform',
      en: 'Composable Commerce Platform',
    },
    summary: {
      de: 'Headless Storefront auf Next.js mit entkoppeltem CMS, Commerce und Auth — API-first statt Monolith.',
      en: 'Headless storefront on Next.js with decoupled CMS, commerce, and auth — API-first instead of a monolith.',
    },
    role: {
      de: 'Frontend Architect',
      en: 'Frontend Architect',
    },
    year: '2024',
    stack: ['Next.js', 'TypeScript', 'Payload CMS', 'Sanity', 'Shopify', 'Auth0', 'Vercel'],
    featured: true,
    coverUrl: '/images/studio/studio-1.webp',
    links: [],
    body: {
      de: 'Frontend, Backend, CMS, Commerce und Auth bewusst entkoppelt. Für diese Plattform habe ich die Architektur der Storefront, das Content-Modell und die Integrationsschicht verantwortet — mit klaren Schnittstellen statt impliziter Abhängigkeiten. Ergebnis: kürzere Release-Zyklen, unabhängige Teams und die Freiheit, jedes System für seinen Job zu wählen.',
      en: 'Frontend, backend, CMS, commerce, and auth deliberately decoupled. For this platform I owned the storefront architecture, content model, and integration layer — clean interfaces instead of implicit coupling. Result: shorter release cycles, independent teams, and the freedom to pick each system for its job.',
    },
    highlights: [
      {
        de: 'API-first Integration von Commerce, CMS und Auth',
        en: 'API-first integration of commerce, CMS, and auth',
      },
      {
        de: 'Performance-Budget und Core Web Vitals als Architektur-Constraint',
        en: 'Performance budgets and Core Web Vitals as architectural constraints',
      },
      {
        de: 'Wiederverwendbare UI- und Content-Bausteine für mehrere Brands',
        en: 'Reusable UI and content building blocks across brands',
      },
    ],
  },
  {
    slug: 'structured-content',
    title: {
      de: 'Structured Content & Content Lake',
      en: 'Structured Content & Content Lake',
    },
    summary: {
      de: 'Content modellieren wie Daten — mit Headless CMS wie Payload und Sanity als Content Lake für skalierbare, wiederverwendbare Inhalte.',
      en: 'Model content like data — with headless CMS like Payload and Sanity as a content lake for scalable, reusable content.',
    },
    role: {
      de: 'Frontend Architect · Content Modeling',
      en: 'Frontend Architect · Content Modeling',
    },
    year: '2025',
    stack: ['Payload CMS', 'Sanity', 'Next.js', 'TypeScript', 'Zod'],
    featured: true,
    coverUrl: '/images/studio/studio-3.webp',
    links: [],
    body: {
      de: 'Structured Content ist der eigentliche Gamechanger — nicht das CMS-Produkt selbst. Ich habe Content-Modelle entworfen, die Redaktion, Entwicklung und Mehrkanal-Ausspielung verbinden: typisierte Schemas, klare Ownership und Frontend-Consumption über stabile APIs. Der Content Lake wird zur Single Source of Truth für Web, Apps und Kampagnen.',
      en: 'Structured content is the real game-changer — not the CMS product itself. I designed content models that connect editorial, engineering, and multi-channel delivery: typed schemas, clear ownership, and frontend consumption through stable APIs. The content lake becomes the single source of truth for web, apps, and campaigns.',
    },
    highlights: [
      {
        de: 'Schema-Design für wiederverwendbare Content-Bausteine',
        en: 'Schema design for reusable content blocks',
      },
      {
        de: 'Typsichere Consumption im Frontend mit Validierung',
        en: 'Type-safe frontend consumption with validation',
      },
      {
        de: 'Editorial Workflows ohne technische Schulden',
        en: 'Editorial workflows without technical debt',
      },
    ],
  },
  {
    slug: 'frontend-platform',
    title: {
      de: 'Frontend Platform & Design System',
      en: 'Frontend Platform & Design System',
    },
    summary: {
      de: 'Gemeinsame Basis für mehrere Produktfrontends: Design Tokens, Komponenten, Lint-Gates und Deploy-Pipelines.',
      en: 'Shared foundation for multiple product frontends: design tokens, components, lint gates, and deploy pipelines.',
    },
    role: {
      de: 'Senior Frontend Developer · Platform',
      en: 'Senior Frontend Developer · Platform',
    },
    year: '2023',
    stack: ['React', 'Vue.js', 'TypeScript', 'Storybook', 'CI/CD'],
    featured: true,
    coverUrl: '/images/studio/studio-5.webp',
    links: [],
    body: {
      de: 'Über Jahre habe ich Frontend-Teams dabei unterstützt, von Projekt-Silos zu einer gemeinsamen Plattform zu kommen. Dazu gehören konsistente Tooling-Standards, wiederverwendbare Komponenten, Performance-Leitplanken und klare Ownership — damit Features schneller landen, ohne Qualität zu opfern.',
      en: 'Over the years I have helped frontend teams move from project silos to a shared platform. That includes consistent tooling standards, reusable components, performance guardrails, and clear ownership — so features ship faster without sacrificing quality.',
    },
    highlights: [
      {
        de: 'Design-System mit Tokens und dokumentierten Patterns',
        en: 'Design system with tokens and documented patterns',
      },
      {
        de: 'CI-Gates für Accessibility, Bundle-Größe und Tests',
        en: 'CI gates for accessibility, bundle size, and tests',
      },
      {
        de: 'Onboarding und Architektur-Reviews für Produktteams',
        en: 'Onboarding and architecture reviews for product teams',
      },
    ],
  },
  {
    slug: 'performance-architecture',
    title: {
      de: 'Performance Architecture',
      en: 'Performance Architecture',
    },
    summary: {
      de: 'LCP, INP und CLS als feste Architektur-Ziele — nicht als Afterthought nach dem Launch.',
      en: 'LCP, INP, and CLS as fixed architectural goals — not an afterthought after launch.',
    },
    role: {
      de: 'Frontend Architect',
      en: 'Frontend Architect',
    },
    year: '2024',
    stack: ['Next.js', 'RSC', 'SEO', 'GEO', 'JSON-LD', 'Core Web Vitals'],
    featured: false,
    coverUrl: '/images/atmosphere/city.webp',
    links: [],
    body: {
      de: 'Frontend Performance ist für mich kein Tuning-Sprint, sondern Teil der Architektur: Streaming, Caching-Strategien, kritische Rendering-Pfade und messbare Budgets. Ich setze CWV-Ziele früh, instrumentiere sie und halte sie über Releases hinweg.',
      en: 'Frontend performance is not a tuning sprint for me — it is part of the architecture: streaming, caching strategies, critical rendering paths, and measurable budgets. I set CWV targets early, instrument them, and hold them across releases.',
    },
    highlights: [
      {
        de: 'Messbare Budgets in CI und Monitoring',
        en: 'Measurable budgets in CI and monitoring',
      },
      {
        de: 'Streaming SSR und gezielte Client-Hydration',
        en: 'Streaming SSR and selective client hydration',
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
