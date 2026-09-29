# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Design Context

Strategic and visual guidance for design work lives in two files at the repo root:

- [PRODUCT.md](../PRODUCT.md) — register (brand), users (recruiters first, hiring managers second), brand personality (considered, plain-spoken, warm), anti-references (LinkedIn-resume voice, try-hard dev brutalist, agency overdesign), and 5 strategic design principles. Read this before any new UI work.
- [DESIGN.md](../DESIGN.md) — visual system: tokens (machine-readable YAML frontmatter), the "Quiet Workshop" north star, color/typography/elevation/component specs, and named do's and don'ts. The accent is **Lamp Ember** (`#E5642E` dark / `#B23F12` light) — the one warm light in the workshop. `.impeccable/design.json` is the machine-readable sidecar (tonal ramps, motion tokens, full component HTML/CSS snippets).

Future impeccable commands (`/impeccable shape`, `/impeccable polish`, `/impeccable critique`, etc.) load these automatically.

---

## Project Status

**All 18 plan steps shipped (1–18 done).** Next.js 16.3 + React 19.3 + TS + Tailwind v4 + Motion 13 (`LazyMotion`) app, Docker dev/preview pipeline, fully bilingual (EN/ES), dark + light themed, with a narrative-first landing (Phase 4, 2026-09-27: the animated Logo Cluster and the Stats Bar are gone) and site-wide polish (scroll reveals, route fade, micro-interactions). Every page is prerendered in EN at `/...` and ES at `/es/...`.

**Routing (multiple root layouts, since 2026-09-29):** `app/(en)/...` (unprefixed: landing, story, contact, how-its-built, experience/[id]) and `app/(es)/es/...` (Spanish mirror). **Each group's `layout.tsx` is a root layout**, both rendering `src/components/layout/RootDocument.tsx` (html with the right `lang`, theme pre-paint script, JSON-LD, `ThemeProvider`, `I18nProvider` with that locale's catalogue only, `MotionProvider`, Navbar, Footer, Umami, and the build-time `assertValidContent()`). There is no `app/layout.tsx`. Switching language is a full document load. 404 is `app/global-not-found.tsx` (`experimental.globalNotFound`); `app/global-error.tsx` is explicit. Each group's `template.tsx` re-exports `RouteFadeTemplate` (CSS `.route-fade`). `sitemap.ts`, `robots.ts` and `og/[image]` sit at `app/` with no layout.

**i18n (`src/i18n/`):** custom thin layer (not `next-intl` — static export blocks middleware-based EN-unprefixed routing). `locale.ts`, `messages/{en,es,index}.ts` (typed catalogues, parity via `Messages = typeof en`), `translator.ts` (dot-notation + `{name}` interpolation + typed `MessageKey<T>`), `I18nProvider.tsx` (takes `messages` from the layout; `useTranslations` / `useLocale`), `server.ts` (`getTranslator(locale)` for RSCs), `path.ts` (`withLocale` / `switchLocale`). **Client code never imports the catalogues**: shared code takes a `Translate` function (`getTranslator(locale)` on the server, `useTranslations()` in the client), e.g. `ContactActions t={t}` and `resumeRequestHref(t)`. Only the 404 page loads both catalogues.

**Theme (`src/lib/theme/`):** `types.ts`, `storage.ts` (`ThemeStorage` interface + `LocalStorageThemeStorage` — DIP), `inline-script.ts` (FOUC-safe pre-paint resolver), `ThemeProvider.tsx` (`useSyncExternalStore` over `<html data-theme>`: the server snapshot is `DEFAULT_THEME`, so hydration matches, then it follows the DOM). Anything that must be right on first paint (e.g. the ThemeToggle icon) styles off `[data-theme]` with the `light:` custom variant in `globals.css`, never off React theme state — that was the 2026-09-27 hydration-mismatch fix. Light palette lives under `[data-theme="light"]` in `globals.css` with all 8 tag-type colors retuned.

**`src/lib/` layer (plain modules, since 2026-09-29):** `taxonomy` (`taxonomyRepository`, `tag-index.ts` server-only), `experience` (`experienceRepository`, `sort.ts`, `csv.ts`, `tag-display.ts`, `localize.ts`, `client-entry.ts`, description renderer), `explorer/landing-data.ts` (server-only), `filters` (`matchesAllTags`), `related` (`scoreRelated`/`topRelated`), `stats/years-in-engineering.ts`, `search` (the one real strategy interface: scope, starters, aliases, closest match), `story` (career lanes), `site`, `hooks`, `analytics`.

**Shared page bodies:** `Landing.tsx` (server: `Hero` → client island `ExplorerClient` → `LandingTail`), `Story.tsx` / `Contact.tsx` / `DeepDive.tsx` / `HowItsBuilt.tsx` (server, take `locale`). Route files are tiny wrappers. **The browser never loads experience.json or taxonomy.json**: `buildLandingData(locale)` gives the island localized entries trimmed by `toClientEntry()` (description = drawer teaser) and a `tagIndex`; client components read tag labels via `useTagLabel()` from `TagIndexProvider`, never `formatTagLabel` (server-only).

**Motion:** `motion` 13 via `MotionProvider` (`LazyMotion strict`, `domMax` loaded in its own chunk): use `import * as m from "motion/react-m"` and hooks from `"motion/react"`; never `motion.*` (throws under strict). `Reveal` is CSS only (scroll-driven `.reveal` in `globals.css`). Honors `prefers-reduced-motion` everywhere.

**Navbar:** scroll-aware, includes `ThemeToggle` (sun/moon cross-fade) + `LanguageSwitcher` (writes `NEXT_LOCALE` cookie, preserves query + hash via `switchLocale()`).

**Documented deviations** (see plan Status Log): (i) `/story` rail uses custom Framer Motion `useScroll`/`useSpring` instead of Aceternity TracingBeam (TracingBeam is hard-coded for a left-rail layout that doesn't fit the alternating centre rail); (ii) i18n uses a custom thin layer instead of next-intl (static export blocks next-intl's middleware-based EN-unprefixed routing).

**Discover relevance gate (2026-05-28):** every experience entry carries a required `relevant: boolean`. The Explorer "Discover" tool + stats read `experienceRepository.getRelevant()` — only `relevant: true` entries (professional/technical work) show in the grid and feed the years-of-experience stat; non-relevant entries (formal education, unrelated jobs, personal) stay in data for Story/deep-dive but are hidden from Discover. The portfolio-json-builder skill documents this field. The years stat ("Years in engineering", since 2026-09-27) counts only `story_act: "technical"` entries and merges overlapping periods via `monthRange()` so concurrent roles count once; it tolerates `null`/year-only `Period.start`. Accent-filled CTAs use the `--color-on-accent` token (ink `#0A0A0F` in dark mode for AA, white in light) rather than `text-text-primary`.

**Story page fields (2026-05-28):** two optional `BaseEntry` fields drive the Story timeline, independent of `type`/`relevant`. `story_act: "foundation" | "technical"` groups the acts — Act 1 (`Story.tsx`) renders `story_act === "foundation"` (swimmer, waiter, instructor, mentor, **UAI degree as of 2026-05-29**), Act 3 renders `"technical"` (AidProf, uPlanner, Apple) and adds a "Result:" line per card from `impact[0]`; entries without it stay off the timeline. Note the School of Tech instructor is `relevant: true` (still in Discover) yet `"foundation"`; the Silabuz mentor is `relevant: false` since 2026-09-27 — the act split deliberately does NOT reuse the `relevant` gate. `personal_impact: string` is a 1–2 sentence reflective line shown on each timeline card *in place of* the factual `summary` (which still drives Explorer/deep-dive). `PivotInterlude` (Act 2) renders inline `**bold**` via the exported `renderInline` from `src/lib/experience/description.tsx`. The portfolio-json-builder skill documents both fields.

**Story card click target (2026-05-29):** `StoryTimeline` uses a stretched-link pattern — the whole `<article>` is the click target via an absolute-inset `<Link>` overlay with `sr-only` heading + focus ring on the full card. `linkToDeepDive` is now enabled on **both** Act 1 and Act 3 (was Act 3 only); deep-dive opens in a new tab.

**Drawer (2026-09-27):** the description teaser renders through `renderInline` (inline `**bold**`), and the desktop panel needs `sm:left-auto` alongside the mobile `inset-x-0` or it docks left.

**Mobile nav opacity (2026-05-29):** `Navbar.tsx` keeps the header in its solid-state classes (`bg-surface/80 backdrop-blur-md`) whenever `mobileOpen || scrolled`; the mobile overlay uses fully-opaque `bg-bg backdrop-blur-md` (was `bg-bg/95 backdrop-blur-sm`) so page content no longer bleeds through.

**404 localization (2026-05-29):** `app/not-found.tsx` is a client component that reads `usePathname()` to pick EN vs ES (it sits at the root layout, outside `I18nProvider`). Copy lives under `notFound` in both message catalogues.

**Analytics (2026-06-09):** Umami cloud script injected from `src/app/layout.tsx` via `next/script` (`afterInteractive`), gated by `data-domains="asebagutierrezm.com"` so localhost/preview don't ship beacons. Typed wrapper at `src/lib/analytics/umami.ts` — the `EventMap` is the single source of truth for every custom event (`filter_added`, `filter_removed`, `search_typed`, `experience_opened`, `deep_dive_opened`, `contact_clicked`). Tracking is wired at user-gesture sites (SearchBar/StarterChips/ActiveFilterChips/ExperienceCard incl. its pills/FeaturedRoles/Drawer), never inside `useFilterTags` — the URL-state hook stays analytics-free. `search_typed` is debounced 600ms and skips queries <2 chars. Contact CTAs use Umami's declarative `data-umami-event-*` attributes, generated from the typed `EventMap` by `umamiAttributes()`, so server components stay server components. `src/types/global.d.ts` declares `window.umami`.

**Expert-review Phase 1 (2026-09-27):** positioning target is **Data / Data Platform Engineer**. Hero shows a fixed `hero.role`, a proof line with computed years, the shared `AvailabilityBadge`, and a résumé-request link (`AnimatedRoleLine` deleted). **The résumé is never a public file** (owner's decision): Contact has a `#resume` section with a pre-filled `mailto:` request; `siteConfig.resume` and `siteConfig.title` are gone. Contact states work authorization (U.S. permanent resident, no sponsorship). **Apple content must stay NDA-conservative** (owner is a contractor through a vendor): no incidents, security-finding specifics, internal topology, absolute internal volumes, tenant/instance/user counts, team details or vendor relationships; ratios and engineering judgement only. Industries stat removed. Full roadmap for later phases: see plan Status Log 2026-09-27.

**Expert-review Phase 2 (2026-09-27, branch `phase-2-conversion-seo`):** all route metadata goes through `src/lib/site/metadata.ts` (canonical, hreflang, OG/Twitter; root sets only `metadataBase`). `sitemap.ts`/`robots.ts` are force-static; JSON-LD `Person` in the root layout. Share images are PNGs from `app/og/[image]/route.tsx` (not `opengraph-image.tsx`, which exports extensionless files); their hex values live in `src/lib/site/brand-tokens.ts`, the one documented exception to the globals.css rule. Contact links everywhere use hook-free `src/components/contact/ContactLinks.tsx` and `src/lib/site/contact.ts`; track them with `umamiAttributes()` (typed `data-umami-event-*`), `contact_clicked` carries `kind` + `source`. `StickyContactPill` on `/` mobile. Contact has an `AtAGlance` block fed by `CORE_STACK`/`getEngineeringYears()` in `src/lib/site/profile.ts`. 

**Expert-review Phase 3 (2026-09-27):** content rewrite. First-person, results-first, no em dashes in any entry `summary`/`impact`/`personal_impact` or UI copy (long-form `description` fields still have some). AidProf is titled "Co-founder & Lead Engineer (title: Product Owner)" and its summary explains the overlap with uPlanner (nights and weekends from July 2021). Story Act 2 is "The choice", not a pivot. Entries can carry `translations.es` (`summary`, first ≤3 `impact`, `personal_impact`), applied by `localizeEntry()` in `src/lib/experience/localize.ts` at every locale-aware entry point (Explorer, Story, DeepDive, metadata) with per-field English fallback. Spanish is filled in for Apple, uPlanner and AidProf; never machine-translate new entries without the owner's review. Next up: Phase 4 (landing and interaction redesign).

**Expert-review Phase 4 (2026-09-27):** landing and interaction redesign. Landing sections: `Hero` (static `CoreStack` row from the `simple-icons` package, `currentColor`, no min-height), `FeaturedRoles` (three engineering roles, three impact lines each), the filter section (`SearchBar` + `StarterChips` + `ExperienceGrid`), then server `LandingTail` (`CareerSwimlane` teaser + Contact block). Search hides concepts/scale/soft skills except ~18 allowlisted recruiter concepts (`src/lib/search/scope.ts`). Cards: ≤6 pills via `cardTags()`, headline result above pills, pills filter on click or are inert (TagPill hover only when clickable). Deep-dive tags collapse per type with `<details>`. `CareerSwimlane` lanes map to entry ids in `src/lib/story/career-lanes.ts`. No text under 12px; 24px+ hit areas. 

**Expert-review Phase 5 (2026-09-28):** content types come from Zod schemas (`src/content/schema.ts`, `z.infer`); `src/content/validate.ts` checks cross-file rules; the root layout's `assertValidContent()` fails the build on invalid data; `src/content/data.ts` is the one typed boundary over the raw JSON (repositories import from it). Tests: `pnpm test` (Vitest, `tests/unit`), `pnpm test:e2e` (Playwright + axe, `tests/e2e`, serves `out/` with clean URLs; run it in `mcr.microsoft.com/playwright:v1.63.0-noble`, the Alpine dev image can't run browsers), `pnpm lhci` (Lighthouse budget). CI in `.github/workflows/ci.yml`. **When reduced motion changes what renders, use `useReducedMotionAfterMount`** (Framer's hook breaks hydration). Color tokens are computed to clear 4.6:1 on bg, surface, surface-elevated and the active pill tint; re-check with the e2e contrast tests after any token change. Security headers: `docker/security-headers.conf` (preview) and `docs/deploy/security-headers.md` (Render dashboard; CSP is report-only). `/how-its-built` mirrors the README. 

**Expert-review Phase 6 (2026-09-29):** per-locale root layouts (`lang` in static HTML, no lang script), one catalogue per page, server-shaped client island (landing JS 204 → 141 kB by Next 15's First Load metric), plain modules, `motion` 13 with `LazyMotion`, CSS reveals, Next 16.3 + React 19.3 with native flat ESLint config (`eslint.config.mjs`) and the stricter React Hooks rules (no setState in effects: derive state, adjust during render, or `useSyncExternalStore`). Next up: Phase 7 (next-level bets).

**Deferred (plan §18 Phase 2):** taxonomy `display_name_es` (still English). Entry prose translations exist only for the three technical entries (Phase 3); foundation entries and all `description`s stay English.

`docs/portfolio-website-plan.md` remains the single source of truth for design and architecture. Experience documentation for JSON data population lives in `docs/experience/`.

---

## Git

- **Never commit without the owner's explicit approval**, given in the current conversation for that specific round of commits. Handoff docs, plans or task prompts that say "commit" do not count as approval.
- **Commit only through the `ship` skill**, which proposes the commits and waits for a "yes" before running `git commit`. No direct `git commit`, no other commit skills.
- **Never `git push`** unless asked in that instance. The owner pushes.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js** (static export — `next export`) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** — utility classes only; all color values live exclusively in `globals.css` CSS custom properties |
| Components | **shadcn/ui** — components live in the codebase, not as a locked dependency |
| Animation | **Motion 13** (`LazyMotion` + `m.*`); CSS scroll-driven reveals |
| UI Sections | **Aceternity UI** — used selectively (Hero ambient visual, timeline effects) |
| Data | **Flat JSON files** (`taxonomy.json` + `experience.json`) — no database, no CMS |

---

## Commands

All work runs inside Docker — there is no expectation of Node or pnpm on the host.

```bash
# Dev server with hot reload (http://localhost:3000)
docker compose up dev

# One-off scripts inside the dev container
docker compose run --rm dev pnpm type-check
docker compose run --rm dev pnpm lint
docker compose run --rm dev pnpm validate:data   # content schemas + cross-file rules
docker compose run --rm dev pnpm test            # unit tests (Vitest)
docker compose run --rm dev pnpm build       # produces ./out (static export); also validates content

# End-to-end tests (Playwright + axe) need the official Playwright image
docker run --rm -v "$PWD":/work -v /work/node_modules -w /work mcr.microsoft.com/playwright:v1.63.0-noble \
  bash -c "corepack enable && pnpm install --frozen-lockfile && pnpm test:e2e"

# Production preview — nginx serving the static export (http://localhost:8080)
docker compose --profile preview up --build preview
```

If you ever need to run pnpm scripts directly on the host (Node 20+ required), the npm-script names are the same: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm type-check`.

---

## Data Architecture

All site content derives from two JSON files in `src/data/` (or `public/data/`):

### `taxonomy.json`
Controlled vocabulary. Every valid tag slug is defined here. No tag may appear in `experience.json` unless it exists in taxonomy first.

**8 tag types:** `roles` · `languages` · `technologies` · `libraries` · `domains` · `concepts` · `scale` · `soft_skills`

Each entry shape:
```json
{ "slug": "data-engineer", "display_name": "Data Engineer", "type": "roles", "icon": null, "image": null, "color": null, "related": ["backend"] }
```

`image` holds a URL or local path to an SVG logo (e.g. `"https://cdn.simpleicons.org/python"`). Populated for well-known languages/libraries/technologies via the [Simple Icons CDN](https://simpleicons.org/); `null` for roles, domains, concepts, scale, and soft_skills (no canonical logos).

### `experience.json`
Array of entries with a shared base shape plus type-specific extension fields.

**Entry types:** `job` | `project` | `education` | `personal`

**Critical constraint on tags:** All 8 tag type keys must be present on every entry (use `[]` for empty types). Slug values must match entries in `taxonomy.json`. Both rules are enforced by the schemas and validator in `src/content/` on every build.

Type-specific fields:
- `job` → `company` (`{ name, url, industry }`), `location`, `employment_type`, `team`
- `project` → `status`, `client`
- `education` → `institution`, `credential`, `issuer`
- `personal` → `region`

### Data flow
```
taxonomy.json + experience.json
  → typed module imports (build time, no fetch)
    → Explorer (/): full array, filtered client-side by active tags
    → Story (/story): entries where type = "personal" | "job" | "project"
    → Deep Dive (/experience/[id]): getStaticPaths + getStaticProps, one entry
    → Related section: weighted tag overlap score, computed at build time
```

---

## Color System

**One file governs all colors.** All color values are CSS custom properties in `src/app/globals.css` under `:root`. Tailwind v4 reads these as tokens via the `@theme inline` block in the same file. No hex or rgb value appears anywhere else in the codebase, except `src/lib/site/brand-tokens.ts` (share-image renderer only; `next/og` can't read CSS variables).

Dark mode is the default/primary experience. Light mode is optional via `[data-theme="light"]` overrides of the same variables.

Tag type colors follow the pattern `--color-tag-{type}` (e.g., `--color-tag-roles`, `--color-tag-languages`). The Tag Pill component reads these per tag type.

---

## Routes

```
/                     Explorer — landing page, primary interaction
/story                Timeline narrative (3 acts)
/experience/[id]      Static deep-dive pages (generated from experience.json IDs)
/contact              Availability status + contact CTA
/how-its-built        Engineering story (footer link), mirrors the README
```

`/experience/[id]` is **not** in the nav — reached only via drawer "Dig deeper" button (new tab) or direct link. All static paths generated by `getStaticPaths` from experience entry IDs.

---

## Architecture Patterns

**Filter state:** Active tag slugs are stored as URL query params (`/?tags=python,etl,data-engineer`) for shareable filtered views. The grid reacts to this client-side state; clicking a pill on a grid card adds that tag.

**Drawer vs. full page:** The Explorer drawer (slide-over) opens without URL change. It shows a preview of the entry + "Dig deeper" to open the full `/experience/[id]` page in a new tab. Grid scroll position is preserved on drawer close.

**Landing order (Phase 4):** Hero → Featured roles → Filter by skill → Story teaser → Contact. The first three are the client `Explorer`; the last two are the server `LandingTail` so build-time swimlane dates never hydrate.

**Related experience algorithm:** Weighted tag overlap score (concepts = 3pt, technologies/roles = 2pt, others = 1pt). Computed at build time in `getStaticProps`, not at runtime.

**Mobile drawer:** Below `sm` breakpoint, the right-side drawer becomes a bottom sheet (slides up, 90vh, swipe-down to dismiss via Framer Motion drag).

---

## Build Order

Follow this sequence to avoid rework:

1. Color tokens + `globals.css`
2. `taxonomy.json` + `experience.json` (use `/portfolio-json-builder` skill to populate)
3. TypeScript types (`TaxonomyEntry`, `ExperienceEntry` discriminated union, `TagMap`)
4. **Tag Pill component** — build this first; it is used everywhere
5. Navbar + Footer
6. Experience Card
7. Search bar + tag dropdown
8. Active filter chips + URL sync
9. Stats Bar (computed from filtered entries)
10. Explorer page (`/`) — assemble Zones 1–4
11. Drawer (right-side + mobile bottom sheet)
12. Deep Dive page (`/experience/[id]`)
13. Story page (`/story`)
14. Contact page (`/contact`)
15. Polish — animations, Aceternity UI, Hero ambient visual

---

## Key Component Details

**Tag Pill** has 4 states: `active` (full type color, filled), `inactive` (reduced opacity), `muted` (greyed — shown when tag doesn't match active filter), `removable` (active + × button).

**Experience Card** accepts the full entry object + `filterTags: string[]` to determine which tag pills render highlighted vs. muted.

**Motion caps:** staggers never exceed 150ms (`MAX_STAGGER_DELAY` in `Reveal.tsx`); no count-ups; the drawer body renders at once.

**Navbar:** 64px, transparent by default. On scroll: `backdrop-blur-md` + `bg-surface/80`. Mobile: hamburger → full-screen overlay.

---

## Reference Documents

- `docs/portfolio-website-plan.md` — Full plan: all architectural decisions, component specs, copy tone, responsive strategy. The authoritative source.
- `docs/experience/uPlanner.md` — uPlanner role documentation (for `experience.json` content)
- `docs/experience/AidProf.md` — AidProf co-founder role documentation (for `experience.json` content)
- `docs/experience/Apple.md` — Apple Software Project Engineer role documentation (for `experience.json` content)

---

## Local Development — Docker

The project lives behind two compose services:

| Service | Purpose | URL | Image target |
|---|---|---|---|
| `dev` | Hot-reloading Next.js dev server | `http://localhost:3000` | `dev` stage in `Dockerfile` |
| `preview` | nginx serving the `out/` static export, for verifying production behavior | `http://localhost:8080` | `prod` stage (nginx:alpine) |

- The dev service bind-mounts the repo and uses anonymous volumes for `node_modules` and `.next` so the host never shadows the container's installed dependencies.
- The `pnpm-lock.yaml` is generated on first `docker compose up dev` if missing; subsequent builds use `--frozen-lockfile`.
- Production is plain static HTML behind nginx. There is **no Node in the prod image** — this matches the plan's `output: 'export'` decision.

`Dockerfile` is multi-stage: `base → deps → dev / builder → prod`. `docker/nginx.conf` handles gzip, long-cache headers for hashed `_next/static/` assets, and the `.html` fallback that Next.js static export needs.

---

## Module Conventions

Plain modules first (ADR 7 in the README, 2026-09-29): a function or object per concern, one file per common change. Add an interface only when a second implementation actually exists and composes. The search strategies are the one case today.

- **Filter rule** → `matchesAllTags` in `src/lib/filters/tag-match.ts`.
- **New search behavior** → a `SearchStrategy` in `src/lib/search/` (e.g. `AliasSearchStrategy` wraps the substring one); scope, starter tags and aliases are single-purpose files there.
- **Related-experience scoring** → `scoreRelated` / `topRelated` in `src/lib/related/weighted-tag-overlap.ts`.
- **Client island data** → shape it on the server (`buildLandingData`, `toClientEntry`, `buildTagIndex`) and pass it as props; client components never import repositories or `src/content/data.ts`.
- **New taxonomy type** (rare):
  1. Add the slug to the `TAG_TYPES` tuple in `src/lib/taxonomy/types.ts`.
  2. Add a `--color-tag-{type}` token in `src/app/globals.css`.
  3. Backfill the key on every entry in `src/data/experience.json` (use `[]` if empty).
  4. The Tag Pill reads color from a CSS-var map keyed by type, so no component change is needed.
- **Importing data** — server code uses `experienceRepository` / `taxonomyRepository`; never import the JSON files from a component.

Tag Pill states (`active` | `inactive` | `muted` | `removable`) share one prop interface — every state is interchangeable in every consumer.

---

## Keeping the Plan in Sync

**`docs/portfolio-website-plan.md` is the source of truth. After every meaningful change, update it:**

1. In **§15 Build Order**, mark each completed step with `✅ YYYY-MM-DD`. Leave unstarted steps untouched. For partially-done steps, prefix with `🟡` and add a one-line note of what's left.
2. Maintain a **Status Log** section at the very bottom of the plan (create it if missing). Each entry on its own line: `- YYYY-MM-DD — <one-line summary of what landed> (<commit/PR link if any>)`. Newest entries on top.
3. If a technical decision diverged from what the plan said (different library, renamed component, changed route, etc.), **edit the relevant section in-place** and add a Status Log entry explaining why.
4. If a section is no longer accurate, fix it. Stale text in the plan causes future drift — silent inaccuracy is worse than an outdated note.
5. Never delete completed-step history from the Build Order — it's the project's change ledger.
6. Mirror the same status update in this CLAUDE.md's `## Project Status` paragraph at the top, so a fresh Claude session immediately knows where things stand.
