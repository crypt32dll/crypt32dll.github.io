# Domain glossary — crypt32dll.github.io

Portfolio one-pager: cinematic experience, bilingual content, static GitHub Pages export.

## Experience

| Term | Meaning |
| --- | --- |
| **chapter** | Scroll segment with `data-chapter` / DOM `id` (`hero`, `skills`, `work`, `about`, `contact`). Morph and camera respond to chapter progress. |
| **section** | Same identity as chapter in the one-pager registry; prefer *chapter* for scroll/WebGL, *section* for nav registry entries. |
| **ExperienceRuntime** | Owned mutable store + named writers shared by GSAP/Lenis and R3F. WebGL **reads**; scroll/lifecycle/prefs **write** through the facade. |
| **progress** | 0–1 document scroll position driving morph/camera. |
| **smooth** | Lerped progress used when motion is full; equals progress when reduced. |
| **ready** | WebGL/experience warm-up finished enough to complete the intro. |
| **unveiled** | Intro finished; Lenis/pins may run. |
| **loadProgress** | 0–1 intro loader fill. |
| **introScale** | Assemblage scale during intro (0 → 1). |

## Theme & motion

| Term | Meaning |
| --- | --- |
| **void** | Dark theme (`html.dark`, `data-theme="void"`). |
| **day** | Light stone theme (`data-theme="day"`). Distinct from void — not a second dark charcoal. |
| **reduced motion** | Resolved from browser `prefers-reduced-motion` **and** the preference toggle (`system` / `reduce` / `full`). Single source into ExperienceRuntime. Scene stays mounted; motion freezes. |

## Navigation

| Term | Meaning |
| --- | --- |
| **OnePagerNavigation** | Canonical section registry (`inHeader`, `inProgress`). Contact is progress-only, not header. |
| **HashRedirect** | Adapter for routes that lose `#hash` over HTTP (`/work`, `/about` → home + hash). |

## Content

| Term | Meaning |
| --- | --- |
| **static content modules** | `src/content/*` TypeScript source of truth. Direct imports OK until a second (CMS) adapter exists — see ADR-0001. |

## Deferred work

- **HomeShell** section split — after ExperienceRuntime + OnePagerNavigation.
- **ContentGateway** — only when a CMS adapter is real (ADR-0001).
