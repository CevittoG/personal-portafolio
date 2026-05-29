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
    title: "Sebastian Gutierrez — Portfolio",
    description:
      "Interactive portfolio. Search by skill, tool, or role to discover the experiences that match what you're looking for.",
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
  },
  hero: {
    greeting: "Hi, I'm",
    introVerb: "I work as a",
    positioningStatement:
      "I build data systems that handle real scale, and I make sure the people who depend on them actually understand what they do.",
    cta: {
      explore: "Explore my experience",
      story: "Read my story",
    },
    logos: {
      regionLabel: "Technologies I work with",
    },
  },
  discover: {
    eyebrow: "Discover",
    title: "What are you looking for?",
    subtitle:
      "Search by skill, tool, or role. The cards and stats reshape to match what you pick.",
  },
  search: {
    placeholder: "Search by skill, tool, or role…",
    inputLabel: "Search experiences by tag",
    suggestionsLabel: "Tag suggestions",
    empty: "Start typing to see tag suggestions…",
    noMatch: 'No tags match "{query}".',
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
  stats: {
    region: "Summary statistics",
    yearsOfExperience: "Years of experience",
    technologies: "Technologies",
    industries: "Industries",
    projectsAndRoles: "Projects & roles",
    sentence:
      "Showing {entries} experiences across {years} years, {technologies} technologies, {industries} industries.",
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
    metaTitle: "My Story — {name}",
    metaDescription:
      "A three-act narrative — before tech, the pivot, and the technical career.",
    eyebrow: "My Story",
    title: "The path that got me here",
    intro:
      "Three acts, in order. The first two explain where the communication and resilience came from; the third is where they met the tools.",
    actOne: {
      eyebrow: "Act 1",
      title: "Before the terminal",
      intro:
        "Years of hospitality, teaching, and travel — the foundation, not the prelude.",
      emptyTitle: "Personal milestones are being written up.",
      emptyHint:
        "Pre-tech experience entries will land here as they're documented.",
    },
    actTwo: {
      eyebrow: "Act 2",
      title: "The pivot",
      paragraphs: [
        "At some point the question stopped being **'what's next'** and started being **'what do I want to build for the next decade'**.",
        "The answer was systems. Not because I loved code in the abstract — because I'd spent years explaining complex things to people who didn't have time to care, and software was the most leveraged version of that work I could find.",
      ],
    },
    actThree: {
      eyebrow: "Act 3",
      title: "Building systems",
      intro:
        "Professional engineering work — data infrastructure, internal tools, and the products around them.",
      emptyTitle: "Technical roles will appear here.",
      emptyHint:
        "Each role links to its full deep-dive page when you're ready to see the detail.",
    },
    now: {
      eyebrow: "Now",
      title: "What's next",
      body: "I'm looking for the next role where I can keep doing this — building data and backend systems that hold up, and translating between the people who build them and the people who depend on them. If that matches what you're hiring for, the contact page has the fastest route in.",
      cta: "Get in touch",
    },
  },
  contact: {
    metaTitle: "Contact — {name}",
    metaDescription:
      "Get in touch — availability, what I'm looking for, and the fastest way to reach me.",
    eyebrow: "Contact",
    title: "Let's talk",
    availability: {
      open: "Open to opportunities",
      closed: "Not currently looking",
    },
    availabilityNote:
      "Based in Austin TX, open to remote roles across the Americas and EU time zones.",
    lookingForTitle: "What I'm looking for",
    lookingForBody:
      "Senior data, platform, or backend engineering, ideally somewhere the people problem matters as much as the technical one. Comfortable as the first engineer on a team or the calm one on a big one.",
    primaryAction: "Send me an email",
    resumeAction: "Download full resume (PDF)",
  },
};

export type Messages = typeof en;
