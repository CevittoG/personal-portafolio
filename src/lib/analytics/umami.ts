/**
 * Typed wrapper around the Umami analytics API exposed on `window.umami`.
 *
 * The `EventMap` below is the single source of truth for every custom event
 * the site emits — add a new key here, instrument the user gesture, and the
 * Umami dashboard picks it up automatically.
 *
 * No-op safe: returns silently in SSR, when the script is blocked, or when
 * `data-domains` filters the current host. Never throws.
 */

/** Where a contact link was clicked. One value per placement. */
export type ContactSource =
  | "navbar"
  | "mobile_menu"
  | "hero"
  | "drawer"
  | "deep_dive"
  | "sticky"
  | "landing"
  | "contact";

export type ContactKind = "email" | "resume_request" | "linkedin" | "github";

export type EventMap = {
  filter_added: {
    slug: string;
    type: string;
    source: "search" | "shortcut" | "card" | "drawer";
  };
  filter_removed: { slug: string; type: string };
  search_typed: { query: string };
  experience_opened: { id: string; type: string };
  deep_dive_opened: { id: string };
  contact_clicked: { kind: ContactKind; source: ContactSource };
};

export function track<K extends keyof EventMap>(name: K, data: EventMap[K]): void {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(name, data as Record<string, unknown>);
  } catch {
    // Analytics must never break the UI.
  }
}

/**
 * The same typed events as `data-umami-event-*` attributes, for links that
 * render on the server (or in components shared by server and client
 * trees). Umami's script picks them up on click, so no client JS is needed.
 */
export function umamiAttributes<K extends keyof EventMap>(
  name: K,
  data: EventMap[K],
): Record<string, string> {
  const attrs: Record<string, string> = { "data-umami-event": name };
  for (const [key, value] of Object.entries(data)) {
    attrs[`data-umami-event-${key}`] = String(value);
  }
  return attrs;
}
