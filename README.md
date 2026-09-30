<p align="center">
  <img src="public/favicon.png" alt="Fabian Schultz-Fademrecht" width="72" height="72" />
</p>

# Fabian Schultz-Fademrecht — Portfolio

[![Deploy](https://img.shields.io/github/actions/workflow/status/crypt32dll/crypt32dll.github.io/deploy-pages.yml?branch=master&style=flat-square&label=Deploy)](https://github.com/crypt32dll/crypt32dll.github.io/actions)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-24-3c873a?style=flat-square&logo=nodedotjs&logoColor=white)
[![Live](https://img.shields.io/badge/Live-crypt32dll.github.io-1a8f7a?style=flat-square)](https://crypt32dll.github.io)

Static, bilingual (DE/EN) portfolio for **GitHub Pages** — Next.js App Router, typed content modules, deferred Three.js motion. No Node server, no CMS runtime.

[Overview](#overview) · [Features](#features) · [Getting started](#getting-started) · [Scripts](#scripts) · [Content](#content) · [Deploy](#deploy) · [Architecture notes](#architecture-notes)

## Overview

This site is Fabian Schultz-Fademrecht’s public portfolio: composable frontend architecture, structured content, and selected case studies. It is built as a **static export** (`output: 'export'`) so it can ship on GitHub Pages from the `gh-pages` branch.

```text
Browser  →  GitHub Pages (static HTML/CSS/JS)
               ↑
         CI build (pnpm) → out/ → gh-pages
               ↑
         src/content/* (TypeScript source of truth)
```

## Features

- **Static-first** — full HTML export to `out/`, no SSR host required
- **DE / EN** — `next-intl` with locale-prefixed routes (`/de/`, `/en/`)
- **Typed content** — projects, pages, and site meta as Zod-validated TS modules
- **SEO / GEO** — canonical + hreflang, Open Graph, `sitemap.xml`, `robots.txt`, Person JSON-LD
- **Motion** — React Three Fiber scenes loaded after idle time (keeps LCP/TBT free of the 3D bundle)
- **Modern targets** — browserslist aligned with Next’s baseline (Chrome/Edge/Firefox ≥ 111, Safari ≥ 16.4)
- **Tooling** — Biome, Vitest, Husky + lint-staged, pnpm

## Getting started

**Requirements:** [Node.js 24](https://nodejs.org/) and [pnpm 10](https://pnpm.io/) (see `packageManager` in `package.json`).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — the root redirects to `/de/` or `/en/`.

Copy `.env.example` to `.env` when you need overrides:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (default `https://crypt32dll.github.io`) |
| `ALLOW_SEARCH_INDEXING` | `true` / `false` for `robots.txt` |
| `LOG_LEVEL` | Logger verbosity |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm devsafe` | Clear `.next` then start dev (useful after Turbopack glitches) |
| `pnpm build` | Production static export → `out/` |
| `pnpm preview` | Build + serve `out/` locally |
| `pnpm lint` / `pnpm format` | Biome check / write |
| `pnpm test:unit` | Vitest unit tests |
| `pnpm ci` | Lint + unit tests + build |

## Content

Edit typed modules under `src/content/`:

| Module | Role |
| --- | --- |
| `site.ts` | Name, tagline, social links, nav |
| `pages.ts` | Homepage / about copy |
| `projects.ts` | Case studies (slug, stack, covers, body) |
| `repository.ts` | Content access + Zod validation |

Images live in `public/images/` (WebP preferred). After changing content, rebuild and deploy — there is no runtime CMS.

### Routes

| Path | Page |
| --- | --- |
| `/[locale]/` | Home |
| `/[locale]/work/` | Project index |
| `/[locale]/work/[slug]/` | Case study |
| `/[locale]/about/` | About |
| `/[locale]/impressum/` | Legal notice |
| `/[locale]/datenschutz/` | Privacy |

## Deploy

Hosting uses the classic **branch deploy** model (unchanged from the previous Vue site):

1. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`gh-pages`** / `/ (root)`
2. Push to **`master`** → [Deploy workflow](.github/workflows/deploy-pages.yml) runs `pnpm build` and publishes `out/` to `gh-pages` (with `.nojekyll` so `/_next/` is served).
3. Live site: [https://crypt32dll.github.io](https://crypt32dll.github.io)

> [!NOTE]
> GitHub Pages applies a fixed `Cache-Control: max-age=600` to all assets. `next.config` `headers()` and Next Cache Components (`'use cache'`) do not apply to static export. A small service worker (`public/sw.js`) caches `/_next/static/` and `/images/` for **repeat visits**. That does **not** change the Lighthouse “efficient cache lifetimes” audit (it reads HTTP headers). For long CDN TTLs, put Cloudflare in front of a custom domain.

## Architecture notes

| Concern | Choice |
| --- | --- |
| Runtime | Static HTML on GitHub Pages — no Vercel / no Payload |
| Content | TypeScript modules + Zod (not a headless CMS) |
| i18n | Locale segments; no middleware (required for `output: 'export'`) |
| Images | `next/image` with `unoptimized: true` (no image optimizer server) |
| 3D | Deferred client import; ExperienceRuntime facade; scene stays mounted when motion is reduced |
| Theme | Void (dark) vs day (stone light); prefs → runtime tokens |
| Nav | One-pager section registry (`inHeader` / `inProgress`) |

> [!TIP]
> The earlier Payload / Neon / Vercel blueprint is intentionally not used here: GitHub Pages cannot host a Node CMS. Static typed content matches a “static first” strategy while keeping the door open to a CMS later if hosting changes.
