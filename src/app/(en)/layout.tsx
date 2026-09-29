import type { Metadata } from "next";
import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";
import { DEFAULT_LOCALE } from "@/i18n/locale";

export const metadata: Metadata = rootMetadata(DEFAULT_LOCALE);

/**
 * EN root layout. The `(en)` route group is invisible in URLs, so pages here
 * resolve at `/`, `/story`… and render `<html lang="en">`. The Spanish tree
 * has its own root layout at `(es)/layout.tsx`; both share `RootDocument`.
 */
export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale={DEFAULT_LOCALE}>{children}</RootDocument>;
}
