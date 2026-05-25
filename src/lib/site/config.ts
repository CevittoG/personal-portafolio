/**
 * Site-wide identity + structural config.
 *
 * After step 18 (i18n), all authored prose moved into the message catalogues
 * (`src/i18n/messages/{en,es}.ts`). What stays here are the locale-agnostic
 * facts: display name, email, availability boolean, optional resume URL.
 * Prose lives next to its translations; data lives here.
 */
export interface SiteConfig {
  /** Display name shown in the Navbar and Hero (proper noun — same in all locales). */
  name: string;
  /** Short title fragment used as a fallback when no role tag is animating. */
  title: string;
  /** Email used by the Footer + Contact page. */
  email: string;
  /** Availability boolean for the Contact page badge (plan §9). The
   *  human-readable strings come from `t("contact.availability.*")`. */
  availability: {
    open: boolean;
  };
  /** Optional full-resume PDF link (plan §9). When null, the download
   *  affordance is hidden. Drop the PDF into `public/` and set the href.
   *  Label is i18n-resolved via `t("contact.resumeAction")`. */
  resume: { href: string } | null;
}

export const siteConfig: SiteConfig = {
  name: "Sebastián Gutiérrez",
  title: "Software Engineer",
  email: "aseba.gutierrezm@gmail.com",
  availability: {
    open: true,
  },
  resume: null,
};
