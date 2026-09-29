"use client";

import Link from "next/link";
import { themeInitScript } from "@/lib/theme/inline-script";
import "./globals.css";

/**
 * Last-resort error boundary: replaces the root layout when it throws, so
 * it renders its own document. Explicit on purpose: Next's generated
 * default failed to prerender under static export in an earlier Next 16
 * attempt. English only: it can't know the locale and should never show.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex items-center justify-center px-6">
        <main className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-semibold text-text-primary">Something went wrong</h1>
          <p className="text-text-secondary">The page failed to load. Try again, or go back home.</p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
            >
              Try again
            </button>
            <Link href="/" className="rounded-full border border-border px-5 py-2 text-sm font-medium text-text-primary">
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
