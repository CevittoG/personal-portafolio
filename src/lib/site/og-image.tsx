import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/i18n/locale";
import { experienceRepository } from "@/lib/experience/json-repository";
import type { ExperienceEntry } from "@/lib/experience/types";
import { getTranslator } from "@/i18n/server";
import { OG_COLORS as c } from "./brand-tokens";
import { siteConfig } from "./config";
import { CORE_STACK } from "./profile";
import type { StaticPage } from "./metadata";
import { experienceTitle } from "@/lib/experience/format";

/**
 * Branded 1200×630 share card, rendered at build time (static-export safe).
 * Served by `app/og/[image]/route.tsx`; one design for every page: page
 * label, name, target role (or the role and company on a deep dive) and
 * core stack.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderShareImage({
  locale,
  eyebrow,
  headline,
}: {
  locale: Locale;
  /** Small label above the name, e.g. "My Story" or a role title. */
  eyebrow?: string;
  /** Replaces the target role line (used by deep dives). */
  headline?: string;
}): ImageResponse {
  const t = getTranslator(locale);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: c.bg,
          color: c.textPrimary,
          borderLeft: `16px solid ${c.accent}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow && (
            <div
              style={{
                fontSize: 26,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: c.textSecondary,
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 44,
              color: c.accent,
              marginTop: 16,
              lineHeight: 1.2,
            }}
          >
            {headline ?? t("hero.role")}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `2px solid ${c.border}`,
            paddingTop: 28,
            fontSize: 26,
            color: c.textSecondary,
          }}
        >
          <div style={{ display: "flex" }}>
            {CORE_STACK.slice(0, 5).join(" · ")}
          </div>
          <div style={{ display: "flex", color: c.textPrimary }}>
            {new URL(siteConfig.url).host}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/* ── Image ids ───────────────────────────────────────────────────────── */

const PAGE_EYEBROW = {
  home: null,
  story: "story.eyebrow",
  contact: "contact.eyebrow",
  "how-its-built": "howItsBuilt.eyebrow",
} as const satisfies Record<StaticPage, string | null>;

/** `/og/<id>.png` path for a fixed page. */
export function staticPageImage(page: StaticPage, locale: Locale): string {
  return `/og/${locale}-${page}.png`;
}

/** `/og/<id>.png` path for a deep dive. */
export function experienceImage(id: string, locale: Locale): string {
  return `/og/${locale}-experience-${id}.png`;
}

/** Every image id the build must emit. */
export function allShareImageIds(
  locales: readonly Locale[],
  entries: readonly ExperienceEntry[],
): string[] {
  return locales.flatMap((locale) => [
    ...(Object.keys(PAGE_EYEBROW) as StaticPage[]).map(
      (page) => `${locale}-${page}`,
    ),
    ...entries.map((entry) => `${locale}-experience-${entry.id}`),
  ]);
}

export function renderShareImageById(id: string): ImageResponse {
  // "<locale>-<page>" or "<locale>-experience-<entry id>". Page ids may
  // contain dashes ("how-its-built"), so only the locale is split off.
  const dash = id.indexOf("-");
  const locale = id.slice(0, dash);
  const kind = id.slice(dash + 1);
  if (!isLocale(locale)) throw new Error(`Unknown share image: ${id}`);
  if (kind.startsWith("experience-")) {
    const entry = experienceRepository.getById(kind.slice("experience-".length));
    return renderShareImage({
      locale,
      headline: entry ? experienceTitle(entry) : undefined,
    });
  }
  const eyebrowKey = PAGE_EYEBROW[kind as StaticPage];
  return renderShareImage({
    locale,
    eyebrow: eyebrowKey ? getTranslator(locale)(eyebrowKey) : undefined,
  });
}
