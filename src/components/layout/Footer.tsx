"use client";

import { cn } from "@/lib/utils";
import { OWNER_NAME, SOCIAL_LINKS } from "./social-links";
import { useTranslations } from "@/i18n/I18nProvider";

/**
 * Global Footer (plan §5, §18).
 *
 * Single line of socials + copyright. Client component so it can read
 * locale-specific copy via `useTranslations()` — the strings are tiny
 * but they need to be in the right language.
 */
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4",
          "px-6 py-6 flex-col sm:flex-row",
        )}
      >
        <p className="text-xs text-text-muted">
          {t("footer.rights", { year, name: OWNER_NAME })}
        </p>
        <ul className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-label={t(link.labelKey)}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-md",
                  "text-text-secondary hover:text-accent",
                  "cursor-pointer transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-accent focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-bg",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d={link.iconPath} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
