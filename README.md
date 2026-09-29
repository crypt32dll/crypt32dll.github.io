# Fabian Schultz-Fademrecht — Portfolio

Static multilingual portfolio (DE/EN) for **GitHub Pages**.

Built with Next.js 16 App Router, Tailwind CSS 4, Three.js (R3F), and typed static content modules. No Vercel runtime, no Payload/Postgres — pure static export to `out/`.

## Stack

- Next.js 16 · React 19 · TypeScript
- `output: 'export'` → GitHub Pages
- next-intl (DE/EN)
- Three.js / React Three Fiber (hero motion)
- Tailwind CSS 4 · Biome · Vitest

## Develop

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — root redirects to `/de/` or `/en/`.

## Build (static)

```bash
pnpm build
```

Artifacts land in `out/`. Local preview:

```bash
pnpm dlx serve out
```

## Deploy (GitHub Pages via `gh-pages` branch)

Unverändert wie bisher: die Site kommt vom Branch **`gh-pages`**.

1. Repo **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`gh-pages`** / `/ (root)`
2. Push nach **`master`** → Workflow baut mit pnpm nach `out/` und published den Inhalt auf `gh-pages`
3. Site: `https://crypt32dll.github.io`

Was sich nur intern geändert hat: Yarn/`dist` → pnpm/`out` (Next static export). Der alte Extra-Sitemap-Workflow entfällt; `sitemap.xml` kommt aus dem Build.

Optional env (Actions / local `.env`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (default `https://crypt32dll.github.io`) |
| `ALLOW_SEARCH_INDEXING` | `true`/`false` for robots.txt |

## Content

Edit typed modules under `src/content/` — projects, about, site meta. Images live in `public/images/`.

## Routes

| Path | Page |
| --- | --- |
| `/[locale]/` | Home |
| `/[locale]/work/` | Project list |
| `/[locale]/work/[slug]/` | Case study |
| `/[locale]/about/` | About |
| `/[locale]/impressum/` | Legal |
| `/[locale]/datenschutz/` | Privacy |

## Note on the blueprint

The Payload/Neon/Vercel CMS path from `portfolio_stack_blueprint_*.plan.md` is intentionally **not** used here: GitHub Pages cannot host a Node CMS. Architecture keeps static TypeScript content as the source of truth, matching the plan’s “static first” content strategy.
