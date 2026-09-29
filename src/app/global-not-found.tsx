import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { themeInitScript } from "@/lib/theme/inline-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | Sebastián Gutiérrez",
  robots: { index: false },
};

/**
 * Site-wide 404. With one root layout per language there is no shared root
 * layout to render a `not-found`, so Next's `global-not-found` renders the
 * whole document itself (theme script included). Copy and `lang` follow
 * the URL (`NotFoundContent`).
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <NotFoundContent />
      </body>
    </html>
  );
}
