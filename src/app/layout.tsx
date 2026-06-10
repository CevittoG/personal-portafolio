import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { themeInitScript } from "@/lib/theme/inline-script";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { langInitScript } from "@/i18n/inline-script";
import { getMessages } from "@/i18n/server";
import "./globals.css";

// Root-level metadata uses the default locale — per-locale routes override
// title/description in their own metadata. hreflang alternates live here so
// every page emits them in <head>.
const messages = getMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: messages.meta.title,
  description: messages.meta.description,
  alternates: {
    languages: {
      en: "/",
      es: "/es",
      "x-default": "/",
    },
  },
};

/**
 * Root layout — minimal shell (plan §18).
 *
 * Owns `<html>`, `<head>`, and globally-shared providers (theme + page
 * transition template). Does NOT render Navbar/Footer/I18nProvider — those
 * move to per-locale layouts (`(en)/layout.tsx` and `es/layout.tsx`) so each
 * tree consumes the correct message catalogue. Static export can't branch
 * the root on URL, so this is the cleanest separation.
 *
 * `<html lang>` is "en" at SSR; the inline lang-init script patches it to
 * "es" before paint on `/es/...` paths. `suppressHydrationWarning` covers
 * the script-driven attribute mutations (theme + lang).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_LOCALE} data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to the Simple Icons CDN (Logo Drop Cluster source) */}
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        {/* Blocking inline scripts — must run before first paint to prevent
            FOUC (theme) and incorrect lang attribute (i18n). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
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
