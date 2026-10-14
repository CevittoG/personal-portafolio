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
  /** Name without diacritics: what most ATS and search queries type. */
  alternateName: string;
  /** Canonical production origin (no trailing slash). */
  url: string;
  /** Email used by the Footer + Contact page. */
  email: string;
  /** Public profiles. Rendered by the Navbar, Hero and Footer. */
  links: {
    github: string;
    linkedin: string;
    /** This site's source, linked from "How it's built". */
    repo: string;
  };
  /** Home base and how I work, for the footer line, JSON-LD and llms.txt. */
  location: {
    locality: string;
    region: string;
    regionName: string;
    country: string;
    countryName: string;
    /** Work modes I'm open to; the human copy lives in the catalogues. */
    openTo: readonly ("remote" | "hybrid")[];
  };
  /** Languages I work in, as BCP 47 codes and English names. */
  languages: readonly { code: string; name: string }[];
  /** Availability boolean for the Contact page badge (plan §9). The
   *  human-readable strings come from `t("contact.availability.*")`. */
  availability: {
    open: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "Sebastián Gutiérrez",
  alternateName: "Sebastian Gutierrez",
  url: "https://asebagutierrezm.com",
  email: "aseba.gutierrezm@gmail.com",
  links: {
    github: "https://github.com/CevittoG",
    linkedin: "https://www.linkedin.com/in/asebagutierrezm/",
    repo: "https://github.com/CevittoG/personal-portafolio",
  },
  location: {
    locality: "Austin",
    region: "TX",
    regionName: "Texas",
    country: "US",
    countryName: "United States",
    openTo: ["remote", "hybrid"],
  },
  languages: [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
  ],
  availability: {
    open: true,
  },
};
