import type { Metadata } from "next";
import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";

export const metadata: Metadata = rootMetadata("es");

/**
 * ES root layout. Pages live in `(es)/es/…`, so URLs stay `/es`, `/es/story`…
 * and render `<html lang="es">` in the static HTML. Mirror of
 * `(en)/layout.tsx`; both share `RootDocument`.
 */
export default function EsRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
