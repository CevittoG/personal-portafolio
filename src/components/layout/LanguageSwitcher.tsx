"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  type Locale,
} from "@/i18n/locale";
import { useLocale } from "@/i18n/I18nProvider";
import { useTranslations } from "@/i18n/I18nProvider";
import { switchLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

/**
 * LanguageSwitcher — pills in the Navbar (plan §18).
 *
 * Two pills (`EN` / `ES`), active state highlighted with the accent. Click
 * navigates to the equivalent path in the target locale and persists the
 * choice as a `NEXT_LOCALE` cookie so the next visit lands in the chosen
 * language. The query string + hash survive the swap — a shared filtered
 * link (`/?tags=python`) becomes `/es?tags=python`.
 *
 * Server-rendered both pills so the toggle is interactive immediately even
 * before hydration; clicks are intercepted to write the cookie before the
 * navigation so the next request would have it (matters once a server is
 * introduced — harmless under static export).
 */
export interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const current = useLocale();
  const t = useTranslations();
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const onPick = useCallback(
    (locale: Locale) => {
      if (locale === current) return;
      // Persist for future visits — `Max-Age=1 year`, `SameSite=Lax`.
      if (typeof document !== "undefined") {
        document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
      }
      const target = switchLocale(pathname, locale);
      // Preserve the search string + hash from the current URL.
      const search =
        typeof window !== "undefined"
          ? window.location.search + window.location.hash
          : "";
      router.push(target + search);
    },
    [current, pathname, router],
  );

  return (
    <div
      role="group"
      aria-label={t("nav.languageLabel")}
      className={cn(
        "inline-flex items-center rounded-full border border-border",
        "bg-surface p-0.5",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === current;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onPick(code)}
            aria-current={active ? "true" : undefined}
            aria-pressed={active}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg",
              active
                ? "bg-accent text-text-primary"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
