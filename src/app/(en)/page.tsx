import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { Landing } from "@/components/explorer/Landing";

export const metadata: Metadata = staticPageMetadata("home", DEFAULT_LOCALE);

/**
 * EN landing route (`/`). Assembly lives in the server `<Landing>`
 * (Hero, the client Explorer island, then the Story teaser and Contact).
 */
export default function ExplorerPage() {
  return <Landing locale={DEFAULT_LOCALE} />;
}
