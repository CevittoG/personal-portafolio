import { messagesByLocale, type Messages } from "./messages";
import { translate, type MessageKey, type Values } from "./translator";
import type { Locale } from "./locale";

/**
 * Server-side i18n helpers (plan §18).
 *
 * Server components and static-generation paths can't consume the React
 * context. They pin their locale at the file boundary (each ES route does
 * `getTranslator("es")`, each EN route does `getTranslator("en")`) and
 * get the same `t(key, values?)` ergonomics as the client hook.
 */
export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale];
}

export type ServerTranslator = <K extends MessageKey>(
  key: K,
  values?: Values,
) => string;

export function getTranslator(locale: Locale): ServerTranslator {
  const messages = messagesByLocale[locale];
  return ((key: string, values?: Values) =>
    translate(messages, key, values)) as ServerTranslator;
}
