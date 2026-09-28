import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { Explorer } from "@/components/explorer/Explorer";
import { LandingTail } from "@/components/explorer/LandingTail";

export const metadata: Metadata = staticPageMetadata("home", DEFAULT_LOCALE);

/**
 * EN landing route (`/`): the client `<Explorer>` (hero, featured roles,
 * skill filter) followed by the server-rendered `<LandingTail>` (Story
 * teaser, Contact). Locale comes from `(en)/layout.tsx`.
 */
export default function ExplorerPage() {
  return (
    <>
      <Explorer />
      <LandingTail locale={DEFAULT_LOCALE} />
    </>
  );
}
