# Personal Portfolio Website — Full Plan

> Living document. Captures all decisions, structure, components, data architecture, and technical choices made during planning. Use this as the source of truth when building with Claude Design.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Tech Stack](#2-tech-stack)
3. [Data Architecture](#3-data-architecture)
4. [Color System](#4-color-system)
5. [Site Map & Navigation](#5-site-map--navigation)
6. [Page 1 — The Explorer (/)](#6-page-1--the-explorer-)
7. [Page 2 — The Story (/story)](#7-page-2--the-story-story)
8. [Page 3 — Deep Dive (/experience/id)](#8-page-3--deep-dive-experienceid)
9. [Page 4 — Contact (/contact)](#9-page-4--contact-contact)
10. [Global Components](#10-global-components)
11. [Experience Drawer](#11-experience-drawer)
12. [Related Experience Logic](#12-related-experience-logic)
13. [Copy Tone](#13-copy-tone)
14. [Responsive Strategy](#14-responsive-strategy)
15. [Build Order](#15-build-order)

---

## 1. Core Philosophy

The key distinction from a standard portfolio: **this is not a static resume site**. It is an interactive tool that lets recruiters discover relevant information based on what *they* are looking for.

> A resume *tells* recruiters about you. This website lets recruiters *discover* you based on what they need.

**The recruiter flow:**
```
Landing (Hero)
  → Type what they're looking for (open search)
    → Tags surface dynamically, filters activate
      → Experience cards reshape to match
        → Click a card → Drawer opens (qualify)
          → "Dig deeper" → Full page opens in new tab
            → Related experiences at the bottom
              → Contact / Download
```

Every structural and design decision serves this flow.

**Three layers of depth — intentional, not redundant:**

| Layer | Format | Time | Purpose |
|---|---|---|---|
| Card (grid) | Compact card | ~30 sec | Scan & filter |
| Drawer | Slide-over panel | 2–3 min | Qualify the match |
| Full page `/experience/[id]` | Full layout | 5–10 min | Deep research |

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js** (static export) | Pre-renders at build time — no server needed, instant load, SEO-friendly. Dynamic routes like `/experience/[id]` are generated statically from `experience.json`. |
| Language | **TypeScript** | Catches errors at dev time. JSON data can be fully typed against the schema. |
| Styling | **Tailwind CSS v4** | All styling via utility classes. No separate CSS files. Single `globals.css` for CSS custom properties (color tokens). |
| Components | **shadcn/ui** | Accessible, unstyled-by-default components that live in the codebase. No library lock-in. Owned code. |
| Animation | **Framer Motion** | Handles transitions, scroll effects, drawer animations, count-up numbers, tag chip entrance animations. |
| UI Sections | **Aceternity UI** | Pre-built impressive sections built on Framer Motion. Used selectively for Hero ambient visual and timeline effects. |
| Data | **Flat JSON files** | No database. Two files: `taxonomy.json` and `experience.json`. Imported as modules in Next.js — no parsing, TypeScript-typed. |
| Export | **CSV download** | Client-side export of filtered experience data. No server needed. |
| Deployment | **Static export** | `next export` — deployable to any static host (Vercel, Netlify, GitHub Pages). |

---

## 3. Data Architecture

All site content derives from two JSON files. No database. No CMS.

### `taxonomy.json`

The controlled vocabulary. Every valid tag is defined here. No tag may appear in `experience.json` unless it exists in taxonomy first.

**Structure:** Object keyed by tag type. Each type contains an object keyed by tag slug.

**Tag types:**

| Type key | What it covers | Examples |
|---|---|---|
| `roles` | Job position targets | Data Engineer, Backend, Full Stack, AI Engineer, DevOps |
| `languages` | Programming/query languages | Python, SQL, TypeScript, Bash, PHP |
| `technologies` | Platforms, tools, infrastructure | Snowflake, AWS, Docker, Postgres, Prometheus, Airflow |
| `libraries` | Code-level packages/frameworks | FastAPI, Pandas, Pydantic, Boto3, Pytest, NumPy |
| `domains` | Business/industry verticals | FinTech, SaaS, EdTech, Analytics, E-commerce |
| `concepts` | Abstract technical ideas | REST APIs, CI/CD, ETL, Observability, Data Pipelines, RAG, LLMs |
| `scale` | Impact/size indicators | Production System, 10M+ Rows, Greenfield, Migration |
| `soft_skills` | Human/interpersonal skills | Communication, Leadership, Teaching, Cross-cultural, Mentoring |

**Taxonomy entry shape:**
```json
{
  "slug": "data-engineer",
  "display_name": "Data Engineer",
  "type": "roles",
  "icon": null,
  "color": null,
  "related": ["backend", "data-analyst"]
}
```

---

### `experience.json`

Array of experience entries. Each entry has a base shape shared by all types, plus type-specific extension fields.

**Entry types:** `job` | `project` | `education` | `personal`

**Base fields (all types):**

| Field | Type | Notes |
|---|---|---|
| `id` | string | kebab-case unique slug. Format: `{company}-{role}-{year}` for jobs |
| `title` | string | Role or experience name |
| `type` | string | Discriminator: `job`, `project`, `education`, `personal` |
| `period` | object | `{ "start": "2022-03", "end": null }` — null end = current |
| `summary` | string | 1–2 sentences. Used in cards and drawer header |
| `description` | string | Full narrative from documentation. Rendered as rich text on full page |
| `tags` | object | Grouped tag slugs. All 8 type keys must be present (use `[]` if empty) |
| `impact` | string[] | Quantifiable outcomes. Powers Page 1 stats bar |
| `media` | object[] | `{ label, url, type }` — type: `repo`, `url`, `demo`, `article`, `certificate` |
| `featured` | boolean | Whether to surface prominently. Default `false` |

**Tags object — all 8 keys required:**
```json
"tags": {
  "roles": ["data-engineer"],
  "languages": ["python", "sql"],
  "technologies": ["snowflake", "airflow"],
  "libraries": ["fastapi", "pandas"],
  "domains": ["fintech"],
  "concepts": ["etl", "data-pipelines"],
  "scale": ["production-system"],
  "soft_skills": ["communication"]
}
```

**Type-specific extension fields:**

`job` adds: `company` (`{ name, url, industry }`), `location`, `employment_type` (`full-time` | `contract` | `freelance` | `part-time`), `team`

`project` adds: `status` (`completed` | `ongoing` | `archived`), `client`

`education` adds: `institution`, `credential` (`degree` | `certification` | `course` | `bootcamp`), `issuer`

`personal` adds: `region`

---

### Data Flow in Next.js

```
taxonomy.json + experience.json
  → imported as typed modules at build time
    → Explorer page: full array, filtered client-side by active tags
    → Story page: filtered by type = "personal" + "job" for timeline
    → /experience/[id]: getStaticPaths generates all IDs, getStaticProps passes single entry
    → Related section: computed at build time from tag overlap scoring
```

---

## 4. Color System

**Principle: one file to change everything.** All colors are CSS custom properties in `globals.css` under `:root`. Tailwind v4 reads these as tokens. No color value appears anywhere else in the codebase.

### Base Palette (Dark Mode Default)

```css
:root {
  /* Backgrounds */
  --color-bg:               #0A0A0F;   /* Page background — near-black, slight blue undertone */
  --color-surface:          #13131A;   /* Cards, drawers, panels */
  --color-surface-elevated: #1C1C26;   /* Hover states, active cards */
  --color-border:           #2A2A38;   /* Subtle borders */

  /* Text */
  --color-text-primary:     #F0F0FF;   /* Slightly cool white — easier on eyes than pure white */
  --color-text-secondary:   #8888AA;   /* Muted labels, dates, metadata */
  --color-text-muted:       #44445A;   /* Placeholders, disabled states */

  /* Accent */
  --color-accent:           #6E56CF;   /* Confident violet-purple */
  --color-accent-hover:     #8670E0;
  --color-accent-subtle:    #6E56CF22; /* 10% opacity — tag backgrounds, highlights */

  /* Tag Type Colors (one per taxonomy type) */
  --color-tag-roles:        #CF566E;   /* Rose */
  --color-tag-languages:    #56A0CF;   /* Sky blue */
  --color-tag-technologies: #56CF9E;   /* Teal */
  --color-tag-libraries:    #CF9A56;   /* Amber */
  --color-tag-domains:      #9E56CF;   /* Purple */
  --color-tag-concepts:     #CF7856;   /* Orange */
  --color-tag-scale:        #56CF56;   /* Green */
  --color-tag-soft-skills:  #CF56B8;   /* Pink */
}
```

**To retheme:** change values in this block only. Nothing else in the codebase needs to change.

**Light mode:** A `[data-theme="light"]` block can override these same variables. Optional — dark is the primary experience.

---

## 5. Site Map & Navigation

### Routes

```
/                     Explorer (landing page)
/story                Timeline narrative
/experience/[id]      Deep-dive for a single entry (statically generated)
/contact              Availability + CTA
```

### Navigation Type: Hybrid

- `/` is the primary landing — richest interaction, most content
- `/story`, `/contact` are full separate pages navigated via top nav
- `/experience/[id]` is only reached via: drawer "Dig deeper" button (new tab), or direct link share. It is **not** in the top nav.

### Navbar (global)

- **Left:** Name / logo — links to `/`
- **Right:** `Explorer` · `My Story` · `Contact`
- **Scroll behavior:** On scroll past Hero, navbar gets `backdrop-blur` + slight background fill. No hard border. Smooth transition via Framer Motion.
- **Mobile:** Hamburger icon → full-screen overlay menu with large nav links.
- **Active state:** Current route link gets accent color treatment.

### Footer (global, minimal)

GitHub · LinkedIn · Email · Copyright line. Nothing else.

---

## 6. Page 1 — The Explorer (`/`)

The heart of the site. Four distinct zones stacked vertically.

---

### Zone 1 — Hero

**Purpose:** First impression in under 5 seconds. Sets tone and immediately invites interaction.

**Components:**

**Name + animated role line**
- Name displayed large, typographic, dominant
- Below it: a line that cycles through role tags with a typewriter or fade animation
- Example: `Data Engineer` → `Backend Developer` → `AI Engineer` → loops
- Tags sourced from `roles` in taxonomy — only roles present in at least one experience entry

**Positioning statement**
- One sharp sentence. Conversational-bold tone.
- Captures technical depth + the soft skill differentiator
- Example structure (placeholder): *"X years building data systems that scale, with the communication skills most engineers skip."*
- Written in first person, direct, not corporate

**CTA pair — two buttons side by side:**
- `Explore my experience` → smooth scroll to Zone 2
- `Read my story` → navigates to `/story`
- These two paths intentionally split: technical recruiter vs. culture-curious hiring manager

**Ambient visual**
- Subtle, non-distracting background element — signals personality without competing with content
- Options (decide at design time): particle/graph network, cursor-reactive gradient, geometric pattern
- Aceternity UI provides pre-built options — choose one that fits the dark palette

---

### Zone 2 — Search & Discovery

**Purpose:** The interactive entry point. Recruiter types what they're thinking; tags surface dynamically.

**Primary: Search Bar**
- Prominent, centered, generous sizing
- Placeholder text: *"Search by skill, tool, or role..."* or similar conversational prompt
- As user types → **tag suggestion dropdown** appears in real time
- Dropdown groups matches by taxonomy type:
  ```
  Languages     Python
  Libraries     Pandas · Pydantic
  Concepts      ETL · Data Pipelines
  ```
- Selecting a tag from dropdown → adds it as an **active filter chip** below the bar
- Multiple tags selectable — each is independently removable
- Empty state (no input yet) → dropdown shows top 5–6 most-used tags across all entries as suggested starting points

**Active Filter Chips**
- Render below the search bar once tags are selected
- Each chip shows: tag display name + small taxonomy type label
  - Example: `Python · Language` `ETL · Concept`
- Each chip has an `×` to remove individually
- `Clear all` link on the right end
- URL updates to reflect active tags: `/?tags=python,etl,data-engineer`
  - Makes filtered views **shareable and linkable** — a recruiter can send a specific filtered view

**Secondary: Role Shortcut Pills**
- A row of pre-built role chips below the search bar (or below active chips)
- Label: *"Common searches"* or *"Quick filters"*
- Clicking one **adds that role tag** to the active chips — same mechanism as search, not a separate system
- Roles shown: derived from `roles` taxonomy entries that appear in at least 2 experience entries
- These are entry-point shortcuts, not a parallel filter system

---

### Zone 3 — Stats Bar

**Purpose:** Instant quantitative credibility, tuned to the active filter state.

**Components:**
- 4–6 animated stat cards in a horizontal row (2×3 grid on mobile)
- Each card: large number + contextual label
- Numbers animate on filter change (count-up via Framer Motion)
- Stats are **computed from filtered entries only** — they respond to the active tags

**Example stats when `Data Engineer + Python` is active:**
- `4 yrs` — *Relevant experience*
- `12` — *Technologies used*
- `3` — *Industries*
- `15M+` — *Rows processed daily* (from scale tags / impact fields)
- `6` — *Projects & roles*

**Data computation:**
- Filter `experience.json` by entries containing all active tag slugs
- Aggregate: count unique technologies, count unique industries/domains, sum years from period fields, surface highest scale tag, count entries
- Computed at runtime (client-side) on filter change — no server needed

---

### Zone 4 — Experience Cards Grid

**Purpose:** Browseable, filtered list of experience entries.

**Layout:**
- 3 columns desktop, 2 columns tablet, 1 column mobile
- Masonry or uniform height — decide at design time (uniform is safer for grid consistency)

**Secondary filter bar (above grid):**
- Sort: `Most recent` | `Most relevant` (relevance = tag overlap score with active filters)
- Additional tag filters: after primary search, allows narrowing further (e.g., role = `Data Engineer`, then add `Snowflake` as secondary filter)
- Entry count: *"Showing 6 of 14 experiences"*

**Experience Card — anatomy:**
- Company name + role title (prominent)
- Date range + employment type badge (`Full-time`, `Contract`, `Freelance`)
- Summary text (1–2 lines, truncated with ellipsis if longer)
- **Tag pills** — tags relevant to current filter are highlighted; non-matching tags shown muted. Visual cue: *"here's why this matched."*
- **Impact highlight** — single most impressive metric from `impact[]`, shown as a pull-quote style stat. Example: *"15M+ rows/day"*
- `View details →` — opens the Drawer (see Section 11)

**Empty state:**
- Never a blank grid
- Friendly message + suggestion to broaden search
- Show the 3 most featured entries as fallback

**Export button:**
- `↓ Download filtered profile` — positioned above grid, understated
- Exports currently filtered entries as CSV
- CSV columns: Title, Company, Period, Summary, Tags (pipe-separated), Impact (pipe-separated)
- Client-side generation — no server

---

## 7. Page 2 — The Story (`/story`)

**Purpose:** The human layer. A completely different emotional register from Page 1. Less data, more narrative. This page makes the case that soft skills aren't an afterthought — they're foundational.

**Structure: Three acts, not a flat timeline.**

---

### Act 1 — Before Tech (The Foundation)

Covers hospitality, teaching, and travel years. The framing is deliberate: these are *where the communication skills, cultural intelligence, and resilience come from.* Not "other jobs before the real career."

**Components:**

**Chapter header**
- Large act title (e.g., *"Before the terminal"* or similar — tone TBD)
- Short framing sentence, first person, sets the narrative intent

**Vertical timeline**
- Alternating left/right on desktop, single column on mobile
- Each entry: year range · location · title · 2–3 sentence narrative · `soft_skills` tag cluster
- Entries sourced from `experience.json` where `type = "personal"`

**Country count / travel visual**
- Gestural, not a full interactive map
- Options: stylized world map with location dots, or an animated counter (*"~20 countries"*)
- Subtle — supports the narrative, doesn't compete with it

**Pull quotes**
- 1–2 first-person reflective sentences pulled out typographically (large, styled differently)
- Make the page feel personal, not like a resume appendix

---

### Act 2 — The Pivot

The deliberate transition into tech. A story moment — most engineers started in CS at 18. The contrast is the point.

**Components:**

**Narrative block**
- Short first-person paragraph about the why and how of the transition
- Written like a human, not a cover letter
- This is authored copy — not derived from JSON

**Transition visual / divider**
- A moment that marks the shift tonally
- Options: year marker, color shift, animated line, visual metaphor
- Exact treatment decided at design time

---

### Act 3 — The Technical Career

Professional tech experience as a narrative arc.

**Components:**

**Timeline continuation**
- Same visual language as Act 1
- Entries sourced from `experience.json` where `type = "job"` or `type = "project"`
- Each entry links to its full page via `Dig deeper →` (opens `/experience/[id]` in new tab — same behavior as drawer button)

**Skills growth visualization**
- Optional but high-impact
- Shows how tag coverage expanded over time — technologies and concepts appearing as career progressed
- Not a bar chart — something more elegant and narrative (timeline-based, Framer Motion animated)
- Implementation decided at design time

**"Now" marker**
- Timeline ends with current state
- Current focus, what you're looking for, direct link to `/contact`

---

## 8. Page 3 — Deep Dive (`/experience/[id]`)

**Purpose:** Full detail on a single entry. Destination for serious recruiters. Opened in a **new tab** via the "Dig deeper" button in the Drawer. Also the target of any shared direct links.

**How it's reached:**
- Drawer → `Dig deeper ↗` button (new tab)
- Direct URL share (e.g., recruiter shares with hiring manager)
- Timeline entry on `/story` → `Dig deeper →` link (new tab)
- **Not** in the top navigation

**Layout:** Two-column on desktop (sidebar left, main content right). Single column on mobile.

---

### Sidebar

- Company name + link (if `type = "job"`)
- Role title
- Period + duration (computed)
- Location + employment type
- **Full tag cloud** — all tags for this entry, grouped by taxonomy type with type color labels
- Top impact statements (all of them, not just top 3)
- Media links (repos, URLs, certificates)
- `← Back` link — goes to `/` (Explorer). Note: since this opens in a new tab, "back" = close tab or go to Explorer fresh.

### Main Content

- Role title (large, repeated — this is the page heading)
- Company + period (subtitle)
- Full `description` rendered as rich Markdown/HTML — all detail from documentation
- Headings, bullet points, code blocks if any — whatever structure the source markdown has

### Related Experience Section (bottom of page)

See Section 12 for full logic. Displays top 3 entries by weighted tag overlap score.

**Related card (lighter than grid card):**
- Title + company + period
- Top 3 matching tags highlighted (showing *why* they're related)
- Link: opens `/experience/[id]` for that entry (same tab, since we're already on a full page)

---

## 9. Page 4 — Contact (`/contact`)

**Purpose:** One clear destination. Minimal. No clutter.

**Components:**

**Availability status badge**
- Prominent, top of page
- Two states: `Open to opportunities ✓` | `Not currently looking`
- Controlled by a single boolean in a config file (not in `experience.json`)
- Visual treatment: green for open, muted for not looking

**What you're looking for**
- 2–3 sentences: role type, preferred environment (remote/hybrid), location/timezone constraints
- Sets expectations, saves everyone's time
- Authored copy, updated manually

**Contact method**
- Primary: email link (`mailto:`) — direct, no friction
- Optional: Calendly embed or link for scheduling
- One method is enough — don't add every platform

**Download resume**
- Full PDF resume download — the traditional format for people who need it
- Clearly labeled as "full resume" to distinguish from the filtered CSV export on Page 1

---

## 10. Global Components

Components used across multiple pages. These are the shared design system primitives.

---

### Tag Pill

The most-used component in the site. Every tag renders through this.

**Props:**
- `slug` — looks up display name and type from taxonomy
- `type` — taxonomy type (determines color)
- `state` — `active` | `inactive` | `muted` | `removable`

**States:**
- `active` — full type color, filled background (10% opacity fill + colored text + colored border)
- `inactive` — default, type color at reduced opacity
- `muted` — shown when tag doesn't match current filter — greyed out, still visible
- `removable` — active state + `×` button (used in filter chip row)

**Build this component first.** It's used in: search dropdown, active filter chips, experience cards, drawer, full page sidebar, related cards, story timeline entries.

---

### Navbar

- Height: 64px
- Default: transparent background
- On scroll: `backdrop-blur-md` + `bg-surface/80` (80% opacity surface color)
- Transition: Framer Motion `AnimatePresence` or CSS transition
- Mobile breakpoint: hamburger icon → full-screen overlay, large text links, same nav items

---

### Experience Card

Used in: Explorer grid, Related section.

**Props:** full entry object + `filterTags` (active slugs, used to determine tag highlight state)

**Anatomy:**
- Company + role (heading)
- Period + employment type badge
- Summary (2 lines max, ellipsis overflow)
- Tag pills (matching tags highlighted, others muted)
- Impact highlight (first/most impressive item from `impact[]`)
- `View details →` CTA

---

### Stat Card

Used in: Stats Bar (Zone 3).

**Props:** `value` (string | number), `label` (string)

**Behavior:** On mount or value change, animates from 0 to value (count-up) via Framer Motion. Duration ~800ms, ease-out.

---

### Section Header

Reusable heading pattern. `eyebrow` (small label above) + `title` (large) + optional `subtitle`. Used at the top of each zone and page section.

---

## 11. Experience Drawer

Triggered by clicking any Experience Card. Slides in from the right. Grid stays visible and dimmed behind it.

**Behavior:**
- Slide-in animation: Framer Motion `x: "100%" → x: 0`, ease-out, ~300ms
- Background: dimmed overlay (`bg-black/50` or similar), clicking overlay closes drawer
- Scroll: drawer content independently scrollable
- Close: `×` button top-right, or click overlay, or `Escape` key
- **Scroll position in grid is preserved on close**
- URL does **not** change when drawer opens (keeping Explorer URL clean)

**Content:**
- Role title + company (header)
- Period + location + employment type
- Summary
- Full tag cloud (all tags, grouped by type with Tag Pill component)
- Top 3 impact statements
- First paragraph of `description` (teaser — enough to qualify, not the full content)
- `Dig deeper ↗` button → opens `/experience/[id]` in **new tab**
- `← Close` or `×` to dismiss

**Width:** ~480px on desktop, full-width on mobile (bottom sheet behavior on mobile).

**Mobile:** On mobile, drawer becomes a **bottom sheet** — slides up from bottom, 90% viewport height, swipe down to dismiss.

---

## 12. Related Experience Logic

Used in: `/experience/[id]` page, bottom section.

**Algorithm: weighted tag overlap scoring**

For each other entry in `experience.json` (excluding the current entry):

1. For each shared tag slug, add points based on tag type weight:

| Tag type | Weight | Rationale |
|---|---|---|
| `concepts` | 3 pts | Shared abstract skills are most meaningful |
| `technologies` | 2 pts | Shared tools signal real overlap |
| `roles` | 2 pts | Same job type = directly comparable |
| `languages` | 1 pt | Common, less differentiating |
| `libraries` | 1 pt | Useful but granular |
| `domains` | 1 pt | Industry context |
| `scale` | 1 pt | Useful context |
| `soft_skills` | 1 pt | Relevant but not primary signal |

2. Sort all entries by total score, descending.
3. Take top 3.

**Computed at build time** in `getStaticProps` for each `/experience/[id]` page. Passed as a prop — no client-side computation needed.

**Related card displays:**
- Title + company + period
- Top 3 matching tag slugs highlighted (showing *why* they're related)
- `View →` link to `/experience/[id]` for that entry (same tab)

---

## 13. Copy Tone

**Professional-conversational.**

- First person throughout, but measured — not casual
- Confident and direct without being edgy or trying too hard
- Reads like a senior engineer who communicates well, not a marketer
- Technical precision where it matters, plain English everywhere else
- Warm but not informal — a tone you'd use in a well-written cover letter or a thoughtful LinkedIn post
- No buzzwords, but also no deliberate anti-corporate posturing
- Humor is not the goal — clarity and credibility are
- Short sentences preferred over long ones, but not at the expense of completeness

**Examples of the tone:**

❌ *"Highly motivated data engineering professional with a proven track record of delivering scalable solutions."*

❌ *"I build data systems that don't fall over. I also explain them to people who don't care about data systems."* (too casual)

✅ *"I build data infrastructure that handles real scale — and I make sure the people who depend on it actually understand what it does."*

---

## 14. Responsive Strategy

**Desktop-first design, fully responsive implementation.**

| Breakpoint | Behavior |
|---|---|
| `xl` (1280px+) | Full layout, 3-column card grid, drawer at 480px |
| `lg` (1024px) | 2-column grid, drawer at 420px |
| `md` (768px) | 2-column grid, navbar collapses to hamburger |
| `sm` (640px) | 1-column grid, drawer becomes bottom sheet |
| `xs` / mobile | Full-width everything, bottom sheet, stacked zones |

**Drawer → Bottom Sheet on mobile:**
- Below `sm` breakpoint, drawer renders as a bottom sheet (slides up from bottom)
- 90% viewport height
- Swipe down gesture to dismiss (via Framer Motion drag constraints)

**Stats Bar on mobile:**
- 2×3 grid instead of horizontal row

**Hero on mobile:**
- CTA buttons stack vertically
- Animated role line still present but font size reduced

---

## 15. Build Order

Build components in this order to minimize rework. Each step depends on the previous.

1. ✅ 2026-05-24 **Color tokens & `globals.css`** — set up the full CSS custom property system first. Everything else references these. *(Lives in `src/app/globals.css`, exposed to Tailwind v4 via `@theme inline`.)*
2. 🟡 **`taxonomy.json` + `experience.json`** — schema-correct empty skeletons committed (`src/data/`); still need to populate with real data using the `portfolio-json-builder` skill before building data-dependent components.
3. ✅ 2026-05-24 **TypeScript types** — `TaxonomyEntry`, `ExperienceEntry` discriminated union, `TagMap`, plus `ITaxonomyRepository` / `IExperienceRepository` interfaces with JSON impls under `src/lib/`. All components will type against these.
4. ✅ 2026-05-24 **Tag Pill component** — all 4 states live in `src/components/tags/TagPill.tsx` with a single prop interface (LSP). Color flows through `tag-colors.ts` → CSS vars, so adding a tag type stays a one-line CSS change. Demo matrix renders 8 types × 4 states at `/`.
5. ✅ 2026-05-24 **Navbar + Footer** — global shell. Navbar in `src/components/layout/Navbar.tsx` (sticky, scroll-aware blur, mobile sheet via Framer Motion, `aria-current` on active route). Footer in `Footer.tsx`. Links sourced from `nav-items.ts` + `social-links.ts` — adding a route or social is a one-line OCP change. Wired in `src/app/layout.tsx`.
6. ✅ 2026-05-24 **Experience Card** — `src/components/experience/ExperienceCard.tsx`. Single component handles all 4 entry types via helpers in `src/lib/experience/format.ts` (`getHeadingLine`, `getMetaBadge`, `formatPeriod`, `getImpactHighlight`). Tag-pill state driven by `filterTags`: matched → `active`, others → `muted`, no filter → `inactive`. Slug-to-label via `src/lib/taxonomy/format.ts` (taxonomy lookup with titleize fallback).
7. ✅ 2026-05-24 **Search bar + tag dropdown** — `src/components/search/SearchBar.tsx`. Accessible WAI-ARIA combobox (input `role="combobox"`, popup `role="listbox"`, options `role="option"`, `aria-activedescendant` for keyboard nav). Keyboard: ↑/↓/Enter/Esc/Tab. Suggestions grouped by taxonomy type, colored via the existing `tagColorVar` map. Empty state surfaces `topSuggestions` (passed in from `topTagsByUsage()`). Search algorithm behind `SearchStrategy` interface (`src/lib/search/types.ts`) — default `SubstringSearchStrategy` ranks exact > prefix-on-name > prefix-on-slug > contains; fuzzy/synonym strategies drop in as sibling files (OCP).
8. **Active filter chips** — the state that connects search to grid.
9. **Stats Bar** — wire to filtered entry computation.
10. **Explorer page (`/`)** — assemble Zone 1–4 with all the above components wired together.
11. **Drawer** — build on top of the working Explorer. Uses the same card data.
12. **Deep Dive page (`/experience/[id]`)** — static generation, sidebar + main content layout, Related section.
13. **Story page (`/story`)** — timeline, acts, travel visual.
14. **Contact page (`/contact`)** — simplest page, build last.
15. **Polish pass** — Framer Motion animations, count-up stats, Hero ambient visual, Aceternity UI sections, mobile bottom sheet behavior.

---

*Last updated: 2026-05-24 — scaffold landed. All design decisions above are confirmed unless noted as "decide at design time."*

---

## 16. Implementation Notes (additions to the plan, post-scaffold)

These items are not in the original plan but are now part of the project's reality. Future passes should respect them.

### 16.1 SOLID-aligned `src/lib/` layout
The `src/lib/` directory isolates each domain concern so common changes touch one file:

- `taxonomy/` — `TagType`, `TaxonomyEntry`, `ITaxonomyRepository` + `JsonTaxonomyRepository` (singleton `taxonomyRepository`).
- `experience/` — Discriminated `ExperienceEntry` union (job/project/education/personal), `IExperienceRepository` + JSON impl.
- `filters/` — `FilterStrategy` interface; `AllTagsMatchStrategy` is the default. New rules drop in as sibling files (OCP).
- `related/` — `IRelatedScorer` + `WeightedTagOverlapScorer` implementing the §12 weights.
- `stats/` — `StatComputer<T>` interface, one stat per file in `computers/`, registered in `registry.ts` (consumed by the Stats Bar).

Components import the **interfaces**, never the JSON impls. A composition root will be introduced when the first component needs it.

### 16.2 Docker is the canonical dev environment
- `docker compose up dev` → hot-reloading Next.js on `http://localhost:3000`
- `docker compose --profile preview up --build preview` → nginx serving the static export on `http://localhost:8080`
- Multi-stage `Dockerfile`: `base → deps → dev / builder → prod` (`nginx:alpine`).
- `pnpm-lock.yaml` is generated on first build and then enforced via `--frozen-lockfile`.

### 16.3 Package manager: pnpm
The plan didn't specify a package manager. The project uses **pnpm 9.x** (pinned via Corepack inside Docker) for faster installs and strict dependency isolation.

### 16.4 Next.js pinned to 15.4.11
Both 15.5.x and 16.x trigger a `useContext` null error during static-export prerender of the internal `/_global-error` route (and the `<Html>` fallback when a custom `global-error.tsx` is provided). 15.4.11 builds the static export cleanly with the same React 19.0.0 + Tailwind v4 stack. Reassess when bumping — verify `pnpm build` still produces `out/index.html` without prerender errors.

---

## Status Log

- **2026-05-24** — Build Order step 7 landed: `SearchBar` accessible combobox + grouped suggestion dropdown + `SearchStrategy` interface + default `SubstringSearchStrategy` (4-tier ranking: exact / prefix-on-name / prefix-on-slug / contains) + `topTagsByUsage` helper for the empty-state. Component stays presentational — caller passes `suggestions`, `topSuggestions`, `excludeSlugs`, and `onSelect`; eventual Explorer wires it to `taxonomyRepository.getAll()` and `topTagsByUsage(experienceRepository.getAll())`. Keyboard: ↑/↓/Enter/Esc/Tab; click-outside closes; selection clears query and keeps focus so picks chain. Demo page now drives `ExperienceCard.filterTags` live from the search → state and renders selected slugs as removable `TagPill`s above the grid (preview of step 8's Active Filter Chips). New files: `src/lib/search/{types,substring}.ts`, `src/lib/taxonomy/top-tags.ts`, `src/components/search/SearchBar.tsx`. Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` now 8.54 kB), dev container on port 3001 returns `role="combobox"` + `aria-autocomplete="list"` + `aria-controls` + correct placeholder in SSR markup.
- **2026-05-24** — Build Order step 6 landed: `ExperienceCard` (presentational, SRP) with type-aware formatting helpers in `src/lib/experience/format.ts` and slug→label helper in `src/lib/taxonomy/format.ts` (taxonomy lookup with titleize fallback so the component renders before `taxonomy.json` is populated). Card anatomy follows plan §10: heading (role + company/client/institution/region per type), meta row (period + employment/status/credential badge), 2-line `line-clamp` summary, flattened tag pills colored by type, impact pull-quote on the accent border, "View details →" CTA. Filter behavior: no filter → all `inactive`; with filter → matched `active`, rest `muted`. Placeholder page upgraded to a 3-column responsive grid with two mock entries (job + project) and an interactive filter-chip control so the highlight/muted transition is visible. Demo button calls `onSelect` → console (Drawer wires up at step 11). Schema note: `TaxonomyEntry` gained an optional `image: string | null` field (user-added, supports Simple Icons logos later). Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` now 6.76 kB), one-off dev container on host port 3001 returns both cards with correct period/badge/impact and pill-state counts (11 active, 34 muted) matching the active filter (`python`, `etl`).
- **2026-05-24** — Build Order step 5 landed: global `Navbar` (sticky 64px, transparent → `backdrop-blur-md`+`bg-surface/80` once scrolled past 16px, mobile hamburger → full-screen overlay with Framer Motion fade+slide, `aria-current="page"` on active route, ESC + route-change auto-close, body scroll lock while open) and `Footer` (GitHub / LinkedIn / Email — single-path SVG icons, no emoji — + copyright). Nav items in `src/components/layout/nav-items.ts`, socials in `social-links.ts` — both consumed by their components so additions are one-line OCP changes. Layout shell switched to `min-h-screen flex flex-col`. Placeholder page trimmed (Navbar carries identity now). Verified in Docker: lint ✅, type-check ✅, static export build ✅ (`/` now 1.93 kB after demo-header trim), dev container served on host port 3001 (other project occupied 3000) returns all expected ARIA markers + nav items + socials.
- **2026-05-24** — Build Order step 4 landed: `TagPill` component with all four states (`active` / `inactive` / `muted` / `removable`), single prop interface (LSP), color lookup via `src/components/tags/tag-colors.ts` → CSS vars. Added `cn()` utility at `src/lib/utils.ts` (clsx + tailwind-merge). Placeholder `/` page upgraded into an 8×4 demo matrix that visually verifies type→color flow and includes a working remove → restore interaction. Verified in Docker: lint ✅, type-check ✅, build ✅ (8.72 kB for `/`), dev server on `:3000` renders all 32 pill variants.
- **2026-05-24** — Initial scaffold landed and end-to-end verified in Docker. Stack: Next.js 15.4.11 + React 19.0.0 + TS 5.7 + Tailwind v4 + Framer Motion 11. Multi-stage `Dockerfile` (`base → deps → dev / builder → prod`) and `docker-compose.yml` with `dev` (port 3000) and `preview` (nginx:alpine on port 8080) profiles. Color tokens in `src/app/globals.css` exposed to Tailwind via `@theme inline`. Full SOLID `src/lib/` layer (taxonomy, experience, filters, related, stats — interfaces + JSON impls, four stat computers wired through a registry). Empty schema-correct seed JSON. Placeholder `/` and `not-found.tsx` pages. `.claude/CLAUDE.md` refreshed with Docker / SOLID / plan-sync sections. Verified: `pnpm lint`, `pnpm type-check`, `pnpm build` (produces `out/index.html`), `docker compose up dev` (200 on `:3000`), `docker compose --profile preview up preview` (200 on `:8080`). Next.js version pinned at 15.4.11 — 15.5.x and 16.x both fail static-export prerender of `/_global-error`.
