import type { MessageKey } from "@/i18n/translator";

/**
 * Primary nav config (plan §5, §18).
 * `/experience/[id]` is intentionally excluded — those pages are reached
 * via the drawer "Dig deeper" button (new tab) or a direct shared link.
 *
 * `href` is the path **in the default locale**. The Navbar prefixes the
 * current locale (e.g. `/es/story`) at render time, so adding a new route
 * = append one entry here (OCP — no Navbar edit, no per-locale duplication).
 *
 * `labelKey` is a typed i18n message key. The Navbar resolves it through
 * `useTranslations()` so labels stay in sync with the active locale.
 */
export interface NavItem {
  /** i18n key — must resolve to a string in every locale catalogue. */
  labelKey: MessageKey;
  /** Path in the default locale. */
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: "nav.explorer", href: "/" },
  { labelKey: "nav.story", href: "/story" },
  { labelKey: "nav.contact", href: "/contact" },
];
