# Product

## Register

brand

## Users

**Primary: technical recruiters and sourcers.**
They land cold, often from LinkedIn or a referral, comparing several candidates in a single sitting. Their context is skim-first and keyword-driven — they need to qualify fit in ~30 seconds. The Explorer's filter-by-tag flow is built for them: type a skill, see the relevant experience reshape, decide whether to open a drawer.

**Secondary: hiring managers and engineering leads.**
They arrive after the recruiter has filtered, or by direct link. They want depth — not just keyword matches but judgment, scope, and how Sebastian thinks. The Drawer and `/experience/[id]` deep-dive pages serve this audience. They'll spend 5–10 minutes on a single role if it's worth it.

**The job to be done:** decide, with high confidence and minimal effort, whether to send Sebastian an email.

## Product Purpose

A personal portfolio that lets recruiters *discover* relevant experience instead of reading a static resume top-to-bottom.

The site exists because a resume forces every reader through the same chronological narrative, regardless of what they're hiring for. This site inverts that: visitors filter by what *they* care about (a role, a stack, a domain) and the experience reshapes to match. Three layers of depth — card, drawer, deep-dive — let each reader stop at the resolution they need.

**Success looks like inbound interview emails.** The Contact CTA is the conversion event. Everything upstream — the filter affordances, the craft of the cards, the depth of the deep-dive pages, the bilingual EN/ES surface — exists to earn enough credibility that the visitor clicks "Email Sebastian" with intent.

Secondary outcome: a memorable signal of craft. A recruiter who didn't have a role today should remember the site enough to come back when one opens.

## Brand Personality

**Three words: considered, plain-spoken, warm.**

- **Considered** — every choice looks deliberate. Nothing accidental, nothing rushed. Tight spacing, intentional motion, an actual color system. The craft is part of the message.
- **Plain-spoken** — direct, confident, unhedged. No buzzwords, no resume voice. Reads like a senior engineer who writes well — the tone of a thoughtful cover letter or a clear LinkedIn post.
- **Warm** — there's a real person behind it. The Story page exists for a reason. Bilingual EN/ES isn't an afterthought, it's part of who Sebastian is.

**Voice rules** (from `docs/portfolio-website-plan.md` §13, lifted here so they're load-bearing):

- First person throughout, but measured. Not casual.
- Technical precision where it matters, plain English everywhere else.
- Short sentences preferred. Not at the expense of completeness.
- Humor is not the goal. Clarity and credibility are.
- No em dashes (already enforced in implementation).

## Anti-references

What this site must NOT look or read like:

- **LinkedIn-resume voice.** "Highly motivated data engineering professional with a proven track record of delivering scalable solutions." Buzzword soup. Every sentence on this site must survive a "would a human actually say this?" test.
- **Try-hard developer brutalist.** Monospace everywhere, blinking terminal cursor, ASCII headers, `> sudo hire_me`. Pastiche. Sebastian is an engineer; the site doesn't need to cosplay one.
- **Agency-portfolio overdesign.** Scroll-jacking, oversized custom cursors, gratuitous WebGL, motion that gets between the recruiter and the content. Craft is shown by restraint, not by interception.
- **Generic SaaS landing** (cross-register absolute bans apply too). No hero-metric template, no identical icon-and-heading card grids, no decorative glassmorphism, no gradient text.

## Design Principles

1. **Discover, don't recite.** The site is an interactive filter, not a chronological narrative. Every surface should answer "what does the visitor want to know?" before "what does the author want to say?"
2. **Craft is the evidence.** For an engineer whose pitch is "I build systems that don't fall over," the site must be one. Performance, accessibility, polish, and bilingual parity are part of the message — not decoration. Static export, 0-client-JS on deep-dive pages, real focus rings, real keyboard nav. Practice what you preach.
3. **Three layers, three time budgets.** Card (~30s) → Drawer (~2–3m) → Deep-dive (~5–10m). Each layer must work alone. A skimming recruiter should leave qualified; a reading hiring manager should find real depth without backtracking.
4. **Plain-spoken over polished.** Tone defaults to a senior engineer writing a thoughtful cover letter, not a marketer writing landing copy. Specific verbs, concrete numbers, no hedging. If a sentence could appear on any portfolio, rewrite it.
5. **Motion serves comprehension.** Reveals, drawer transitions, the Logo Drop Cluster — they signal "this is alive" and guide the eye. They never gate-keep, never delay interaction, and `prefers-reduced-motion` always has a graceful static fallback.

## Accessibility & Inclusion

**Target: WCAG 2.1 AA across both locales.**

- Color contrast meets AA in both dark and light themes. Light palette was retuned in step 16 specifically for this.
- Full keyboard navigation across the Explorer flow: search combobox (↑/↓/Enter/Esc/Tab), tag chips, cards, drawer, deep-dive links. Focus rings are visible, not suppressed.
- `prefers-reduced-motion` is honored by every motion primitive (`<Reveal>`, `<RevealStagger>`, drawer animations, Logo Drop Cluster, route fade). Reduced-motion users get static reveals and instant transitions, not a degraded experience.
- Bilingual EN/ES with proper `<html lang>` and `hreflang` alternates per page. The Spanish surface is a first-class experience, not a translated afterthought.
- Semantic landmarks: navbar uses `aria-current`, drawer uses `role="dialog"` + `aria-modal`, search uses WAI-ARIA combobox pattern, decorative motion is labeled or hidden.
- No color-only signaling. Tag-type colors are paired with the type's display name in headers and sub-labels.
