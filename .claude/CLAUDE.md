# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Status

The **real Explorer page is live at `/` (Build Order steps 1–10 done)**: Next.js 15.4.11 + TS + Tailwind v4 app, Docker dev/preview pipeline, color tokens, real JSON data (2 jobs + a full taxonomy), a SOLID-aligned `src/lib` layer (taxonomy, experience [+ sort + csv], filters, related, stats, search, site — interfaces + impls + helpers + `useFilterTags()` URL-sync hook), the `cn()` utility, the `TagPill` primitive with all four states plus an optional `sublabel` slot (`src/components/tags/`), a global shell (`Navbar` + `Footer` under `src/components/layout/`, nav items and socials driven by config), the `ExperienceCard` component, the `SearchBar` accessible combobox + `RoleShortcuts` quick-filter row (`src/components/search/`), `ActiveFilterChips` (`src/components/filters/`) syncing the active slug set to `?tags=…`, `StatsBar` + `StatCard` (`src/components/stats/`) with Framer Motion count-up + unit suffix, `Hero` + `AnimatedRoleLine` (`src/components/hero/`) for Zone 1, and `ExperienceGrid` (`src/components/explorer/`) wrapping the card grid with sort/count/CSV-export/empty-state. All components consume the typed repositories — no JSON imports outside `src/lib/` (DIP). The old component playground lives at `/playground` (not in nav). The next pass starts at **Build Order step 11: Drawer (right-side slide-over + mobile bottom sheet)**.

`docs/portfolio-website-plan.md` remains the single source of truth for design and architecture. Experience documentation for JSON data population lives in `docs/experience/`.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js** (static export — `next export`) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** — utility classes only; all color values live exclusively in `globals.css` CSS custom properties |
| Components | **shadcn/ui** — components live in the codebase, not as a locked dependency |
| Animation | **Framer Motion** |
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
docker compose run --rm dev pnpm build       # produces ./out (static export)

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

**Critical constraint on tags:** All 8 tag type keys must be present on every entry (use `[]` for empty types). Slug values must match entries in `taxonomy.json`.

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

**One file governs all colors.** All color values are CSS custom properties in `src/app/globals.css` under `:root`. Tailwind v4 reads these as tokens via the `@theme inline` block in the same file. No hex or rgb value appears anywhere else in the codebase.

Dark mode is the default/primary experience. Light mode is optional via `[data-theme="light"]` overrides of the same variables.

Tag type colors follow the pattern `--color-tag-{type}` (e.g., `--color-tag-roles`, `--color-tag-languages`). The Tag Pill component reads these per tag type.

---

## Routes

```
/                     Explorer — landing page, primary interaction
/story                Timeline narrative (3 acts)
/experience/[id]      Static deep-dive pages (generated from experience.json IDs)
/contact              Availability status + contact CTA
```

`/experience/[id]` is **not** in the nav — reached only via drawer "Dig deeper" button (new tab) or direct link. All static paths generated by `getStaticPaths` from experience entry IDs.

---

## Architecture Patterns

**Filter state:** Active tag slugs are stored as URL query params (`/?tags=python,etl,data-engineer`) for shareable filtered views. Grid and stats bar react to this client-side state.

**Drawer vs. full page:** The Explorer drawer (slide-over) opens without URL change. It shows a preview of the entry + "Dig deeper" to open the full `/experience/[id]` page in a new tab. Grid scroll position is preserved on drawer close.

**Stats bar:** Computed entirely client-side from filtered `experience.json` entries on every filter change. No server required.

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

**Stat Card** animates value from 0 on mount and on value change (count-up, ~800ms ease-out via Framer Motion).

**Navbar:** 64px, transparent by default. On scroll: `backdrop-blur-md` + `bg-surface/80`. Mobile: hamburger → full-screen overlay.

---

## Reference Documents

- `docs/portfolio-website-plan.md` — Full plan: all architectural decisions, component specs, copy tone, responsive strategy. The authoritative source.
- `docs/experience/uPlanner.md` — uPlanner role documentation (for `experience.json` content)
- `docs/experience/AidProf.md` — AidProf co-founder role documentation (for `experience.json` content)

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

## SOLID Conventions

The `src/lib/` layer is organized so that each common change touches exactly one file.

- **New filter strategy** → add a class implementing `FilterStrategy` in `src/lib/filters/`. Do not edit existing strategies. (OCP)
- **New stat in the Stats Bar** → add a `StatComputer` in `src/lib/stats/computers/` and append it to `src/lib/stats/registry.ts`. The Stats Bar component reads the registry. (OCP, SRP)
- **New related-experience scoring algorithm** → add an `IRelatedScorer` implementation in `src/lib/related/`. Page imports the interface; swap impls without touching the page. (DIP)
- **New taxonomy type** (rare):
  1. Add the slug to the `TAG_TYPES` tuple in `src/lib/taxonomy/types.ts`.
  2. Add a `--color-tag-{type}` token in `src/app/globals.css`.
  3. Backfill the key on every entry in `src/data/experience.json` (use `[]` if empty).
  4. The Tag Pill reads color from a CSS-var map keyed by type, so no component change is needed.
- **Importing data in components** — always import the **interface** (`IExperienceRepository`, `ITaxonomyRepository`) and use the exported singleton from `*-repository.ts` (e.g. `experienceRepository`). Never import the JSON file directly from a component. (DIP)

Tag Pill states (`active` | `inactive` | `muted` | `removable`) share one prop interface — every state is interchangeable in every consumer (LSP). Repository interfaces are deliberately narrow — only the methods callers actually use (ISP).

---

## Keeping the Plan in Sync

**`docs/portfolio-website-plan.md` is the source of truth. After every meaningful change, update it:**

1. In **§15 Build Order**, mark each completed step with `✅ YYYY-MM-DD`. Leave unstarted steps untouched. For partially-done steps, prefix with `🟡` and add a one-line note of what's left.
2. Maintain a **Status Log** section at the very bottom of the plan (create it if missing). Each entry on its own line: `- YYYY-MM-DD — <one-line summary of what landed> (<commit/PR link if any>)`. Newest entries on top.
3. If a technical decision diverged from what the plan said (different library, renamed component, changed route, etc.), **edit the relevant section in-place** and add a Status Log entry explaining why.
4. If a section is no longer accurate, fix it. Stale text in the plan causes future drift — silent inaccuracy is worse than an outdated note.
5. Never delete completed-step history from the Build Order — it's the project's change ledger.
6. Mirror the same status update in this CLAUDE.md's `## Project Status` paragraph at the top, so a fresh Claude session immediately knows where things stand.
