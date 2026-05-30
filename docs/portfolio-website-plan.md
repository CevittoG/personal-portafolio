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

**Light mode:** Now in scope (see §17 Theme System). A `[data-theme="light"]` block on `<html>` overrides every variable above. Dark remains the primary/default experience. The same eight tag-type colors are re-tuned for light backgrounds so chips keep their type identity without burning the eyes (lower saturation, slightly darker base, same hue family).

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
- **Right:** `Explorer` · `My Story` · `Contact` · **Theme toggle** (sun/moon icon, see §17) · **Language switcher** (`EN` / `ES`, see §18)
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

**Logo Cluster (between Hero CTAs and Zone 2 title)**

A signature moment that translates "the stack I work with" into something alive and ambient, while remaining tasteful. *(Motion model superseded on 2026-05-25 — see Status Log. The original "drop from above + spring bounce" entrance was replaced by a quieter, continuous floating cluster with cursor-driven repel; component file is still named `LogoDropCluster.tsx`.)*

- **What it is:** the `image` field on every `taxonomy.json` entry (Simple Icons SVG URLs for languages / libraries / technologies) is collected into a single set of unique logos. They pop into existence (opacity + scale stagger) inside a dedicated band that sits **between the Hero CTA pair and Zone 2's "What are you looking for?" search title**, then float continuously and **respond to the cursor** by being repelled outward when the pointer comes near.
- **Source of truth:** `taxonomyRepository.getAll().filter(t => t.image)` → deduped by `image` URL. New logos appear automatically when added to taxonomy (OCP — no animation code change needed).
- **Visual target:** soft, alive, not perfect grid. Logos overlap slightly, sit at slightly varied base rotations (±6°), with subtle drop shadows. The cluster reads as a single object that breathes.
- **Motion spec:**
  - **Entrance:** each logo fades + scales from `{opacity: 0, scale: 0.5}` to `{opacity: 1, scale: 1}` on a 70 ms × index stagger, 550 ms duration, ease-out-quint. Total entrance ≈ 1.95 s for ~20 logos.
  - **Continuous float:** infinite mirror loop on `y: [0, -8, 0, 8, 0]`, `x: [0, 6, 0, -6, 0]`, `rotate: [base, base+5, base, base-5, base]`. Per-logo duration 5–10 s and phase 0–4 s, both seeded by slug so server and client agree and the cluster never pulses in sync.
  - **Cursor repel:** single window `mousemove` listener at the cluster level; each logo runs a Framer Motion `useAnimationFrame` loop that reads the shared cursor position, computes distance to its own center, and — if within 150 px — sets a repulsion target along the cursor-to-center vector with magnitude `(1 - distance/150) × 50 px`. A spring (`stiffness: 300, damping: 20`) smooths the displacement. When the cursor leaves the radius, the target snaps to 0 and the logo springs home.
  - Tooltip on hover: tag display name (`title` attribute).
- **Layout:**
  - Dedicated band, full-width, ~200–260 px tall on desktop, ~140–180 px on mobile
  - Logos absolutely positioned inside the band; cluster centered horizontally
  - Logo size: ~40–48 px on desktop, ~28–32 px on mobile; SVG, not raster
- **Accessibility:**
  - Wrap in a region with `aria-label="Technologies I work with"` and a visually hidden `<ul>` of tag names for screen readers
  - Respect `prefers-reduced-motion`: no entrance, no float, no cursor listener attached — logos render statically at their seeded positions with their base rotation
  - Logos are decorative for sighted users; the screen-reader list carries the semantic content
- **Performance:**
  - SVGs loaded via `<img>` with `loading="eager"` (above-the-fold) and `decoding="async"`
  - Simple Icons CDN is already a remote dependency; preconnect in `<head>`
  - Animation runs on `transform` + `opacity` only — no layout thrash
  - One shared cursor ref + one window listener, not one listener per logo
- **Implementation home:** `src/components/hero/LogoDropCluster.tsx`, consumed by `Hero`. Physics via Framer Motion `useMotionValue` + `useSpring` + `useAnimationFrame` (no extra library). Mounted gate defers entrance to post-hydration; a deterministic seed (hash of slug → mulberry32 PRNG) keeps positions and float timing stable across renders.

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
- Each entry: year range · location · title · reflective `personal_impact` line · `soft_skills` tag cluster
- Entries sourced from `experience.json` where `story_act = "foundation"` (non-technical chapters — sport, hospitality, teaching, mentoring). Independent of `type`/`relevant`.

**Country count / travel visual**
- Gestural, not a full interactive map
- Options: stylized world map with location dots, or an animated counter (*"~20 countries"*)
- Subtle — supports the narrative, doesn't compete with it

**Pull quotes** *(shipped via `personal_impact`)*
- Each timeline card renders its `personal_impact` line (1–2 reflective sentences) in place of the factual `summary`, styled as a quiet accent-rule italic pull-quote
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
- Entries sourced from `experience.json` where `story_act = "technical"` (engineering roles)
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
8. ✅ 2026-05-24 **Active filter chips + URL sync** — `useFilterTags()` hook (`src/lib/filters/use-filter-tags.ts`) owns the slug array ↔ `?tags=python,etl` contract via `history.replaceState` + `popstate` (no Suspense boundary needed under static export). `ActiveFilterChips` (`src/components/filters/ActiveFilterChips.tsx`) is presentational — caller passes slugs + a `taxonomyBySlug` lookup (DIP) and the chips render via `TagPill` with a new optional `sublabel` slot ("Python · Language"). Clear-all sits at the row's end. Demo page now drives state through the hook end-to-end.
9. ✅ 2026-05-24 **Stats Bar** — `StatCard` (`src/components/stats/StatCard.tsx`) animates numeric values from 0 on mount and on change via Framer Motion `animate()` (~800ms ease-out), with an optional `suffix` prop (e.g. `" yrs"`) appended through the count-up. `StatsBar` (`src/components/stats/StatsBar.tsx`) filters the entry array via `defaultFilterStrategy`, runs the registered `StatComputer` instances, and feeds each result into a `StatCard`. `StatComputer` interface gained `suffix?: string` for animation-compatible units. Layout: 2-col grid mobile, 4-col row sm+. Adding a stat = new computer file + one registry line (OCP).
10. ✅ 2026-05-24 **Explorer page (`/`)** — Zones 1–4 assembled at the real `/` route. New components: `Hero` + `AnimatedRoleLine` (`src/components/hero/`) — name, cycling role line via Framer Motion AnimatePresence (honors `prefers-reduced-motion`), positioning sentence, two CTAs (`Explore my experience` smooth-scrolls to `#discover`, `Read my story` → `/story`), and a subtle radial-gradient ambient backdrop (Aceternity swap deferred to step 15). `RoleShortcuts` (`src/components/search/`) renders the "Common searches" pill row, sourced from roles that appear in ≥ 2 entries (per plan §6). `ExperienceGrid` (`src/components/explorer/`) wraps the card grid with the secondary filter bar (sort selector + count + Download filtered profile button) and the empty state with a featured fallback. New libs: `src/lib/experience/sort.ts` (`recent` | `relevant` with tag-overlap scoring + recency tiebreaker), `src/lib/experience/csv.ts` (RFC-4180 quoting + UTF-8 BOM, columns per plan), and `src/lib/site/config.ts` (authored name/positioning/email/availability — single edit point). All data flows through `experienceRepository.getAll()` + `taxonomyRepository.getAll()`; no component imports JSON directly (DIP). The old component playground moved to `/playground` (not in nav).
11. ✅ 2026-05-24 **Drawer** — `ExperienceDrawer` (`src/components/explorer/ExperienceDrawer.tsx`) is one presentational component that swaps layout via `useMediaQuery("(min-width: 640px)", true)` (`src/lib/hooks/use-media-query.ts`). Desktop: right slide-over, ~480px wide, animates `x: 100% → 0` via Framer Motion (~300ms ease-out). Mobile: bottom sheet, 90vh, swipe-down to dismiss (`drag="y"`, dismiss threshold 120px / 600px·s). Overlay click + Escape + × button all close; body scroll locked while open; close button gets initial focus. `role="dialog"` + `aria-modal="true"` + `aria-labelledby` on the title. URL stays untouched (plan §11). Content: heading + sub-header (location/employment), summary, optional description teaser (first paragraph via new `getDescriptionTeaser`), top 3 impact bullets, full tag cloud grouped by type with `TagPill` and `tagTypeLabel` headers. Footer button "Dig deeper ↗" opens `/experience/[id]` in a new tab (target page lands at step 12 — link 404s until then by design). Helpers added: `getDrawerSubMeta` + `getDescriptionTeaser` in `src/lib/experience/format.ts`. Wired into both the real Explorer and the playground demo.
12. ✅ 2026-05-24 **Deep Dive page (`/experience/[id]`)** — pure server component at `src/app/experience/[id]/page.tsx`. Static generation via `generateStaticParams()` over `experienceRepository.getAll()`; per-entry `generateMetadata()` produces a real `<title>`/`description`. Two-column on `lg+` (sidebar 18rem + main 1fr), single column below. Sidebar (sticky on `lg+`) carries: company link (job entries with URL get `target="_blank"`), period + computed duration via new `humanDuration()`, sub-meta (location · employment), badge, all impact lines, full tag cloud grouped by `TAG_TYPES` with `tagTypeLabel` headers, and media links (each opens a new tab). Main column: large `<h1>`, `secondary · period` subtitle, summary lede, then the full description rendered through the new tiny renderer at `src/lib/experience/description.tsx` (paragraphs + `**bold**` only — measured the real data first, skipped 50 KB of `react-markdown`). Related section uses `defaultRelatedScorer.topN(entry, all, 3)` via `RelatedExperience` (`src/components/experience/`), each card highlighting its top matching tags as `active` `TagPill`s with a "View →" affordance. Page ships **0 client JS** (160 B route). Reached only via the Drawer's "Dig deeper ↗" (new tab) or a direct link — not in nav per §5.
13. ✅ 2026-05-24 **Story page (`/story`)** — pure server component at `src/app/story/page.tsx` (163 B, 0 client JS). Three acts assembled per §7: Act 1 *Before the terminal* (sources `type: "personal"`), Act 2 *The pivot* (authored prose via `PivotInterlude`), Act 3 *Building systems* (sources `type: "job" | "project"`, each entry's heading is a `Link` to `/experience/[id]` with `target="_blank"`). `StoryTimeline` (`src/components/story/`) renders a vertical timeline with a centre rail on `lg+` (entries alternate left/right via `i % 2`) and a left-rail single column below; each row shows period + sub-meta, heading, summary, and a `highlightTagType` chip cluster (Act 1 uses `soft_skills`, Act 3 uses `concepts`). `NowMarker` closes the timeline with a CTA → `/contact`. Authored copy lives in `src/lib/site/story-copy.ts` — chapter eyebrows, intros, pivot paragraphs, now-marker body — one edit point for tone changes. Empty acts get an `ActPlaceholder` instead of a missing section, so Act 1 currently shows a graceful "Personal milestones are being written up" message until `personal` entries land. Travel visual + skills-growth viz deferred to step 15 polish.
14. ✅ 2026-05-24 **Contact page (`/contact`)** — pure server component at `src/app/contact/page.tsx` (127 B, 0 client JS). Centered single-column layout: availability badge (green pulse + `Open to opportunities` when `siteConfig.availability.open`, muted `Not currently looking` otherwise), large heading, location/timezone note, a "what you're looking for" callout, primary `mailto:` button, and an optional resume PDF link (rendered only when `siteConfig.resume` is non-null — drop a PDF in `public/` and flip the config to enable). `siteConfig` gained `availability.lookingFor: string` and `resume: { label, href } | null` (single edit point for tone/state changes).
15. ✅ 2026-05-24 **Polish pass** — five layers shipped: (A) `<Reveal>` + `<RevealStagger>` motion primitive (`src/components/motion/`), (B) scroll-linked rail on `/story` via Framer Motion `useScroll` + `useSpring` (custom-built; Aceternity TracingBeam is hard-coded for a left-rail layout and doesn't fit the alternating centre rail), (C) micro-interactions across `ExperienceCard` (hover lift + accent border + shadow), `SearchBar` (panel fade), `ActiveFilterChips` (AnimatePresence enter/exit + layout), `RoleShortcuts`/`TagPill` (active-scale), drawer body (sequential reveal of inner sections), (D) global route fade via `src/app/template.tsx` (180ms), (E) Hero refinement — AnimatedRoleLine timing (300ms→450ms ease-out-quint, 2200→2800ms cadence) + soft top-edge vignette in `AmbientBackdrop`. The side-stripe `border-l-2` on the card impact callout was rewritten to a leading accent-dot pattern to comply with the shared design-laws ban on >1px coloured side borders. Motion laws: 180–320ms, ease-out-quint, transform+opacity only, `prefers-reduced-motion` honored per component.
16. ✅ 2026-05-24 **Theme system (dark/light)** — full per plan §17. Light palette landed under `[data-theme="light"]` in `globals.css` with all 8 tag-type colors retuned (lower saturation, slightly darker base, same hue family) plus a darker accent for AA contrast on white. 200ms cross-fade scoped to root bg/color + `html *` border-color. New `src/lib/theme/`: `types.ts` (THEMES, DEFAULT_THEME = `"dark"`, STORAGE_KEY), `storage.ts` (`ThemeStorage` interface + `LocalStorageThemeStorage` — DIP, private-mode safe), `inline-script.ts` (blocking pre-paint resolver: `localStorage.theme` → `prefers-color-scheme` → DEFAULT_THEME), `ThemeProvider.tsx` (context + `useTheme()` hydrating from `<html data-theme>`). `ThemeToggle.tsx` (`src/components/layout/`) is a sun/moon Navbar button with Framer Motion cross-fade between icons, `aria-pressed`/`title` describe the action verb. `suppressHydrationWarning` on `<html>` covers the inline-script's pre-paint attribute mutation.
17. ✅ 2026-05-24 **Logo Drop Cluster** — full per plan §6 Zone 1. `LogoDropCluster.tsx` (`src/components/hero/`) reads a deduped list of taxonomy `image` URLs and drops each from above the band via Framer Motion springs (stiffness 80 / damping 12 / mass 0.8 on `y`, a softer spring on `rotate` for the secondary overshoot). Positions are deterministic via `mulberry32` seeded by `hash32(slug)` — SSR + client agree, no mismatch. Animation defers to post-hydration (`useEffect` toggles `mounted`) so the static fallback is never half-dropped. Layout: full-width band (160 mobile / 220–240 desktop), inside Hero between the CTAs and Zone 2's title, vertical edge mask softens the band boundary. Accessibility: labeled region, visually hidden `<ul>` of tag names, fade-in fallback on `prefers-reduced-motion`. Hover: gentle lift + scale. Performance: SVGs via `<img loading="eager" decoding="async">`, Simple Icons CDN preconnect added to `<head>`. New helper `logoSourcesFromTaxonomy()` (`src/lib/taxonomy/logos.ts`) feeds `Hero` via a `logos` prop (DIP — component never reaches the repo).
18. ✅ 2026-05-24 **Internationalization (EN/ES)** — full per plan §18, with one deliberate library deviation. Built a custom thin i18n layer in `src/i18n/` instead of `next-intl` because static export blocks the middleware-based EN-unprefixed routing the plan requires (next-intl forces `localePrefix: 'always'` under static export, which loses `/`). The custom layer gives the same `t("key", values)` call site at a fraction of the dep weight, and migrating to next-intl later remains trivial since the API surface is identical. Files: `locale.ts` (LOCALES `["en","es"]`, DEFAULT_LOCALE `"en"`, `LOCALE_COOKIE`, `localePathPrefix`), `messages/{en,es,index}.ts` (typed catalogues; `Messages = typeof en` enforces shape parity across locales), `translator.ts` (dot-notation resolver with `{name}` interpolation; typed `MessageKey<T>` constrains call sites to existing keys), `I18nProvider.tsx` (context + `useTranslations` / `useLocale` / `useMessages`), `server.ts` (`getTranslator(locale)` / `getMessages(locale)` for RSCs), `inline-script.ts` (pre-paint `<html lang>` patch on `/es/...` paths), `path.ts` (`withLocale` / `stripLocale` / `switchLocale`). Routes restructured into two trees: `app/(en)/...` (route group invisible in URLs — `/`, `/story`, `/contact`, `/experience/[id]`) and `app/es/...` (Spanish mirror under the `/es` prefix). Each tree has its own `layout.tsx` providing an `I18nProvider` pinned to its locale plus Navbar + Footer (root layout couldn't branch on URL under static export, so locale-specific shell lives in the per-tree layouts). Page bodies extracted into shared, locale-aware components: `Explorer.tsx` (client, reads locale via `useTranslations`), `Story.tsx` / `Contact.tsx` / `DeepDive.tsx` (server, take `locale: Locale` as a prop and call `getTranslator(locale)`). `LanguageSwitcher.tsx` in the Navbar (two pills `EN`/`ES`, active gets accent) writes `NEXT_LOCALE` cookie and navigates via `switchLocale()` (preserves query + hash so a filtered `/?tags=python` becomes `/es?tags=python`). Stat computers gained an optional `labelKey` field; the registry is untouched (OCP — `StatsBar` resolves it at render time). Social-link `ariaLabel` and nav-item `label` became typed `labelKey: MessageKey` references. Per-route metadata emits `alternates.languages`, so every page renders `<link rel="alternate" hreflang="…">` for `en`, `es`, `x-default`. Per plan §18 Phase 1, experience descriptions and taxonomy `display_name` stay in their authored language; taxonomy `display_name_es` migration is deferred. Verified: 14 prerendered pages (7 EN + 7 ES), Spanish content present in `out/es*.html`, English in `out/index.html`, hreflang present on every page, `<title>` correctly localized per route.

---

*Last updated: 2026-05-24 — Build Order steps 1–18 landed. All design decisions above are confirmed unless noted as "decide at design time."*

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

## 17. Theme System (Dark / Light)

Dark is the primary experience and the default for first-time visitors. A user-facing toggle lets visitors switch to light at any time and the choice persists across visits.

**Tokens:** all colors are already CSS custom properties in `src/app/globals.css`. Light mode is purely a second `:root` block scoped by `[data-theme="light"]`. **No component code changes** when retheming — that is the entire reason the color system exists.

**Light palette intent (decide exact values at design time):**
- `--color-bg` near-white with a faint warm cast (e.g. `#FAFAFC`), not pure `#FFFFFF` — easier on eyes
- `--color-surface` slightly off-white (`#F4F4F8`); `--color-surface-elevated` one step lighter than surface
- `--color-border` light grey (`#E5E5EC`)
- `--color-text-primary` deep slate (`#0F1020`); `--color-text-secondary` `#4A4A5E`; `--color-text-muted` `#8888A0`
- Accent stays in the violet family but darkens slightly for AA contrast on light surfaces
- Tag-type colors keep their hue but drop ~10–15% saturation and darken ~10% so chips remain legible on a light background

**Toggle behaviour:**
- Lives in the global Navbar, rightmost item before/after the language switcher
- Two-state icon button: sun (current = light) / moon (current = dark). `aria-pressed` + visually hidden label "Switch to light/dark theme"
- 200ms `transition` on `background-color` and `color` at `:root` level → entire site cross-fades, no flicker
- Active toggle has `cursor: pointer` and a visible focus ring

**Persistence + SSR safety:**
- Selection saved to `localStorage` under key `theme` (`"dark" | "light"`)
- A tiny **blocking inline script** in `<head>` reads `localStorage.theme` (falling back to `prefers-color-scheme`) and sets `data-theme` on `<html>` **before first paint** — prevents the dark→light flash on reload
- React `ThemeProvider` (`src/lib/theme/`) hydrates from the same source, exposes `useTheme()` (`theme`, `setTheme`, `toggle`) — DIP-friendly so swapping storage (cookie, query param) is one file

**System preference:**
- First visit with no stored preference: respect `prefers-color-scheme` (defaulting to dark if it returns `no-preference` or `dark`)
- Manual override always wins once set

**Animation in light mode:**
- The Hero ambient visual and the Logo Drop Cluster keep the same motion; only the backdrop tint changes
- Drop-shadow opacities on cluster logos are lifted slightly in light mode so logos still feel like they're sitting on the surface

**File ownership:**
- `src/app/globals.css` — both palettes
- `src/lib/theme/` — `ThemeProvider`, `useTheme`, storage adapter
- `src/components/layout/ThemeToggle.tsx` — the navbar control

---

## 18. Internationalization (English / Spanish)

The site is bilingual. **English is the default.** Spanish is a first-class alternative — not a machine-translated afterthought.

**What gets translated, what does not:**

| Layer | Translated? | Notes |
|---|---|---|
| Hero copy, positioning sentence, CTAs | ✅ | Authored in both languages |
| Navbar labels, footer | ✅ | |
| All static page copy (`/story` acts, `/contact`) | ✅ | Including pull quotes |
| Stat labels (e.g. "Relevant experience") | ✅ | Numbers + units stay numeric |
| Search placeholder, "Common searches", empty states | ✅ | |
| Tag `display_name` in `taxonomy.json` | 🟡 | Add an optional `display_name_es` (or `display_name: { en, es }` migration) — only translate where it matters. Tech names ("Python", "Snowflake") stay as-is in both languages. Concepts/roles/soft-skills get Spanish display names. |
| Experience entries (`title`, `summary`, `description`, `impact`) | 🟡 | **Phase 1:** content stays in the language it was authored. **Phase 2 (future):** add parallel `_es` fields or a `translations: { es: { title, summary, ... } }` block. Plan v1 ships with EN content + ES UI chrome. |
| Company names, role titles, dates | ❌ | Proper nouns / format-driven |

**Library choice:** `next-intl` — first-class App Router + static export support, lightweight, message catalogues as JSON, ICU MessageFormat for pluralization.

**Routing strategy:** **Locale prefix, English unprefixed.**
- `/` = English Explorer (default, no prefix — preserves existing URLs and shared filtered links)
- `/es` = Spanish Explorer
- `/es/story`, `/es/experience/[id]`, `/es/contact` — same tree under the prefix
- `getStaticPaths` for `/experience/[id]` and `/es/experience/[id]` both enumerate all entry IDs

**Switcher behaviour:**
- Lives in the Navbar, two pills: `EN` `ES` (active pill highlighted with accent)
- Click → navigates to the equivalent route in the target locale (preserves path + query, e.g. `/?tags=python` → `/es?tags=python`)
- Selection persisted in a `NEXT_LOCALE` cookie so subsequent visits land in the chosen language
- `<html lang="en">` / `<html lang="es">` set per locale for SEO + screen readers
- `aria-current="true"` on the active pill

**File layout:**
- `src/i18n/messages/en.json` — English catalogue (source)
- `src/i18n/messages/es.json` — Spanish catalogue
- `src/i18n/config.ts` — `LOCALES = ["en", "es"] as const`, `DEFAULT_LOCALE = "en"`
- `src/components/layout/LanguageSwitcher.tsx` — the navbar control
- Messages keyed by feature, not by page (`hero.cta.explore`, `search.placeholder`, `stats.years`) so reuse stays clean

**SEO:**
- `<link rel="alternate" hreflang="en" />` and `hreflang="es"` in `<head>` of every page
- `hreflang="x-default"` points to the English version

**Content workflow:**
- All Spanish copy is reviewed by a fluent speaker (the site owner) before merge — no auto-translation in production
- A short style guide note in `docs/`: tone in Spanish is the **same** professional-conversational register (see §13), not formal `usted` — it should sound like the same person, just in Spanish

**Out of scope for v1:** RTL languages, locale-specific number/date formatting beyond what `next-intl` gives for free, currency.

---

## Status Log

- **2026-05-29** — Polish pass — six fixes shipped together. (1) **Story Act 1 now includes the UAI degree** — `universidad-adolfo-ibanez-2020` gained `story_act: "foundation"` + a reflective `personal_impact` line; `relevant: false` preserved so it stays out of Discover + years stat. (2) **Story cards are whole-clickable on both Act 1 and Act 3** — `StoryTimeline.TimelineRow` rewritten to use a stretched-link pattern (relative `<article>`, absolute-inset `<Link>` overlay with `sr-only` heading + focus ring on the full card, `group-hover:text-accent` on the title). `Story.tsx` enables `linkToDeepDive` on the Act 1 timeline too. New-tab behavior preserved (`target="_blank"`). (3) **Mobile nav opacity fix** — `Navbar.tsx` now keeps the header in its solid-state classes (`bg-surface/80 backdrop-blur-md`) whenever `mobileOpen` is true (not only when scrolled), and the mobile overlay flipped from `bg-bg/95 backdrop-blur-sm` to fully-opaque `bg-bg backdrop-blur-md` so the page content no longer bleeds through. (4) **404 page localized** — `app/not-found.tsx` converted to a client component that reads `usePathname()` to pick `/es` vs `/` (lives outside `I18nProvider` since it's at the root layout). New `notFound` section in both `en.ts` + `es.ts` catalogues. (5) **Documented Discover relevance sort** — `sort.ts` "relevant" mode = tag-overlap count vs active filters, tie-broken by start date desc; with no filters active it collapses to data order (intentional). No code change. (6) **Out of scope per user**: tag/taxonomy display names and tag-type singular labels (Role, Language, Technology, …) are intentionally English-only and were left untouched; only descriptive UI strings were re-audited.
- **2026-05-28** — Story page reflective pass. (1) **Act regrouping** — Story acts no longer key off `type`. Two new optional `BaseEntry` fields drive the timeline: `story_act: "foundation" | "technical"` and `personal_impact: string`. `Story.tsx` now filters Act 1 by `story_act === "foundation"` (swimmer, waiter, School-of-Tech instructor, Silabuz mentor) and Act 3 by `story_act === "technical"` (AidProf, uPlanner); education omits the field and stays off the timeline. This is independent of `relevant` — instructor + mentor remain `relevant: true` (still in Discover + years stat) while sitting in the non-technical act, which the old `type`/`relevant` signals couldn't express. (2) **Reflective line** — each timeline card now renders `personal_impact` (1–2 sentence pillar/how-it-shaped-me statement) **in place of** the factual `summary`, styled as a quiet accent-rule italic pull-quote; `summary` still drives the Explorer grid + deep-dive. Backfilled all 6 timeline entries. (3) **Act 2 bold** — `PivotInterlude` now renders inline `**bold**` by reusing the exported `renderInline` from `description.tsx`; the EN/ES `story.actTwo.paragraphs[0]` strings wrap "what's next" / "what do I want to build for the next decade" (and the ES equivalents) in `**…**`. (4) **Skill sync** — portfolio-json-builder (SKILL.md Step 2 + references/schemas.md base-fields table + job/personal examples) documents both new fields and the `story_act`-vs-`relevant` independence.
- **2026-05-28** — Feedback pass across Home + Experience + theming. (1) **Hero re-centered** — reverted the lg left-anchor/right-mask back to a centered text block (`max-w-3xl text-center`); the Logo Cluster now fills `inset-0` and haloes the centered headline via its existing margin/strip placement zones (no mask). Added a `min-h` floor so the absolute cluster has room. (2) **Logo cluster min-distance** — `LogoDropCluster` placement rewritten from independent per-slug sampling to a deterministic collision-aware batch (`layoutPlacements` + `sampleZone` + rejection sampling, `MIN_DIST_PCT 9`, 24 tries) so logos no longer overlap; rotation/float/opacity still seeded. (3) **Card tags grouped + capped** — new `src/lib/experience/tag-display.ts` (`visibleTagsByType`, CAP 3) shows ≤3 tags per category with active-filter matches always visible, the rest collapsing into a per-category color-tinted "+N" pill (`OverflowPill` in `ExperienceCard`); summary bumped to `line-clamp-3`. (4) **`relevant` flag** — new required base field on every experience entry; only professional/technical entries (AidProf, uPlanner, SoT instructor, Silabuz mentor) are `true`. The Explorer "Discover" tool + stats now consume `experienceRepository.getRelevant()` (new interface method), so non-relevant entries (university, waiter, swimming) stay in data for Story/deep-dive but are hidden from Discover; years-of-experience now reads 10.4 yr. portfolio-json-builder skill (SKILL.md + schemas.md) documents the field. (5) **Years stat hardened** — the computer/`durationMonths` no longer crash on `null`/year-only period boundaries (this 500 was the source of the reported hydration console error); `Period.start` is now `string | null`. (6) **Light accent** — kept `#B23F12` but accent-filled CTAs switched from `text-text-primary` to a new `--color-on-accent` (white) token, so buttons read white-on-brick in both themes. (7) **uPlanner docs** — added an "Infrastructure & DevOps" section (multi-tenant MySQL dev/qa/prod, Atlassian Bamboo/Jira/Bitbucket) to `docs/experience/uPlanner.md`, with new taxonomy tags (`bamboo`, `jira`, `bitbucket`, `version-control`) and a matching `**Infrastructure & DevOps.**` description paragraph. (8) **AidProf description** reformatted with `**Lead.**` paragraph leads to match uPlanner's style. Verified in Docker: type-check ✅, lint ✅; live checks in preview — Discover shows 4 entries, stat 10.4 yr, white CTA text in light mode, no console errors. (Pre-existing data nit flagged separately: taxonomy logos `css3`/`amazonaws`/`microsoftazure`/`microsoftsqlserver` use dead Simple Icons slugs and 404.)
- **2026-05-25** — Hero Logo Cluster **motion model redesigned** end-to-end. The original "drop from above + spring bounce" entrance (and the intermediate refinements that gave it x-rank sweep stagger, rotation overshoot, and lateral jitter) was replaced by an ambient floating + cursor-repel pattern. New behavior in `LogoDropCluster.tsx`: (1) **Entrance** — each logo fades + scales (`opacity 0→1`, `scale 0.5→1`) on a 70 ms × index stagger, 550 ms ease-out-quint duration. (2) **Continuous float** — inner `motion.div` per logo runs an infinite mirror loop on `y/x/rotate` (`±8 / ±6 / ±5°` around a seeded base rotation of ±6°), with seeded per-logo duration 5–10 s and phase 0–4 s so the cluster never pulses in sync. (3) **Cursor repel** — single window `mousemove` listener at the cluster level updates a shared `cursor` ref; each `FloatingLogo` uses Framer Motion `useAnimationFrame` to read the ref, compute distance to its own `getBoundingClientRect()` center, and — within 150 px — set `useMotionValue`s along the cursor-to-center vector with force `(1 - d/150) × 50px`, smoothed by `useSpring({ stiffness: 300, damping: 20 })`. (4) **Structure** — split into outer (entrance + repel) and inner (continuous float) motion layers with a static positioning wrapper so Framer Motion's transform composition for `x`/`y` springs doesn't fight the `-50% / -50%` centering offset. (5) **Reduced motion** — no entrance, no float, no listener attached (saves the rAF cost); logos render statically at seeded positions with their base rotation. SSR safety: positions, durations, and phases all seeded via `hash32(slug)` + `mulberry32`. Plan §6 Zone 1 updated in-place to reflect the new motion model. Verified in Docker: type-check ✅, lint ✅, build ✅ (14 prerendered pages, `/` route chunk 138 B).
- **2026-05-24** — Build Order step 18 landed: full **EN / ES internationalization** end-to-end. Library deviation: custom thin i18n layer in `src/i18n/` instead of `next-intl` (static export blocks middleware-based EN-unprefixed routing — next-intl forces `localePrefix: 'always'`, which the plan §18 explicitly rejects). Files: `locale.ts`, `messages/{en,es,index}.ts` (typed catalogues, shape parity via `Messages = typeof en`), `translator.ts` (dot-notation resolver + `{name}` interpolation + typed `MessageKey<T>`), `I18nProvider.tsx`, `server.ts` (`getTranslator(locale)` / `getMessages(locale)` for RSCs), `inline-script.ts` (pre-paint `<html lang>` patch), `path.ts` (`withLocale` / `switchLocale`). Routes restructured into `app/(en)/...` (invisible route group, unprefixed URLs) and `app/es/...` (Spanish mirror); each tree has its own `layout.tsx` providing `I18nProvider` + shared Navbar + Footer. Page bodies extracted into shared components: `Explorer.tsx` (client), `Story.tsx` / `Contact.tsx` / `DeepDive.tsx` (server, take `locale: Locale` prop). `LanguageSwitcher.tsx` in the Navbar writes `NEXT_LOCALE` cookie and preserves query + hash on switch. Stat computers gained optional `labelKey: MessageKey` (registry untouched, OCP). Social-link and nav-item labels became typed message keys. Per-route metadata emits `alternates.languages` so every page has hreflang. Per plan §18 Phase 1, experience descriptions + taxonomy `display_name` stay in authored language. Verified in Docker: type-check ✅, lint ✅, build ✅ (14 prerendered pages: 7 EN + 7 ES). HTML smoke-check: `out/es.html` has `<title>Sebastián Gutiérrez — Portafolio</title>` + Spanish body copy (`Explorar`, `Trabajo como`, `Descubre`); `out/index.html` has English equivalents; both emit `<link rel="alternate" hreflang>` for en / es / x-default.
- **2026-05-24** — Build Order step 17 landed: **Logo Drop Cluster** in Hero per plan §6 Zone 1. `LogoDropCluster.tsx` (`src/components/hero/`) reads a deduped list of taxonomy `image` URLs and drops each from above the band via Framer Motion springs (stiffness 80 / damping 12 / mass 0.8 on `y`, a softer secondary spring on `rotate`). Positions are deterministic via `mulberry32` seeded by `hash32(slug)` — SSR + client render identical DOM, no hydration mismatch. Animation defers to post-hydration so the static fallback never half-drops. Layout: full-width band (160 mobile / 220–240 desktop), vertical edge mask, between Hero CTAs and Zone 2 title. Accessibility: labeled region, visually hidden `<ul>` of tag names for SR, fade-in fallback on `prefers-reduced-motion`. Hover lifts + scales individual logos. SVGs via `<img loading="eager" decoding="async">`, Simple Icons CDN preconnect added to `<head>`. Helper `logoSourcesFromTaxonomy()` (`src/lib/taxonomy/logos.ts`) feeds `Hero` through a `logos` prop (DIP). Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` jumped from 9.66 → 10.6 kB).
- **2026-05-24** — Build Order step 16 landed: **Theme system (dark/light)** per plan §17. Light palette added under `[data-theme="light"]` in `globals.css` with all 8 tag-type colors retuned (lower saturation, slightly darker base, same hue family) and a darker accent for AA contrast on white. 200ms cross-fade scoped to root bg/color + `html *` border-color. New `src/lib/theme/`: `types.ts` (THEMES, DEFAULT_THEME `dark`), `storage.ts` (`ThemeStorage` interface + `LocalStorageThemeStorage` — DIP-clean, private-mode safe), `inline-script.ts` (blocking pre-paint script: `localStorage.theme` → `prefers-color-scheme` → DEFAULT_THEME), `ThemeProvider.tsx` (context + `useTheme()` hydrating from `<html data-theme>`). `ThemeToggle.tsx` is a sun/moon Navbar button with Framer Motion cross-fade, `aria-pressed` + `title` describe the action verb. `suppressHydrationWarning` on `<html>` covers the inline-script's pre-paint attribute mutation. Verified in Docker: build ✅, sizes unchanged on routes (theme code lives in shared chunks).
- **2026-05-24** — Build Order step 15 landed: **polish pass** in five layers. (A) `<Reveal>` + `<RevealStagger>` motion primitive (`src/components/motion/`) — 320ms ease-out-quint fade-up, honors `prefers-reduced-motion`. (B) `/story` rail now scroll-linked via Framer Motion `useScroll` + `useSpring`; custom-built rather than installing Aceternity's TracingBeam because TracingBeam is hard-coded for a left-rail layout that doesn't fit the alternating centre rail. (C) micro-interactions across `ExperienceCard` (hover lift + accent border + shadow), `SearchBar` (panel fade in/out), `ActiveFilterChips` (AnimatePresence enter/exit + layout), `RoleShortcuts`/`TagPill` (active-scale on tap), drawer body (sequential reveal of inner sections). (D) global route fade via `src/app/template.tsx` (180ms). (E) Hero refinement — AnimatedRoleLine timing (300ms→450ms ease-out-quint, 2200→2800ms cadence) + soft top-edge vignette in `AmbientBackdrop`. While here: rewrote `ExperienceCard`'s impact callout from a 2px left-stripe border to a leading accent-dot pattern to comply with the shared design-laws ban on >1px coloured side borders. Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` 9.52 → 9.66 kB; `/story` 163 B → 4.89 kB because it gained `useScroll` client code — acceptable for the visible win).
- **2026-05-24** — Build Order step 14 landed: `/contact` is a pure server component at `src/app/contact/page.tsx` (127 B route, zero client JS). Layout per §9 — centered single column with: availability badge (green status with a soft `motion-safe:animate-ping` pulse when open, muted styling when not), large heading, location/timezone note, "what you're looking for" callout, primary `mailto:` button labeled `Email {firstName}`, secondary copy-the-address line, and an optional resume PDF download rendered only when `siteConfig.resume` is non-null. `siteConfig` extended with `availability.lookingFor: string` and `resume: { label, href } | null` (defaults to `null` so the resume affordance stays hidden until the PDF lands in `public/`). Verified in Docker: type-check ✅, lint ✅, build ✅ (`/contact` 127 B, 9 prerendered pages total). HTML smoke-check: title, `<h1>`, `mailto:` href, "Open to opportunities" badge text, and the looking-for paragraph all render in SSR. **Build Order 1–14 complete — remaining items are the polish pass (15) and the post-MVP additions in §17/§18.**
- **2026-05-24** — Build Order step 13 landed: `/story` is a pure server component at `src/app/story/page.tsx` (163 B route, zero client JS). Three acts assembled per §7: Act 1 *Before the terminal* (filters `type: "personal"`), Act 2 *The pivot* via the new `PivotInterlude` component (authored prose with a soft accent backdrop), Act 3 *Building systems* (filters `type: "job" | "project"`, each row links to `/experience/[id]` in a new tab). New shared component `StoryTimeline` (`src/components/story/`) renders a vertical timeline with a centre rail on `lg+` (entries alternate left/right via `i % 2`) and a left-rail single column below; the `highlightTagType` prop drives the chip cluster (`soft_skills` for Act 1, `concepts` for Act 3). `NowMarker` closes with a CTA → `/contact`. Authored copy lives in the new `src/lib/site/story-copy.ts` — chapter eyebrows, intros, pivot paragraphs, now-marker body — single edit point. Empty acts render a quiet `ActPlaceholder` instead of disappearing, so Act 1 currently shows a graceful "Personal milestones are being written up" message until `personal` entries land. Travel visual + skills-growth viz deferred to step 15. Verified in Docker: type-check ✅, lint ✅, build ✅ (`/story` 163 B, 8 prerendered pages total). HTML smoke-check: all four `aria-labelledby` IDs present (Before the terminal / The pivot / Building systems / Now), 2 deep-dive links into the Explorer, contact CTA rendered twice (nav + NowMarker).
- **2026-05-24** — Build Order step 12 landed: `/experience/[id]` is a fully static, pure server-component route at `src/app/experience/[id]/page.tsx`. `generateStaticParams()` prerenders every entry ID (currently `/experience/aidprof-product-owner-2020` + `/experience/uplanner-data-engineer-2021`); per-entry `generateMetadata()` emits a real `<title>` and meta description. Layout: 18rem sticky sidebar + 1fr main on `lg+`, single column below. Sidebar shows company link (job entries with URL open in a new tab), period + computed duration via new `humanDuration()`, sub-meta, badge, all impact lines, full tag cloud grouped by `TAG_TYPES`, and media links. Main column: role title, subtitle, summary, then the description rendered through the new `src/lib/experience/description.tsx` micro-renderer (paragraphs + `**bold**` only — measured the real data first, skipped a ~50 KB `react-markdown` dep). Related Experience section at the bottom uses `defaultRelatedScorer.topN(entry, all, 3)` via the new `RelatedExperience` component (`src/components/experience/`), each card highlighting its top matching tag slugs as `active` `TagPill`s with a "View →" affordance. The route ships **0 client JS** (160 B). Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` 9.52 kB, `/experience/[id]` 160 B, `/playground` 2.47 kB). HTML smoke-check: uPlanner page emits 11 `<p>` paragraphs + 9 `<strong>` runs (matches description audit), AidProf emits 6 paragraphs + 0 bold runs.
- **2026-05-24** — Plan updated with three new in-scope features: (1) **Logo Drop Cluster** in Hero (§6 Zone 1) — taxonomy `image` field drives a Framer Motion drop + spring-bounce animation that lands in a messy cluster between the Hero CTAs and Zone 2's search title; respects `prefers-reduced-motion` and screen-reader semantics. (2) **Theme system (§17)** — first-class dark/light toggle in Navbar, persisted via `localStorage` + blocking inline script to prevent FOUC, light palette tuned to keep tag-type identity legible on light surfaces; entire retheme remains a CSS-vars-only change. (3) **Internationalization (§18)** — `next-intl` with EN default unprefixed (`/`) and ES under `/es/...`; navbar `EN`/`ES` switcher preserves path + query and persists via `NEXT_LOCALE` cookie; v1 ships EN content + bilingual UI chrome, taxonomy gets per-locale display names where translation actually matters, experience entries stay in their authored language. Build Order extended with steps 16 (theme), 17 (logo cluster), 18 (i18n). No code changes yet — implementation lands in later passes.
- **2026-05-24** — Build Order step 11 landed: `ExperienceDrawer` (`src/components/explorer/`) — one component, two layouts driven by `useMediaQuery("(min-width: 640px)", true)` (new hook at `src/lib/hooks/use-media-query.ts`). Desktop: right slide-over (~480px, `x: 100% → 0`, ~300ms ease-out). Mobile: bottom sheet (90vh, `y: 100% → 0`, grab handle, swipe-down to dismiss via Framer Motion `drag="y"` + threshold 120px / 600px·s). Honors `prefers-reduced-motion` (instant snap). Overlay click + Esc + × close; body scroll locked while open; close button receives initial focus. `role="dialog"` + `aria-modal="true"` + `aria-labelledby`. Content matches plan §11 — role/company header, period + employment/location/credential sub-meta, summary, description teaser (first paragraph), top 3 impact bullets, full tag cloud grouped by `TAG_TYPES` with type labels via `tagTypeLabel`. Footer "Dig deeper ↗" opens `/experience/[id]` in a new tab (404s until step 12). New format helpers: `getDescriptionTeaser`, `getDrawerSubMeta`. Wired into both `/` (real Explorer) and `/playground`. Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` 9.52 kB, `/playground` 2.47 kB).
- **2026-05-24** — Build Order step 10 landed: real Explorer at `/` assembling Zones 1–4. Hero (`src/components/hero/Hero.tsx` + `AnimatedRoleLine.tsx`) shows name + cycling role line (Framer Motion `AnimatePresence`, respects `prefers-reduced-motion`) + positioning sentence + two CTAs (`Explore` smooth-scrolls to `#discover`, `Read my story` → `/story`) + radial-gradient ambient backdrop placeholder. `RoleShortcuts` (`src/components/search/`) renders the "Common searches" row sourced from roles appearing in ≥ 2 entries. `ExperienceGrid` (`src/components/explorer/`) wraps the card grid with sort selector (`recent` | `relevant`) + entry count + Download CSV button + empty-state with featured-entry fallback. New libs: `src/lib/experience/sort.ts` (overlap-scored relevance + recency tiebreaker), `src/lib/experience/csv.ts` (RFC-4180 quoting, UTF-8 BOM, columns per plan §6), `src/lib/site/config.ts` (authored copy + email + availability). All consumption goes through `experienceRepository` / `taxonomyRepository` — no JSON imports in components (DIP). Old playground moved to `/playground` (not in nav). Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` 9.51 kB, `/playground` 2.46 kB). SSR markup confirmed: `aria-label="Introduction"`, `aria-labelledby="discover-title"`, `aria-label="Summary statistics"`, `href="#discover"` CTA, 120 tag pills across the two real entries.
- **2026-05-24** — Build Order step 9 landed: `StatCard` (`src/components/stats/`) animates numeric values via Framer Motion `animate()` (~800ms ease-out) with an optional `suffix` for units (count-up shows "4.5 yrs" not just "4.5"). `StatsBar` filters entries with `defaultFilterStrategy`, runs all registered `StatComputer` instances, and drives `StatCard`. `StatComputer` interface extended with `suffix?: string` — `yearsOfExperienceComputer` migrated from `format()` to `suffix: " yrs"` to preserve animation. Mobile layout: 2-col grid; sm+: 4-col row. Adding a new stat requires only a new computer file + one registry line (OCP untouched). `StatsBar` wired into the playground page above the card grid.
- **2026-05-24** — Build Order step 8 landed: `useFilterTags()` hook syncs the active-slug array to `?tags=…` via `history.replaceState` + a `popstate` listener (no Suspense wrapper needed under static export), exposing `add` / `remove` / `toggle` / `clear` / `set`. New `ActiveFilterChips` component (`src/components/filters/`) renders the chip row presentationally — caller passes `slugs` and a `taxonomyBySlug` lookup (DIP), unknown slugs are skipped, `Clear all` sits at the row's end. `TagPill` gained an optional `sublabel` prop (used as the "· Language" suffix on filter chips) — backward-compatible default of `undefined`. New singular-label helper at `src/lib/taxonomy/labels.ts` maps each `TagType` to its display noun ("languages" → "Language"). Demo page replaces its hand-rolled chip row + `useState` with the hook + component end-to-end; URL now reflects picks and survives reload/back-forward. Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` now 9.06 kB).
- **2026-05-24** — Build Order step 7 landed: `SearchBar` accessible combobox + grouped suggestion dropdown + `SearchStrategy` interface + default `SubstringSearchStrategy` (4-tier ranking: exact / prefix-on-name / prefix-on-slug / contains) + `topTagsByUsage` helper for the empty-state. Component stays presentational — caller passes `suggestions`, `topSuggestions`, `excludeSlugs`, and `onSelect`; eventual Explorer wires it to `taxonomyRepository.getAll()` and `topTagsByUsage(experienceRepository.getAll())`. Keyboard: ↑/↓/Enter/Esc/Tab; click-outside closes; selection clears query and keeps focus so picks chain. Demo page now drives `ExperienceCard.filterTags` live from the search → state and renders selected slugs as removable `TagPill`s above the grid (preview of step 8's Active Filter Chips). New files: `src/lib/search/{types,substring}.ts`, `src/lib/taxonomy/top-tags.ts`, `src/components/search/SearchBar.tsx`. Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` now 8.54 kB), dev container on port 3001 returns `role="combobox"` + `aria-autocomplete="list"` + `aria-controls` + correct placeholder in SSR markup.
- **2026-05-24** — Build Order step 6 landed: `ExperienceCard` (presentational, SRP) with type-aware formatting helpers in `src/lib/experience/format.ts` and slug→label helper in `src/lib/taxonomy/format.ts` (taxonomy lookup with titleize fallback so the component renders before `taxonomy.json` is populated). Card anatomy follows plan §10: heading (role + company/client/institution/region per type), meta row (period + employment/status/credential badge), 2-line `line-clamp` summary, flattened tag pills colored by type, impact pull-quote on the accent border, "View details →" CTA. Filter behavior: no filter → all `inactive`; with filter → matched `active`, rest `muted`. Placeholder page upgraded to a 3-column responsive grid with two mock entries (job + project) and an interactive filter-chip control so the highlight/muted transition is visible. Demo button calls `onSelect` → console (Drawer wires up at step 11). Schema note: `TaxonomyEntry` gained an optional `image: string | null` field (user-added, supports Simple Icons logos later). Verified in Docker: type-check ✅, lint ✅, build ✅ (`/` now 6.76 kB), one-off dev container on host port 3001 returns both cards with correct period/badge/impact and pill-state counts (11 active, 34 muted) matching the active filter (`python`, `etl`).
- **2026-05-24** — Build Order step 5 landed: global `Navbar` (sticky 64px, transparent → `backdrop-blur-md`+`bg-surface/80` once scrolled past 16px, mobile hamburger → full-screen overlay with Framer Motion fade+slide, `aria-current="page"` on active route, ESC + route-change auto-close, body scroll lock while open) and `Footer` (GitHub / LinkedIn / Email — single-path SVG icons, no emoji — + copyright). Nav items in `src/components/layout/nav-items.ts`, socials in `social-links.ts` — both consumed by their components so additions are one-line OCP changes. Layout shell switched to `min-h-screen flex flex-col`. Placeholder page trimmed (Navbar carries identity now). Verified in Docker: lint ✅, type-check ✅, static export build ✅ (`/` now 1.93 kB after demo-header trim), dev container served on host port 3001 (other project occupied 3000) returns all expected ARIA markers + nav items + socials.
- **2026-05-24** — Build Order step 4 landed: `TagPill` component with all four states (`active` / `inactive` / `muted` / `removable`), single prop interface (LSP), color lookup via `src/components/tags/tag-colors.ts` → CSS vars. Added `cn()` utility at `src/lib/utils.ts` (clsx + tailwind-merge). Placeholder `/` page upgraded into an 8×4 demo matrix that visually verifies type→color flow and includes a working remove → restore interaction. Verified in Docker: lint ✅, type-check ✅, build ✅ (8.72 kB for `/`), dev server on `:3000` renders all 32 pill variants.
- **2026-05-24** — Initial scaffold landed and end-to-end verified in Docker. Stack: Next.js 15.4.11 + React 19.0.0 + TS 5.7 + Tailwind v4 + Framer Motion 11. Multi-stage `Dockerfile` (`base → deps → dev / builder → prod`) and `docker-compose.yml` with `dev` (port 3000) and `preview` (nginx:alpine on port 8080) profiles. Color tokens in `src/app/globals.css` exposed to Tailwind via `@theme inline`. Full SOLID `src/lib/` layer (taxonomy, experience, filters, related, stats — interfaces + JSON impls, four stat computers wired through a registry). Empty schema-correct seed JSON. Placeholder `/` and `not-found.tsx` pages. `.claude/CLAUDE.md` refreshed with Docker / SOLID / plan-sync sections. Verified: `pnpm lint`, `pnpm type-check`, `pnpm build` (produces `out/index.html`), `docker compose up dev` (200 on `:3000`), `docker compose --profile preview up preview` (200 on `:8080`). Next.js version pinned at 15.4.11 — 15.5.x and 16.x both fail static-export prerender of `/_global-error`.
