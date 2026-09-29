/**
 * English message catalogue (plan §18).
 *
 * Single source of truth for every user-facing string in the EN tree.
 * Keys are nested by feature, not by page, so a key surfaces in every
 * consumer that uses it (`hero.cta.explore` shows up in Hero on both
 * the Explorer and any future EN page).
 *
 * ICU-style {placeholders} use simple `{name}` syntax; values are
 * substituted at call time by `t()`. No pluralization complexity for v1
 * — if a future string needs plural forms, lift to a typed helper.
 */
export const en = {
  meta: {
    title:
      "{name} | Senior Data Platform Engineer (Python, Snowflake, Kubernetes)",
    description:
      "Senior data platform engineer in Austin, TX. {years}+ years building ingestion pipelines, APIs and data platforms in Python, Snowflake and Kubernetes.",
  },
  nav: {
    explorer: "Explorer",
    story: "My Story",
    contact: "Contact",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    languageLabel: "Language",
    primary: "Primary",
    site: "Site navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    rights: "© {year} {name}. All rights reserved.",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    howItsBuilt: "How it's built",
  },
  hero: {
    greeting: "Hi, I'm",
    role: "Senior Data Platform Engineer",
    proofLine: "Contract engineer at Apple · {years}+ years building data systems · Austin, TX",
    positioningStatement:
      "I build data platforms that hold up at scale, and I make sure the people who depend on them understand what they do.",
    resumePrompt: "Hiring?",
    resumeLink: "Request my résumé",
    cta: {
      explore: "Explore my experience",
      story: "Read my story",
    },
    coreStack: "Core stack",
  },
  contactCta: {
    title: "Hiring for a data role?",
    email: "Email me",
    resume: "Request résumé",
    navResume: "Résumé",
    sticky: "Contact options",
  },
  featured: {
    eyebrow: "Selected work",
    title: "Three roles, results first",
    details: "Details",
    fullWriteup: "Full write-up",
  },
  discover: {
    eyebrow: "Filter by skill",
    title: "Looking for a specific skill?",
    subtitle:
      "Search a tool or role, or start from one of these. The list narrows to the experience that matches.",
  },
  career: {
    title: "Career at a glance",
    present: "Present",
    lanes: {
      teaching: "Teaching",
      founding: "Founding",
      data: "Data engineering",
      platform: "Data platform",
    },
  },
  storyTeaser: {
    eyebrow: "My story",
    title: "From classrooms to data platforms",
    cta: "Read my story",
  },
  landingContact: {
    more: "All contact details",
  },
  search: {
    placeholder: "Search by skill, tool, or role…",
    inputLabel: "Search experiences by tag",
    suggestionsLabel: "Tag suggestions",
    empty: "Start typing to see tag suggestions…",
    noMatch: 'No tags match "{query}".',
    closest: "Closest match:",
    commonStartingPoints: "Common starting points",
    commonSearches: "Common searches",
    rolesToStartWith: "Start with a role",
    orBrowseByType: "Or pick a tag",
  },
  filters: {
    region: "Active filters",
    clearAll: "Clear all",
    removeTag: "Remove {label}",
  },
  grid: {
    sortLabel: "Sort",
    sortRecent: "Most recent",
    sortRelevant: "Most relevant",
    showing: "Showing {visible} of {total}",
    download: "Download filtered profile",
    emptyTitle: "No experiences match these filters.",
    emptyHint: "Try removing a tag or broadening your search.",
    featuredInstead: "Featured instead",
    viewDetails: "View details →",
  },
  card: {
    open: "Open details",
  },
  drawer: {
    close: "Close",
    closeDrawer: "Close drawer",
    impact: "Impact",
    tags: "Tags",
    digDeeper: "Dig deeper",
  },
  experience: {
    metaTitle: "{title} | {name}",
    duration: {
      year: "{n} yr",
      years: "{n} yrs",
      month: "{n} mo",
      months: "{n} mo",
    },
    sidebar: {
      company: "Company",
      institution: "Institution",
      context: "Context",
      period: "Period",
      type: "Type",
      impact: "Impact",
      tags: "Tags",
      links: "Links",
    },
    fullWriteupSoon: "Full write-up coming soon.",
    related: {
      title: "Related experience",
      view: "View →",
    },
    backToExplorer: "← Back to Explorer",
  },
  story: {
    metaTitle: "My Story | {name}",
    metaDescription:
      "My path in three acts: before tech, the choice, and the engineering career.",
    eyebrow: "My Story",
    title: "The path that got me here",
    intro:
      "Three acts, in order. The first two explain where the communication and resilience came from; the third is where they met the tools.",
    actOne: {
      eyebrow: "Act 1",
      title: "Before the terminal",
      intro:
        "Swimming, university, hospitality and teaching: the foundation, not the prelude.",
      emptyTitle: "Personal milestones are being written up.",
      emptyHint:
        "Pre-tech experience entries will land here as they're documented.",
    },
    actTwo: {
      eyebrow: "Act 2",
      title: "The choice",
      paragraphs: [
        "There was no single moment of conversion. I'd studied computer science since 2016, and for years **teaching and engineering ran side by side**: classrooms during the day, code for my degree at night.",
        "The real decision was which one to build a career on. Teaching proved I could explain complex things to anyone. The analytical work I took on at School of Tech showed me I wanted to **build the systems**, not only explain them. So I chose engineering, and brought the teaching with me.",
      ],
    },
    actThree: {
      eyebrow: "Act 3",
      title: "Building systems",
      intro:
        "Professional engineering work: data infrastructure, internal tools, and the products around them.",
      emptyTitle: "Technical roles will appear here.",
      emptyHint:
        "Each role links to its full deep-dive page when you're ready to see the detail.",
      resultLabel: "Result:",
    },
    now: {
      eyebrow: "Now",
      title: "What's next",
      body: "I'm looking for the next role where I can keep doing this: building data and backend systems that hold up, and translating between the people who build them and the people who depend on them. If that matches what you're hiring for, the contact page has the fastest route in.",
      cta: "Get in touch",
    },
  },
  contact: {
    metaTitle: "Contact | {name}",
    metaDescription:
      "Availability, work authorization, what I'm looking for, and the fastest way to reach me or request my résumé.",
    eyebrow: "Contact",
    title: "Let's talk",
    availability: {
      open: "Open to opportunities",
      closed: "Not currently looking",
    },
    availabilityNote:
      "Based in Austin, TX (Central Time). Open to remote roles across the Americas and EU time zones.",
    workAuthorization:
      "U.S. permanent resident (green card holder). Authorized to work for any U.S. employer, with no visa sponsorship needed now or in the future.",
    glance: {
      title: "At a glance",
      role: "Target role",
      experience: "Experience",
      experienceValue: "{years}+ years in engineering",
      stack: "Core stack",
      location: "Location",
      locationValue: "Austin, TX (Central Time)",
      authorization: "Work authorization",
      education: "Education",
      educationValue:
        "Computer Science Engineering, Universidad Adolfo Ibáñez (Chile), 2021",
    },
    lookingForTitle: "What I'm looking for",
    lookingForBody:
      "Senior data platform or data engineering roles, with backend work welcome, ideally somewhere the people problem matters as much as the technical one. Comfortable as the first engineer on a team or the calm one on a big one.",
    primaryAction: "Send me an email",
    resume: {
      title: "Want my résumé?",
      body: "I tailor my résumé to each role, so I send it on request. Tell me about the position and I'll reply with a version that fits it.",
      action: "Request my résumé",
      emailSubject: "Résumé request: [role] at [company]",
      emailBody:
        "Hi Sebastián,\n\nI'd like to see your résumé for this role:\n\nRole:\nCompany:\nJob posting link:\nLocation or remote:\n\nAnything else I should know:\n\nThanks,\n",
    },
  },
  howItsBuilt: {
    metaTitle: "How it's built | {name}",
    metaDescription:
      "The engineering behind this site: validated content, a static bilingual build, and CI that tests routes, accessibility and performance before anything deploys.",
    eyebrow: "How it's built",
    title: "Built like a small data product",
    intro:
      "Content lives in versioned files with a schema, every build validates it, and every change has to pass the same checks before it reaches production. Here is how that works, and the trade-offs behind it.",
    pipelineTitle: "From notes to a deployed page",
    pipeline: [
      {
        title: "Source notes",
        body: "Each role starts as a Markdown document. A Claude skill turns those notes into two JSON files: a controlled vocabulary of tags and the experience entries themselves.",
      },
      {
        title: "Contracts",
        body: "Zod schemas define both files, and the TypeScript types are inferred from them, so the data, the types and the validator can't drift apart.",
      },
      {
        title: "Cross-file rules",
        body: "A validator checks what a schema can't: every tag exists under the right type, ids are unique, and the lists in code (search aliases, starter tags, timeline lanes) point at real data.",
      },
      {
        title: "Static build",
        body: "Invalid content fails the build with a readable list of problems. Valid content becomes plain HTML in English and Spanish, with canonical links, hreflang, a sitemap and share images.",
      },
      {
        title: "Deploy and measure",
        body: "The site runs as static files on Render behind Cloudflare, with no server or database. Umami records a small set of typed events, like which skills visitors filter by.",
      },
    ],
    gatesTitle: "What every change has to pass",
    gates: [
      {
        title: "Lint and types",
        body: "ESLint and strict TypeScript, including typed message keys, so a missing translation is a compile error.",
      },
      {
        title: "Content validation",
        body: "The schemas and cross-file rules, run on their own before the build.",
      },
      {
        title: "Unit tests",
        body: "Date math, overlap-merged years of experience, sorting, related-role scoring, search aliases and typo matching, and tests that break the data on purpose to prove the validator catches it.",
      },
      {
        title: "End-to-end tests",
        body: "Every page in both languages returns 200 with the right language, canonical link and hreflang, and hydrates without errors, with and without reduced motion.",
      },
      {
        title: "Accessibility",
        body: "Automated color-contrast checks in dark and light theme on every page. Their first run found real failures; the color tokens are now computed to clear 4.6:1 on every surface.",
      },
      {
        title: "Lighthouse budget",
        body: "Accessibility and SEO at 95 or more and best practices at 90 or more fail the build if they drop; performance is tracked as a warning.",
      },
    ],
    decisionsTitle: "Decisions and their trade-offs",
    tradeoffLabel: "Trade-off:",
    decisions: [
      {
        title: "Static export, no server",
        body: "The content changes when I edit it, so every page is prerendered and served as files.",
        tradeoff: "no per-request logic; anything dynamic happens at build time or in the browser.",
      },
      {
        title: "A small custom i18n layer",
        body: "English stays at /story and Spanish at /es/story. The common library does that with middleware, which a static site can't run, so the translator and path helpers are about 200 lines of typed code. Each language has its own root layout, so every page declares its language in the HTML and ships only its own translations.",
        tradeoff: "no plural rules, and switching language reloads the page.",
      },
      {
        title: "Files with contracts, not a CMS",
        body: "Two JSON files in git are the whole content model: diffable, reviewable, and validated on every build.",
        tradeoff: "an edit needs a pull request, and the step from raw JSON to typed data is one documented assumption backed by validation.",
      },
      {
        title: "Server by default",
        body: "Pages render on the server; only the search, grid and drawer run in the browser. Anything that depends on today's date renders at build time, so the HTML and the hydrated page can't disagree.",
        tradeoff: "the server shapes the data twice: once for the pages and once, trimmed, for the interactive part.",
      },
      {
        title: "Résumé on request",
        body: "There is no PDF to download. The site carries what a screen needs, and the résumé comes by email, tailored to the role.",
        tradeoff: "one more step for a recruiter, in exchange for a conversation.",
      },
      {
        title: "Accessibility is tested",
        body: "Contrast is measured, text never goes below 12px, touch targets are at least 24px, and motion respects the reduced-motion setting.",
        tradeoff: "a slightly less saturated tag palette.",
      },
    ],
    sourceTitle: "Read the code",
    sourceBody:
      "The repository is public: the data contracts, the tests and the CI workflow are all there, with an architecture overview in the README.",
    sourceCta: "View the repository",
  },
  notFound: {
    code: "404",
    title: "Not found",
    body: "That page doesn't exist (yet).",
    back: "← Back to the Explorer",
  },
};

export type Messages = typeof en;
