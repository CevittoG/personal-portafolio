import { en, type Messages } from "./en";
import { es } from "./es";
import type { Locale } from "../locale";

/**
 * Registry of message catalogues, keyed by locale (plan §18).
 *
 * Adding a locale: import its catalogue, add it here. Type-system enforces
 * shape parity with the EN source via the `Messages` type alias.
 */
export const messagesByLocale: Record<Locale, Messages> = {
  en,
  es,
};

export type { Messages };
