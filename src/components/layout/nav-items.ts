/**
 * Primary nav config (plan §5).
 * `/experience/[id]` is intentionally excluded — those pages are reached
 * via the drawer "Dig deeper" button (new tab) or a direct shared link.
 *
 * Adding a route to the nav = append an entry here (OCP — no Navbar edit).
 */
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Explorer", href: "/" },
  { label: "My Story", href: "/story" },
  { label: "Contact", href: "/contact" },
];
