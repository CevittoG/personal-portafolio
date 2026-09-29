import { getDescriptionTeaser } from "./format";
import type { ExperienceEntry } from "./types";

/**
 * An entry as a client island receives it. Everything a card, drawer or
 * Story card renders stays; the long-form fields don't cross to the
 * browser: `description` becomes its first paragraph (the drawer teaser),
 * and translations and media are dropped (the entry is already localized).
 * Deep dives render on the server and keep the full entry.
 */
export function toClientEntry(entry: ExperienceEntry): ExperienceEntry {
  return {
    ...entry,
    description: getDescriptionTeaser(entry),
    translations: undefined,
    media: [],
  };
}
