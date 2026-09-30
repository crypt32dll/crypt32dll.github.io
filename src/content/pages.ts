import type { LocalizedString } from './types'

export const homepage = {
  hero: {
    brand: 'Fabian Schultz-Fademrecht',
    headline: {
      de: 'Skalierbare Frontends. Composable by design.',
      en: 'Scalable frontends. Composable by design.',
    } satisfies LocalizedString,
    subline: {
      de: 'Senior Frontend Developer & Frontend Architect. Ich baue API-first Systeme aus Next.js, Headless CMS und klaren Schnittstellen.',
      en: 'Senior Frontend Developer & Frontend Architect. I build API-first systems from Next.js, headless CMS, and clean interfaces.',
    } satisfies LocalizedString,
    primaryCta: {
      de: 'Projekte ansehen',
      en: 'View work',
    } satisfies LocalizedString,
    secondaryCta: {
      de: 'LinkedIn',
      en: 'LinkedIn',
    } satisfies LocalizedString,
  },
  skillsTitle: {
    de: 'Know-how',
    en: 'Know-how',
  } satisfies LocalizedString,
  skillsIntro: {
    de: 'Rund 15 Jahre Softwareentwicklung — von Web und Daten bis composable Systeme.',
    en: 'About 15 years in software — from web and data to composable systems.',
  } satisfies LocalizedString,
  skills: [
    {
      title: { de: 'Composable Architecture', en: 'Composable Architecture' },
      body: {
        de: 'Frontend, CMS, Commerce und Auth entkoppeln — Systeme reden über APIs, nicht über implizite Abhängigkeiten.',
        en: 'Decouple frontend, CMS, commerce, and auth — systems talk through APIs, not implicit dependencies.',
      },
    },
    {
      title: { de: 'Structured Content & CMS', en: 'Structured Content & CMS' },
      body: {
        de: 'Content wie Daten modellieren: Payload CMS, Sanity, Storyblok — typisierte Schemas, Page Builder und Mehrkanal-Ausspielung.',
        en: 'Model content like data: Payload CMS, Sanity, Storyblok — typed schemas, page builders, and multi-channel delivery.',
      },
    },
    {
      title: { de: 'SEO & GEO', en: 'SEO & GEO' },
      body: {
        de: 'Technisches SEO, strukturierte Daten (JSON-LD), Sitemaps und Generative Engine Optimization — Inhalte so aufbereiten, dass Menschen und KI-Systeme sie finden und zitieren.',
        en: 'Technical SEO, structured data (JSON-LD), sitemaps, and Generative Engine Optimization — content structured so people and AI systems can find and cite it.',
      },
    },
    {
      title: { de: 'Frontend Performance', en: 'Frontend Performance' },
      body: {
        de: 'Core Web Vitals, Streaming, Caching und Bundle-Disziplin als feste Architektur-Constraints.',
        en: 'Core Web Vitals, streaming, caching, and bundle discipline as fixed architectural constraints.',
      },
    },
    {
      title: { de: 'Motion & 3D', en: 'Motion & 3D' },
      body: {
        de: 'Gezielte Motion und WebGL mit Three.js / React Three Fiber — Präsenz ohne Ballast, inkl. prefers-reduced-motion.',
        en: 'Intentional motion and WebGL with Three.js / React Three Fiber — presence without bloat, including prefers-reduced-motion.',
      },
    },
    {
      title: { de: 'Modern Stack', en: 'Modern Stack' },
      body: {
        de: 'TypeScript, Next.js, React, Vue.js, Tailwind, Zod, i18n, Static Export / GitHub Pages und Vercel — Tech-Freedom statt Vendor-Lock-in.',
        en: 'TypeScript, Next.js, React, Vue.js, Tailwind, Zod, i18n, static export / GitHub Pages, and Vercel — tech freedom over vendor lock-in.',
      },
    },
  ],
  workTitle: {
    de: 'Ausgewählte Arbeit',
    en: 'Selected work',
  } satisfies LocalizedString,
  workIntro: {
    de: 'Case Studies aus Architektur, Content-Modellierung und Plattform-Arbeit.',
    en: 'Case studies from architecture, content modeling, and platform work.',
  } satisfies LocalizedString,
  workCta: {
    de: 'Alle Projekte',
    en: 'All projects',
  } satisfies LocalizedString,
  aboutTeaser: {
    title: {
      de: 'Über mich',
      en: 'About',
    } satisfies LocalizedString,
    body: {
      de: 'Fachinformatiker Anwendungsentwicklung. Fokus: skalierbare Web- und Datenanwendungen mit modernem Frontend.',
      en: 'Certified application developer. Focus: scalable web and data applications with a modern frontend.',
    } satisfies LocalizedString,
    cta: {
      de: 'Mehr erfahren',
      en: 'Learn more',
    } satisfies LocalizedString,
  },
}

export const aboutPage = {
  title: { de: 'Über mich', en: 'About' } satisfies LocalizedString,
  metaTitle: {
    de: 'Über mich — Frontend Architect',
    en: 'About — Frontend Architect',
  } satisfies LocalizedString,
  intro: {
    de: 'Ich entwickle skalierbare Web- und Datenanwendungen mit Fokus auf moderne Frontend-Architekturen, Structured Content und composable Systeme.',
    en: 'I build scalable web and data applications with a focus on modern frontend architectures, structured content, and composable systems.',
  } satisfies LocalizedString,
  timelineTitle: {
    de: 'Werdegang',
    en: 'Career',
  } satisfies LocalizedString,
  timeline: [
    {
      period: '2015 — heute',
      title: {
        de: 'Senior Frontend Developer | Frontend Architect',
        en: 'Senior Frontend Developer | Frontend Architect',
      },
      body: {
        de: 'Architektur und Umsetzung skalierbarer Frontends, Headless-Integrationen und Content-Plattformen für Enterprise-Kunden.',
        en: 'Architecture and delivery of scalable frontends, headless integrations, and content platforms for enterprise clients.',
      },
    },
    {
      period: '2014 — 2014',
      title: { de: 'Frontend Developer', en: 'Frontend Developer' },
      org: 'Pixelgenau Consulting GmbH',
      body: {
        de: 'Frontend-Umsetzung und UI-Entwicklung in Kundenprojekten.',
        en: 'Frontend implementation and UI development on client projects.',
      },
    },
    {
      period: '2012 — 2014',
      title: { de: 'Junior Developer', en: 'Junior Developer' },
      org: 'EOL Intermedia GmbH',
      body: {
        de: 'Einstieg in professionelle Webentwicklung und produktnahe Frontend-Arbeit.',
        en: 'Entry into professional web development and product-facing frontend work.',
      },
    },
  ],
  educationTitle: {
    de: 'Ausbildung',
    en: 'Education',
  } satisfies LocalizedString,
  education: [
    {
      period: '2009 — 2012',
      title: {
        de: 'Fachinformatiker Anwendungsentwicklung',
        en: 'IT Specialist — Application Development',
      },
      org: 'Hochtaunusschule Oberursel',
    },
    {
      period: '2006 — 2009',
      title: {
        de: 'Assistent Informatik (Wirtschaftsinformatik)',
        en: 'IT Assistant (Business Informatics)',
      },
      org: 'Kaufmännische Schule des Wetteraukreises, Bad Nauheim',
    },
  ],
  stackTitle: {
    de: 'Technologie',
    en: 'Technology',
  } satisfies LocalizedString,
  stack: [
    'TypeScript',
    'JavaScript',
    'React',
    'Next.js',
    'Vue.js',
    'Payload CMS',
    'Sanity',
    'Storyblok',
    'Tailwind CSS',
    'Three.js',
    'Zod',
    'next-intl',
    'SEO',
    'GEO',
    'JSON-LD',
    'Core Web Vitals',
    'Biome',
    'Vitest',
    'GitHub Pages',
    'Vercel',
    'Jamstack',
    'Composable Architecture',
    'Frontend Performance',
  ],
  languagesTitle: {
    de: 'Sprachen',
    en: 'Languages',
  } satisfies LocalizedString,
  languages: [
    { name: { de: 'Deutsch', en: 'German' }, level: 'C2' },
    { name: { de: 'Englisch', en: 'English' }, level: 'B1–B2' },
  ],
}

export const workPage = {
  title: { de: 'Arbeit', en: 'Work' } satisfies LocalizedString,
  metaTitle: {
    de: 'Projekte & Case Studies',
    en: 'Projects & Case Studies',
  } satisfies LocalizedString,
  intro: {
    de: 'Ausgewählte Projekte aus Architektur, Content und Plattform.',
    en: 'Selected projects across architecture, content, and platform work.',
  } satisfies LocalizedString,
}

export const legal = {
  impressum: {
    title: { de: 'Impressum', en: 'Legal notice' },
    body: {
      de: `Angaben gemäß § 5 TMG

Fabian Schultz-Fademrecht
Deutschland

Kontakt über LinkedIn:
https://www.linkedin.com/in/fabian-schultz-fademrecht-2223162a0/

Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
Fabian Schultz-Fademrecht`,
      en: `Information according to German Telemedia Act (TMG)

Fabian Schultz-Fademrecht
Germany

Contact via LinkedIn:
https://www.linkedin.com/in/fabian-schultz-fademrecht-2223162a0/

Responsible for content
Fabian Schultz-Fademrecht`,
    },
  },
  datenschutz: {
    title: { de: 'Datenschutz', en: 'Privacy policy' },
    body: {
      de: `Verantwortlicher
Fabian Schultz-Fademrecht
Kontakt: LinkedIn (siehe Impressum)

Allgemeines
Diese Website ist ein persönliches Portfolio. Es werden nur die für Betrieb und Sicherheit technisch notwendigen Daten verarbeitet.

Hosting
Beim Aufruf der Seite verarbeitet der Hosting-Anbieter automatisch Server-Logfiles (u. a. IP-Adresse, Zeitpunkt, User-Agent). Rechtsgrundlage: berechtigtes Interesse an sicherem Betrieb (Art. 6 Abs. 1 lit. f DSGVO).

Cookies & Tracking
Es werden keine Marketing-Cookies oder Analyse-Tracker eingesetzt.

Deine Rechte
Du hast Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit sowie Beschwerde bei einer Aufsichtsbehörde.

Stand: 2026`,
      en: `Controller
Fabian Schultz-Fademrecht
Contact: LinkedIn (see legal notice)

General
This site is a personal portfolio. Only data required for operation and security is processed.

Hosting
When you visit the site, the hosting provider processes server log files (including IP address, timestamp, user agent). Legal basis: legitimate interest in secure operation.

Cookies & tracking
No marketing cookies or analytics trackers are used.

Your rights
You have rights of access, rectification, erasure, restriction, objection, data portability, and complaint to a supervisory authority.

Last updated: 2026`,
    },
  },
}
