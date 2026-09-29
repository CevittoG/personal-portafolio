import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { assertValidContent } from "@/content/assert-valid";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { I18nProvider } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/locale";
import { getMessages } from "@/i18n/server";
import { siteConfig } from "@/lib/site/config";
import { staticPageMetadata } from "@/lib/site/metadata";
import { jsonLdScript, personJsonLd } from "@/lib/site/structured-data";
import { themeInitScript } from "@/lib/theme/inline-script";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import "@/app/globals.css";

// Fail the build on invalid content (schemas + cross-file rules). Runs once
// at module load during `next build`; server-only, never shipped.
assertValidContent();

/**
 * Root metadata for a locale's tree: `metadataBase` resolves every relative
 * canonical, hreflang and og:image URL; title and description fall back to
 * that locale's home copy. Canonical and hreflang are set per route by
 * `buildMetadata()`, never here, so no page inherits another's.
 */
export function rootMetadata(locale: Locale): Metadata {
  const { title, description } = staticPageMetadata("home", locale);
  return { metadataBase: new URL(siteConfig.url), title, description };
}

/**
 * RootDocument — the `<html>` shell shared by both root layouts,
 * `app/(en)/layout.tsx` and `app/(es)/layout.tsx`.
 *
 * Each language is its own root layout (a Next.js multiple-root-layouts
 * setup), so `<html lang>` is correct in the static HTML itself: no
 * pre-paint language script, and screen readers, crawlers and the browser
 * all see the right language before any JavaScript runs. English stays
 * unprefixed (`/story`) and Spanish under `/es`, with no host rewrites.
 *
 * Owns: html/head (theme pre-paint script, JSON-LD), the theme and i18n
 * providers (the provider gets only this locale's catalogue), the navbar
 * and footer, and Umami. `suppressHydrationWarning` covers the theme
 * script's `data-theme` change.
 */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Blocking inline script: sets data-theme before first paint (no FOUC). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <I18nProvider locale={locale} messages={getMessages(locale)}>
            <MotionProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </MotionProvider>
          </I18nProvider>
        </ThemeProvider>
        {/* Umami analytics — cloud-hosted, fire-and-forget. `data-domains`
            limits beacons to the production host so localhost + preview
            never pollute the dashboard. */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="21a1d96a-fb3d-4830-aa40-80673c2d8439"
          data-domains="asebagutierrezm.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
