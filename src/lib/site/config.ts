/**
 * Site-wide identity + structural config.
 *
 * After step 18 (i18n), all authored prose moved into the message catalogues
 * (`src/i18n/messages/{en,es}.ts`). What stays here are the locale-agnostic
 * facts: display name, email, availability boolean. There is deliberately
 * no résumé URL: the résumé is tailored per role and sent on request (see
 * the Contact page's `#resume` section).
 * Prose lives next to its translations; data lives here.
 */
export interface SiteConfig {
  /** Display name shown in the Navbar and Hero (proper noun — same in all locales). */
  name: string;
  /** Email used by the Footer + Contact page. */
  email: string;
  /** Availability boolean for the Contact page badge (plan §9). The
   *  human-readable strings come from `t("contact.availability.*")`. */
  availability: {
    open: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "Sebastián Gutiérrez",
  email: "aseba.gutierrezm@gmail.com",
  availability: {
    open: true,
  },
};
