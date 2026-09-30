import type { LocalizedString } from './types'

export type Project = {
  slug: string
  title: LocalizedString
  summary: LocalizedString
  role: LocalizedString
  stack: string[]
  featured: boolean
  links: { label: LocalizedString; url: string }[]
  body: LocalizedString
  highlights: LocalizedString[]
  /** Optional WebGL vignette on case study pages */
  sceneId?: 'commerce-pipeline' | 'content-lake' | 'platform-graph' | 'performance-pulse'
}

export const projects: Project[] = [
  {
    slug: 'composable-commerce',
    title: {
      de: 'Composable Commerce Plattform',
      en: 'Composable Commerce Platform',
    },
    summary: {
      de: 'Headless Storefront auf Next.js mit Payload CMS — API-first statt Monolith, mit Observability und Deploy auf Vercel.',
      en: 'Headless storefront on Next.js with Payload CMS — API-first instead of a monolith, with observability and deploy on Vercel.',
    },
    role: {
      de: 'Frontend Architect',
      en: 'Frontend Architect',
    },
    stack: ['Next.js', 'TypeScript', 'Payload CMS', 'Sentry', 'Vercel'],
    featured: true,
    sceneId: 'commerce-pipeline',
    links: [],
    body: {
      de: 'Frontend, Backend und CMS bewusst entkoppelt. Für diese Plattform habe ich die Architektur der Storefront, das Content-Modell und die Integrationsschicht verantwortet — mit klaren Schnittstellen statt impliziter Abhängigkeiten. Sentry und Vercel halten Fehlerbilder und Releases messbar. Ergebnis: kürzere Release-Zyklen, unabhängige Teams und die Freiheit, jedes System für seinen Job zu wählen.',
      en: 'Frontend, backend, and CMS deliberately decoupled. For this platform I owned the storefront architecture, content model, and integration layer — clean interfaces instead of implicit coupling. Sentry and Vercel keep error signals and releases measurable. Result: shorter release cycles, independent teams, and the freedom to pick each system for its job.',
    },
    highlights: [
      {
        de: 'API-first Integration von Storefront und Payload CMS',
        en: 'API-first integration of storefront and Payload CMS',
      },
      {
        de: 'Observability mit Sentry und Deploy-Pipeline auf Vercel',
        en: 'Observability with Sentry and deploy pipeline on Vercel',
      },
      {
        de: 'Performance-Budget und Core Web Vitals als Architektur-Constraint',
        en: 'Performance budgets and Core Web Vitals as architectural constraints',
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
      de: 'Content modellieren wie Daten — mit Sanity als Content Lake, angebunden an Shopify und Auth0 für skalierbare, wiederverwendbare Inhalte.',
      en: 'Model content like data — with Sanity as the content lake, connected to Shopify and Auth0 for scalable, reusable content.',
    },
    role: {
      de: 'Frontend Architect · Content Modeling',
      en: 'Frontend Architect · Content Modeling',
    },
    stack: ['Sanity', 'Shopify', 'Auth0', 'Next.js', 'TypeScript', 'Vercel'],
    featured: true,
    sceneId: 'content-lake',
    links: [],
    body: {
      de: 'Structured Content ist der eigentliche Gamechanger — nicht nur das CMS-Produkt selbst. Mit Sanity als Single Source of Truth habe ich Content-Modelle entworfen, die Redaktion, Commerce (Shopify) und Auth (Auth0) verbinden: typisierte Schemas, klare Ownership und Frontend-Consumption über stabile APIs. Ausspielung und Deploy liefen über Next.js auf Vercel.',
      en: 'Structured content is the real game-changer — not just the CMS product itself. With Sanity as the single source of truth I designed content models that connect editorial, commerce (Shopify), and auth (Auth0): typed schemas, clear ownership, and frontend consumption through stable APIs. Delivery and deploy ran on Next.js on Vercel.',
    },
    highlights: [
      {
        de: 'Schema-Design in Sanity für wiederverwendbare Content-Bausteine',
        en: 'Schema design in Sanity for reusable content blocks',
      },
      {
        de: 'Anbindung an Shopify und Auth0 über stabile APIs',
        en: 'Shopify and Auth0 integration through stable APIs',
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
    stack: ['React', 'Vue.js', 'TypeScript', 'Storybook', 'CI/CD'],
    featured: true,
    sceneId: 'platform-graph',
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
    stack: ['Next.js', 'RSC', 'SEO', 'GEO', 'JSON-LD', 'Core Web Vitals'],
    featured: false,
    sceneId: 'performance-pulse',
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
