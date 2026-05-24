/**
 * Site-wide authored copy and identity.
 *
 * Lives outside taxonomy.json / experience.json because none of this is
 * derived from experience data — it's the human-written voice on top of the
 * data layer (plan §6 Hero, §13 Copy Tone). One file = one place to update.
 *
 * Keep it concise and reread plan §13 before editing values.
 */
export interface SiteConfig {
  /** Display name shown in the Navbar and Hero. */
  name: string;
  /** Short title fragment used as a fallback when no role tag is animating. */
  title: string;
  /** Hero positioning sentence — first person, plain, no buzzwords. */
  positioningStatement: string;
  /** Email used by the Footer + Contact page. */
  email: string;
  /** Availability flag for the Contact page (plan §9). */
  availability: {
    open: boolean;
    note: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Sebastián Gutiérrez",
  title: "Software Engineer",
  positioningStatement:
    "I build data systems that handle real scale — and I make sure the people who depend on them actually understand what they do.",
  email: "aseba.gutierrezm@gmail.com",
  availability: {
    open: true,
    note: "Open to remote roles across the Americas and EU time zones.",
  },
};
