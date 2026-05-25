"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { messagesByLocale, type Messages } from "./messages";
import type { Locale } from "./locale";
import { translate, type MessageKey, type Values } from "./translator";

/**
 * I18n context — plan §18.
 *
 * One provider per layout (EN under `app/`, ES under `app/es/`). Each layout
 * passes its locale; the provider resolves the matching catalogue from the
 * registry and exposes:
 *
 *   - `locale`  the active locale code
 *   - `t(key, values?)` typed translator
 *   - `messages`  full catalogue (escape hatch for non-string nodes, e.g.
 *                 arrays of pull-quote paragraphs in Story)
 *
 * Throws if consumed outside a provider so wiring mistakes fail loudly.
 */
export interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  t: <K extends MessageKey>(key: K, values?: Values) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const messages = messagesByLocale[locale];
    return {
      locale,
      messages,
      t: ((key: string, values?: Values) =>
        translate(messages, key, values)) as I18nContextValue["t"],
    };
  }, [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n / useTranslations must be used within <I18nProvider>");
  }
  return ctx;
}

/** Convenience hook — the `t` function alone, in the style of next-intl. */
export function useTranslations() {
  return useI18n().t;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

export function useMessages(): Messages {
  return useI18n().messages;
}
