---
name: Sebastian Gutierrez Portfolio
description: A discovery-first portfolio rendered as a quiet workshop with a single warm lamp.
colors:
  bg: "#0A0A0F"
  surface: "#13131A"
  surface-elevated: "#1C1C26"
  border: "#2A2A38"
  text-primary: "#F0F0FF"
  text-secondary: "#A6A6C0"
  text-muted: "#9595AA"
  accent: "#E5642E"
  accent-hover: "#F07A45"
  accent-subtle: "#E5642E22"
  tag-roles: "#D9798C"
  tag-languages: "#56A0CF"
  tag-technologies: "#56CF9E"
  tag-libraries: "#CF9A56"
  tag-domains: "#B680DB"
  tag-concepts: "#D28162"
  tag-scale: "#56CF56"
  tag-soft-skills: "#D771C3"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(3rem, 7vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body-small:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.25em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-elevated}"
  tag-pill-active:
    backgroundColor: "{colors.accent-subtle}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-pill-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-pill-muted:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  experience-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  experience-card-hover:
    backgroundColor: "{colors.surface-elevated}"
  navbar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    height: "64px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-small}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
---

# Design System: Sebastian Gutierrez Portfolio

## 1. Overview

**Creative North Star: "The Quiet Workshop"**

The site is a workshop with the lights on at evening. A dark, considered interior where the work is laid out plainly, and one warm lamp — the Ember Sunset accent — marks where the visitor's hand should go next. Nothing performs. Everything is in place. The craft is shown by what's been left out as much as by what's there.

The system is restrained in chrome and committed in meaning. Surfaces are flat. Type sets cleanly with weight contrast instead of decoration. Motion is quiet — content settles into place over 320ms with an ease-out-quint curve, and `prefers-reduced-motion` users see the same final state without the easing. The eight tag-type colors are the system's single permitted indulgence: a deliberate full palette that exists to encode taxonomy, never to decorate.

This system explicitly rejects the LinkedIn-resume voice, the try-hard developer-brutalist aesthetic (no monospace cosplay, no `> sudo hire_me`), and the agency-portfolio overdesign trap (no scroll-jacking, no custom cursors, no WebGL that gets between the recruiter and the work). It also rejects the cross-register absolute bans: no hero-metric template, no identical icon-and-heading card grids, no decorative glassmorphism, no gradient text.

**Key Characteristics:**
- Dark surface by default; light theme is a first-class peer, not an afterthought.
- One warm accent (Ember Sunset) on ≤10% of any screen — the lamp in the workshop.
- Tag spectrum (8 hues) carries semantic meaning, never decoration.
- Flat-by-default surfaces with tonal layering (bg → surface → surface-elevated).
- Sans-serif system stack: weight + scale contrast does the hierarchy work.
- Motion: 180–320ms, ease-out-quint, transform + opacity only.
- Bilingual EN/ES with parity in tone, length, and accessibility.

## 2. Colors: The Workshop Palette

A dark, faintly blue-tinted interior with one warm lamp and a controlled spectrum reserved for taxonomy.

### Primary
- **Lamp Ember** (`#E5642E` dark / `#B23F12` light): the site's single accent. CTAs, focus rings, link hovers, the `color-mix` hover-shadow on cards, the impact-callout dot, the radial bloom in the Hero ambient backdrop. Treat it as the one warm light in the room — every appearance should feel intentional.
- **Lamp Ember Hover** (`#F07A45` dark / `#C9531F` light): one step warmer for hovered states; never used at rest.
- **Lamp Ember Subtle** (`#E5642E22`): the accent at ~13% alpha. Background tints, ambient blooms, tag-pill active fills (via `color-mix`).

### Neutral
- **Workshop Black** (`#0A0A0F` dark / `#FAFAFC` light): the page surface. Tinted toward blue in dark mode, toward warm white in light mode — never `#000` or `#fff`.
- **Bench Surface** (`#13131A` dark / `#FFFFFF` light): cards, drawers, panels, the input field. One step up from the page.
- **Bench Surface Elevated** (`#1C1C26` dark / `#F2F2F7` light): hover state for cards, scrolled navbar background. Tonal lift, never a shadow.
- **Border Slate** (`#2A2A38` dark / `#E2E2EC` light): subtle dividers and outlines. Used heavily as a quiet line, never as decoration.
- **Text Primary** (`#F0F0FF` dark / `#0F172A` light): slightly-cool body and heading color. Easier on eyes than pure white.
- **Text Secondary** (`#A6A6C0` dark / `#475569` light): muted labels, sub-headings, metadata.
- **Text Muted** (`#9595AA` dark / `#546175` light): placeholders, disabled controls, period text on cards. Raised 2026-09-27 to meet AA (4.5:1) for small text; the previous `#44445A` / `#94A3B8` were 2.1:1 / 2.5:1.
- **On Accent** (`#0A0A0F` dark / `#FFFFFF` light): text and icons on ember-filled CTAs. Dark ink in dark mode because white on `#E5642E` is only 3.4:1.

### Tag Spectrum (semantic, full palette)
Eight hues, one per taxonomy type, rotated around the wheel so adjacent types remain distinguishable. Tag colors are NEVER used for non-taxonomy purposes — they encode meaning, and using them decoratively dilutes that contract.

- **Tag · Roles** — Rose (`#D9798C` / `#A43A53`)
- **Tag · Languages** — Sky (`#56A0CF` / `#26658F`)
- **Tag · Technologies** — Teal (`#56CF9E` / `#1F6C53`)
- **Tag · Libraries** — Amber (`#CF9A56` / `#7F5A29`)
- **Tag · Domains** — Iris (`#B680DB` / `#7F3FB5`)
- **Tag · Concepts** — Persimmon (`#D28162` / `#934D33`)
- **Tag · Scale** — Sap (`#56CF56` / `#286D28`)
- **Tag · Soft Skills** — Fuchsia (`#D771C3` / `#9C3689`)

### Named Rules

**The One Lamp Rule.** Lamp Ember is the only accent on the site. It appears on ≤10% of any screen and never as decoration — only on interactive affordances (CTAs, focus rings, link hover, active filter states) and on the single moments where the eye needs to be directed (Hero ambient bloom, impact callout dot). If a screen feels orange-heavy, the lamp is in too many places.

**The Spectrum Is Semantic Rule.** The eight tag-type colors are reserved for tag chips and tag-type labels. They do not appear on buttons, backgrounds, dividers, illustrations, or marketing copy. A coloured shape on this site means "this belongs to a taxonomy type" — nothing else.

**The Neighbour Hazard.** Persimmon (`tag-concepts`) is the closest hue to Lamp Ember. Never place a concepts chip directly adjacent to a primary button or accented link: the affordance loses its singularity. Keep at least 24px of clear space, or move the chip into a different cluster.

**The Share-Card Exception.** Hex values live only in `src/app/globals.css`, with one exception: `src/lib/site/brand-tokens.ts` mirrors the dark `:root` tokens for the generated share images (`/og/*.png`), because `next/og` renders outside the DOM and can't resolve CSS custom properties. Only `src/lib/site/og-image.tsx` may import it. Change a dark token, change it there too.

## 3. Typography

**Display / Body / Label Font:** `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` — a single system-stack sans across the entire interface.

**Character:** quiet, technical, weight-driven. There is no custom font on this site by design — the personality lives in scale ratios, tracking, and weight contrast, not in a face. The system stack also keeps the site fast (no FOIT, no CLS, no `@font-face` cost) which is part of the "craft is the evidence" principle from PRODUCT.md.

### Hierarchy
- **Display** (600, `clamp(3rem, 7vw, 4.5rem)`, line-height 1.05, tracking -0.02em): the Hero name and only the Hero name.
- **Headline** (600, 1.5rem / 24px, line-height 1.2, tracking -0.01em): deep-dive page `<h1>`, story-act eyebrows. One per page.
- **Title** (600, 1.125rem / 18px, line-height 1.3, tracking -0.005em): experience card titles, drawer headings, section headings.
- **Body** (400, 1rem / 16px, line-height 1.65): paragraphs, descriptions, summaries. Capped at 65–75ch on prose pages.
- **Body Small** (400, 0.875rem / 14px, line-height 1.55): card summaries, meta rows, button text, drawer body. The dominant size on the Explorer.
- **Label** (500, 0.75rem / 12px, line-height 1, tracking 0.25em, UPPERCASE): the Hero greeting eyebrow, tag-type headers, taxonomy-type sublabels on filter chips. Used sparingly.

### Named Rules

**The No-Custom-Font Rule.** This site ships zero `@font-face` declarations. The system stack is the design choice, not a fallback. Anyone proposing a custom face must justify the perf and CLS cost against the principle that craft includes how fast the page loads.

**The Tight Tracking Rule.** Headings get negative tracking (-0.02em to -0.005em, larger sizes get more negative). Labels get heavy positive tracking (+0.25em) and UPPERCASE. Body stays at normal. This three-band tracking system gives the system its quiet confidence — nothing is set "default".

**The No Em Dash Rule.** Per PRODUCT.md: never use em dashes (`—`) or `--` in any copy. Use commas, colons, semicolons, periods, or parentheses. Already enforced across the codebase; do not re-introduce.

## 4. Elevation

This system is **flat-by-default, accent-tinted on hover**. Static depth comes entirely from tonal layering (`bg` → `surface` → `surface-elevated`). Shadows appear only as a response to user state — never decoratively, never at rest.

### Shadow Vocabulary
- **Card Hover Glow** (`box-shadow: 0 8px 24px -12px color-mix(in srgb, var(--color-accent) 30%, transparent)`): the experience card's hover treatment. A diffuse warm glow paired with a -2px Y translate. The shadow is the lamp's reflection on the bench.

That is the only shadow in the system. Everything else uses borders + tonal layering for separation.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. If a component looks like it needs a shadow to feel separate, the answer is wrong — use a border, tonal lift, or layout spacing instead.

**The State-Only Shadow Rule.** A shadow on this site means "you are about to interact with this". It is a response, not a decoration. No drop shadows on logos, illustrations, headings, modals, or hero elements at rest.

**The Tonal Lift Rule.** Three tonal steps cover almost every elevation case: page (`bg`), resting surface (`surface`), and active/hover surface (`surface-elevated`). Reach for a shadow only when those three aren't enough; almost never.

## 5. Components

### Buttons
- **Shape:** fully pill-rounded (`rounded-full` / 9999px). Pills, not chamfered, not square.
- **Primary:** Lamp Ember fill, text Primary, 12px 24px padding (`px-6 py-3`), body-small weight 500. Used for the singular conversion action on a screen (Hero `Explore my experience`, Contact `Email Sebastian`).
- **Hover:** background shifts to Lamp Ember Hover (`#F07A45` / `#C9531F`), 150ms ease-out. No translate, no shadow — primary buttons stay anchored.
- **Focus:** 2px ring in Lamp Ember with a 2px offset against the page bg. Always visible, never `outline: none` without replacement.
- **Secondary:** `bg-surface` with a `border-border` outline, text Primary. Hover lifts to `bg-surface-elevated` with `border-text-muted`. Used for the second CTA when one is needed (`Read my story` in Hero).

### Tag Pill
The site's most-used primitive. Four states, one prop interface (LSP).
- **Style:** fully pill-rounded, 1px border in the type's color, label in `0.75rem` weight 500. The type's color carries via `currentColor` so the border, text, and `color-mix` fill stay in sync.
- **Active:** `border-current` + `color-mix(in srgb, [type-color] 14%, transparent)` background fill. Aria-pressed.
- **Inactive:** `border-current/50`, no fill. Hover bumps the border to full opacity **only when the pill is clickable**; an inert pill (Related section, deep-dive sidebar, Story) has no hover, so it never pretends to be a button.
- **Muted:** `border-border`, `text-text-muted`, transparent. Shown when a filter is active and this tag isn't part of it. In the Explorer grid it is still a button (pressing it narrows the filter further) and hovers to a `text-muted` border with `text-secondary` text; anywhere it is inert it has no hover.
- **Removable:** active state + a tappable × button that uses `aria-label="Remove {label}"` (localized per locale).
- **Sublabel** (the type name on a filter chip): quieter by weight (400 against the label's 500), same color. Never by opacity: a dimmed tag color falls below AA on the chip's tint.

### Experience Card
The Explorer's primary container, also used in the Related section on deep-dive pages.
- **Corner Style:** `rounded-2xl` (20px).
- **Background:** `surface` at rest, `surface-elevated` on hover.
- **Border:** 1px `border-border` at rest, shifts to `border-accent/40` on hover.
- **Hover:** `-translate-y-0.5` plus the Card Hover Glow shadow (the one shadow in the system). 200ms ease-out.
- **Focus:** 2px Lamp Ember ring on focus-within with 2px offset.
- **Padding:** 20px internal (`p-5`), 16px gap (`gap-4`) between header, meta, summary, impact callout, and tag cluster.
- **Tag cluster:** at most six pills (filter matches, then languages and technologies) plus a quiet "+N". In the Explorer grid any pill not yet in the filter adds its tag, so a visitor can keep narrowing from a card (the card always survives its own pill); elsewhere pills are inert.
- **Impact callout:** quiet warm bar above the tag cluster (the headline result reads second, after the role) — `color-mix(in srgb, accent 8%, transparent)` background, leading 6px accent dot, italic body text. Replaces the banned side-stripe border pattern.

### Active Filter Row
The first thing in the results, above the sort bar.
- **At rest:** one line, 44px, always present. With no filter it holds a `text-muted` hint ("No filters yet. Pick a skill above or on any card."), so adding the first filter never pushes the results down.
- **With filters:** removable chips and a "Clear all" link at the right end. The row sticks under the navbar (`top: 64px`) for as long as the results are in view, on an opaque Workshop Black surface (no blur; the navbar keeps that exception). A 1px Border Slate bottom edge appears only while it is stuck.
- **Phones:** the chips are a single horizontally scrolling line with no scrollbar; the chip clipped at the edge says there is more. On `sm+` they wrap.

### Filter Reshape (signature moment)
What happens when a filter changes, in the order the visitor reads it:
- **The pill travels.** Pressing a pill that adds a filter (a starter chip or a card pill) sends a copy of it to its new chip in the filter row: 320ms ease-out-quint, then a 120ms fade. The real chip waits for it. Filters added from the search box or the URL simply appear.
- **The grid reshapes.** Cards that stay glide to their new places at once (320ms). Cards that leave fade in 180ms and are out of the flow immediately, so they never hold the others back. Only entering cards keep the short stagger.
- **Matches light up.** On each remaining card the matched pills fill in, card by card (50ms steps, 150ms cap).
- **The results stay in view.** If the start of the results had scrolled above the navbar, the page scrolls it back, so the reshaped list is what the visitor sees. Only for changes the visitor makes; filters read from the URL never move the page.
- **Reduced motion:** no travel, no glide, an instant scroll. The same end state.

### Search Bar (combobox)
- **Style:** `surface` background, `border-border` outline, `rounded-lg` (12px), padded `10px 14px`. WAI-ARIA combobox pattern (`role="combobox"`, `aria-activedescendant`).
- **Focus:** 2px Lamp Ember ring; the dropdown panel fades in with a 150ms opacity transition. Keyboard: ↑/↓ to navigate, Enter to select, Esc to close, Tab to commit.

### Drawer
- **Style:** right slide-over on desktop (≥640px, 480px wide), bottom sheet on mobile (90vh, swipe-down to dismiss via Framer Motion drag).
- **Surface:** `surface` background, `border-border` left edge (desktop) / top edge (mobile). `role="dialog"`, `aria-modal="true"`.
- **Motion:** 300ms ease-out slide; close via overlay click, Esc, or × button.

### Navbar
- **Style:** sticky, 64px, transparent at scroll-top. On scroll: `bg-surface/80` + `backdrop-blur-md` + 1px bottom border. Theme toggle (sun/moon cross-fade) and language switcher (`EN` / `ES` pills) anchor the right side.
- **Active route:** Lamp Ember text + `aria-current="page"`, and on desktop a 1px Lamp Ember underline that slides sideways from the previous route's link (Motion `layoutId` with `layout="x"`; a two-axis layout animation would drag the line in from the old scroll position).
- **Mobile:** hamburger → full-screen overlay (`bg-bg/95` + `backdrop-blur-sm`) with large nav links and a per-link bottom border.

### Core Stack row
- **Pattern:** a static, labeled row under the hero CTAs: "Core stack" and the tools from `CORE_STACK`, each with its Simple Icons logo (bundled from the `simple-icons` package) in `currentColor`, text Secondary. Replaced the animated Logo Drop Cluster on 2026-09-27: the stack is information, not an ambient effect.
- **Motion:** none of its own. It arrives with the hero's last entrance step.
- **Rule:** if a tool has no Simple Icons logo (SQL), show the label only. Do not synthesize a faux logo, and never tint with brand colors (no hex outside the tokens).

### Tool Field
The wider stack, scattered around the hero copy: 36 real tools, each one a tag and a toggle that filters the Explorer. The Core Stack row above stays as the readable text; the field is where the stack can be played with.
- **Layout:** a loose scatter, not a grid. On `xl` and up the tools fill the gutters either side of the copy (18 a side); below that they gather in two bands under the Core Stack row, 20 tools on tablets and 12 on phones. Sizes run from 20 to 40px (the core stack slightly larger) and each tool rests at a small tilt. **The copy is never touched:** tools live only in their own fields, one to a cell, and a test measures it at five widths.
- **Rest:** one colour, Text Muted, like the Core Stack logos. No brand colours. AWS and Azure are absent because their icons in the repo are multi-colour.
- **Selected:** the tool takes its tag-type colour (it is a tag, so the spectrum stays semantic) and its name stays up. The hero's caption then reads "2 of 4 roles match your filter. See them ↓ · Clear".
- **Names:** on hover and focus, in a small pill above the tool. In an edge column the pill opens inwards, so a name never crosses into the copy or off the screen.
- **Switched off:** a tool that would leave no role if added is disabled and dimmed, with the reason in its name pill. A press never empties the results.
- **Motion (drift):** a gust pushes a tool about 14px along the wind with a slight turn, and it comes back. No rock-back, no loop. One gust crosses the field on arrival (CSS, the last beat of the hero entrance); pressing a tool sends one outwards from it; tools near the pointer move up to 10px away. Otherwise the field is still. Touch gets the arrival and press gusts only; reduced motion gets none of it.
- **Keyboard:** one tab stop. Arrow keys, Home and End move between tools; Enter or Space toggles.
- **Icons:** one cached sprite, `/sprites/tools.svg`, referenced with `<use>`. Never inline: the field is a client component, and inline paths would ship twice. On `xl` and up, where the field is on the first screen, the sprite starts loading while the page is parsed; below that the field is under the first screen, so the sprite waits for the page's load event and never competes with the text.
- **Markup:** three elements per tool (button, `svg`, `use`). The tilt, the pointer push and the gust are `rotate`, `translate` and `transform` on the one `svg`; do not add wrappers for them.
- **Rule:** every position comes from `scatter()` on the server (seed and looseness are constants there). The browser computes none of it, so there is no layout shift and nothing to hydrate differently.

### Career Swimlane
- **Pattern:** four lanes (Teaching, Founding, Data engineering, Data platform) on a shared 2016 → now axis, at the top of `/story` and in the landing Story teaser. Each row is text first (lane · years · organization) with a 8px bar on a `surface-elevated` track below.
- **Color:** bars are `text-muted`; Lamp Ember marks only the ongoing role (the one "you are here" moment).
- **Motion:** bars draw in left to right (`scaleX`, origin left), as time passing: once on load on `/story`, where the swimlane opens the page (lanes 50ms apart), and scroll-linked on the landing teaser. CSS only (`.lane-bar` in `globals.css`). Positions are computed at build time.

### Career Strip
The swimlane as the filter's readout: "where in my career did I use this?". Sits in the Explorer results, between the Active Filter Row and the sort bar.
- **Pattern:** the same four lanes and 2016 → now axis as the Career Swimlane, one compact 28px row each: label, track, and from `sm` up the years and organization. Phones show a year label every four years instead of two.
- **No filter:** every bar is filled (`text-muted`; Lamp Ember for the ongoing role), every label Text Primary.
- **With a filter:** lanes whose role matches stay filled; the others go **hollow** (a 1px outline of the same color) and their label drops to Text Muted. Filled against hollow is a change of shape, so the readout never rests on color alone. Screen readers get "Matches your filter" or "Not in your filter" per lane.
- **Linked to the cards:** hovering or focusing a lane gives that role's card the hover's tonal lift and border (not the glow, which stays a pointer response). Pressing a lane opens the role's drawer.
- **Motion:** fill and label change color over 200ms; bars draw in on scroll like the swimlane's.
- **Rule:** the strip gets positions as plain numbers from the server (`toCareerStrip`). It never reads the clock, so the hydrated strip always matches the static HTML.

### Tracing Story Rail (signature component)
- **Pattern:** vertical rail on `/story`, anchored to the centre on `lg+` with entries alternating left/right, single-column left-rail below.
- **Motion:** scroll-linked progress fill via Framer Motion `useScroll` + `useSpring`. Custom implementation — Aceternity's TracingBeam is hard-coded for a left-rail layout that doesn't fit this alternating centre rail.

### Hero entrance
- **Pattern:** one load sequence. The availability badge and greeting, the role and proof line, the CTAs, then the résumé link, profile links and Core Stack settle in over four steps, 50ms apart (`.hero-enter` with `--i`, in `globals.css`). 320ms each, ease-out-quint, 8px rise.
- **Static on purpose:** the name and the positioning sentence. They are the two largest-paint candidates (see The Largest Paint Rule).
- **Last beat:** one gust across the Tool Field, starting as the fourth step lands. It is part of this sequence, not a second entrance.

### Motion
- **Tokens:** `--ease-out-quint`, `--duration-quick` (180ms: chips, menus, the route fade) and `--duration-reveal` (320ms: content settling in) in `globals.css`, mirrored for JavaScript in `src/lib/motion/tokens.ts`. Hover and color transitions keep Tailwind's 150ms and 200ms steps.
- **Scroll reveal:** the `reveal` class (or `<Reveal>`) fades a block in over the first 35% of its own height as it enters. Use it on headers and single cards, never on a whole section: a tall block would stay see-through for too long.
- **Stagger cap:** 150ms (`MAX_STAGGER_DELAY`). Past that a stagger reads as the page being slow.

### Named Rules

**The Response Rule.** New motion must either answer something the visitor did (a filter, a hover, a navigation) or show a relationship in the data (time on the swimlane, a card moving to its new place). Entrances are capped at what exists: the hero sequence (which ends with one gust across the tool field) and the scroll reveal. If an animation would play the same way with nobody at the page and no data behind it, it is decoration; leave it out.

**The Largest Paint Rule.** Whatever element is the Largest Contentful Paint never gets a delayed fade. On the landing that is the name on desktop and the positioning sentence on phones (measured with Lighthouse, 2026-10-10). Re-measure before adding an entrance to any page's first screen.

### Story Progress
A 36px bar fixed under the navbar on `/story`, visible only while the three acts are being read.
- **Pattern:** the act and year on the left ("Act 3 · 2021"), then the career axis from 2016 to now: a 1px Border Slate line, the time passed so far in `text-muted`, and an 8px Lamp Ember dot for "you are here" (the same role the accent has on the swimlane).
- **What moves it:** the last timeline card whose top has passed 35% of the viewport. Cards are not evenly spaced in time, so the marker steps from card to card instead of following scroll progress. Act 2 has no date of its own: the label changes and the marker holds where Act 1 ended.
- **Motion:** the dot and the line move over 320ms ease-out-quint (transform only); the bar fades in and out over 200ms.
- **Surface:** opaque Workshop Black with a bottom border, like the stuck filter row. No blur.
- **Decorative:** `aria-hidden`. It repeats what the page already says.

## 6. Do's and Don'ts

### Do:
- **Do** keep Lamp Ember to ≤10% of any screen. It is the lamp; rarity is the point.
- **Do** treat the three-step tonal scale (`bg` → `surface` → `surface-elevated`) as the default elevation tool. Reach for a shadow only as a state response.
- **Do** drive hierarchy through scale + weight (≥1.25 ratio between steps), tracking, and color contrast — never through ornament.
- **Do** localize every visible string through `useTranslations` / `getTranslator`. Both EN and ES are first-class.
- **Do** honor `prefers-reduced-motion`. Every motion primitive in this codebase already does; new ones must.
- **Do** keep focus rings visible at 2px in Lamp Ember with a 2px offset against `bg`. They are part of the craft, not a debug artifact.
- **Do** ship the site fast. Static export, server components by default (client JavaScript is the navbar, the landing island and the Story rail), system fonts, image decoding deferred. Performance is part of the message.
- **Do** write copy as a senior engineer would — short sentences, specific verbs, concrete numbers, no hedging. The "would a human actually say this?" test gates every line.

### Don't:
- **Don't** use Lamp Ember decoratively. Backgrounds, illustrations, dividers, headings: never. Only on interactive affordances and the singular eye-direction moments (Hero bloom, impact callout dot).
- **Don't** use the tag-type colors anywhere outside tag chips and tag-type labels. The spectrum is semantic. Decorating a button or callout with Sky or Teal breaks the contract.
- **Don't** place a Persimmon (`tag-concepts`) chip adjacent to a primary button or accented link. They share a hue and the affordance gets lost — at least 24px of clear space.
- **Don't** introduce a custom `@font-face` without justifying the perf cost against the no-custom-font rule. The system stack is the design choice.
- **Don't** use em dashes (`—`) or `--` in copy. Commas, colons, semicolons, periods, parentheses.
- **Don't** write LinkedIn-resume voice. "Highly motivated data engineering professional…" fails the human-test instantly. Rewrite.
- **Don't** try-hard developer brutalist. No monospace headings, no blinking cursors, no ASCII banners, no `> sudo hire_me`. Sebastian is an engineer; the site doesn't need to cosplay one.
- **Don't** agency-portfolio overdesign. No scroll-jacking, no oversized custom cursors, no decorative WebGL, no motion that delays interaction.
- **Don't** ship a `border-left`/`border-right` greater than 1px as a colored stripe on cards or callouts. Already removed once (the impact-callout dot pattern replaced it); don't reintroduce.
- **Don't** use gradient text (`background-clip: text` + gradient). Use a single solid color; emphasis via weight or size.
- **Don't** decorate with glassmorphism. The scrolled navbar `backdrop-blur-md` is the one purposeful exception; everything else stays opaque.
- **Don't** build the hero-metric template (giant number + small label + supporting stats + gradient accent). It is the SaaS landing-page cliché PRODUCT.md explicitly rejects.
- **Don't** ship a same-sized icon-and-heading-and-text card grid as the primary content. The Experience Card is the card on this site; it is content, not template.
- **Don't** reach for a modal as the first thought. Exhaust inline and progressive alternatives. The Drawer is the qualified exception — purpose-built, keyboard-accessible, swipe-dismissable on mobile.
