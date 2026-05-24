# Personal Portfolio Website

An interactive portfolio that lets recruiters **discover** relevant experience based on what they're looking for, rather than reading a static resume top-to-bottom.

> A resume *tells* recruiters about you. This site lets them *discover* you based on what they need.

---

## The Idea

Three layers of depth, each serving a different reader and time budget:

| Layer | Format | Time | Purpose |
|---|---|---|---|
| Card (grid) | Compact card | ~30 sec | Scan & filter |
| Drawer | Slide-over panel | 2–3 min | Qualify the match |
| Full page `/experience/[id]` | Full layout | 5–10 min | Deep research |

The recruiter flow: land on the Explorer → type a skill/tool/role → tags surface → cards reshape → click a card → drawer opens → "Dig deeper" → full page in a new tab → related experiences → contact.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (static export via `output: 'export'`) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** — utilities only; all colors as CSS custom properties in `src/app/globals.css` |
| Components | **shadcn/ui** — owned in-repo, no library lock-in |
| Animation | **Framer Motion** |
| UI sections | **Aceternity UI** — selectively (Hero ambient visual, timeline effects) |
| Data | **Flat JSON** — `taxonomy.json` + `experience.json`, imported as typed modules |
| Package manager | **pnpm 9.x** (via Corepack inside Docker) |
| Deployment | Static `out/` directory, deployable to any static host |

No database. No CMS. No server runtime in production — nginx serves pre-rendered HTML.

---

## Data Model

Two JSON files drive every page:

- **`taxonomy.json`** — the controlled vocabulary. 8 tag types: `roles`, `languages`, `technologies`, `libraries`, `domains`, `concepts`, `scale`, `soft_skills`. No tag can appear in experience data unless it's defined here.
- **`experience.json`** — array of entries. Discriminated by `type`: `job` | `project` | `education` | `personal`. Every entry must include all 8 tag-type keys (use `[]` if empty).

See [docs/portfolio-website-plan.md](docs/portfolio-website-plan.md) §3 for the full schema.

---

## Routes

```
/                     Explorer — landing page, primary interaction
/story                Timeline narrative (3 acts: Before Tech → Pivot → Technical Career)
/experience/[id]      Deep-dive pages (statically generated from experience IDs)
/contact              Availability status + contact CTA
```

`/experience/[id]` is **not** in the nav — reached via the drawer's "Dig deeper" button (new tab) or a direct link.

---

## Color System

One file governs all colors: `src/app/globals.css`. CSS custom properties under `:root`, exposed to Tailwind v4 via `@theme inline`. Dark mode is the default; light mode is optional via `[data-theme="light"]` overrides.

To retheme the entire site, change the values in that block. Nothing else in the codebase needs to change.

Tag-type colors follow `--color-tag-{type}` (e.g. `--color-tag-roles`, `--color-tag-languages`) and are read by the Tag Pill component.

---

## Local Development — Docker

Docker is the canonical environment. No Node/pnpm required on the host.

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

The `Dockerfile` is multi-stage: `base → deps → dev / builder → prod` (`nginx:alpine`). The dev service bind-mounts the repo with anonymous volumes for `node_modules` and `.next` so the host never shadows the container's installed dependencies.

Running on the host directly (Node 20+, pnpm) works too — the npm-script names match: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm type-check`.

---

## Architecture Notes

**`src/lib/` is SOLID-aligned** — each common change touches exactly one file:

- `taxonomy/` — `TagType`, `TaxonomyEntry`, `ITaxonomyRepository` + JSON impl
- `experience/` — `ExperienceEntry` discriminated union, `IExperienceRepository` + JSON impl
- `filters/` — `FilterStrategy` interface; new rules drop in as sibling files (OCP)
- `related/` — `IRelatedScorer` + `WeightedTagOverlapScorer` (concepts = 3pt, technologies/roles = 2pt, others = 1pt)
- `stats/` — `StatComputer<T>` interface, one stat per file in `computers/`, registered in `registry.ts`

Components import the **interfaces**, never the JSON files directly.

**Filter state lives in URL query params** (`/?tags=python,etl,data-engineer`) so filtered views are shareable. Grid and Stats Bar react to this client-side state.

**Related experience** is computed at build time in `getStaticProps`, not at runtime.

**Mobile drawer** becomes a bottom sheet below the `sm` breakpoint (90vh, swipe-down to dismiss via Framer Motion drag).

---

## Build Order

Components are built in a deliberate sequence to avoid rework. See [docs/portfolio-website-plan.md](docs/portfolio-website-plan.md) §15 for the full ledger.

Current status:

1. ✅ Color tokens & `globals.css`
2. 🟡 `taxonomy.json` + `experience.json` — schema-correct skeletons committed; still need real data
3. ✅ TypeScript types + `src/lib/` repository interfaces
4. **Tag Pill component** ← next
5. Navbar + Footer
6. Experience Card
7. Search bar + tag dropdown
8. Active filter chips + URL sync
9. Stats Bar
10. Explorer page (`/`)
11. Drawer (right-side + mobile bottom sheet)
12. Deep Dive page (`/experience/[id]`)
13. Story page (`/story`)
14. Contact page (`/contact`)
15. Polish — animations, Aceternity UI, Hero ambient visual

---

## Reference Documents

- [docs/portfolio-website-plan.md](docs/portfolio-website-plan.md) — the authoritative plan: all architectural decisions, component specs, copy tone, responsive strategy.
- [docs/experience/](docs/experience/) — source material for populating `experience.json` (uPlanner, AidProf, etc.).
- [.claude/CLAUDE.md](.claude/CLAUDE.md) — working notes for Claude Code sessions.
