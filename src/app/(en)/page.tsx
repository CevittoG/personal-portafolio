import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { Explorer } from "@/components/explorer/Explorer";

export const metadata: Metadata = staticPageMetadata("home", DEFAULT_LOCALE);

/**
 * EN Explorer route (`/`). All assembly lives in the shared `<Explorer>`
 * component, which reads locale from the surrounding `I18nProvider`
 * (set to "en" by `(en)/layout.tsx`).
 */
export default function ExplorerPage() {
  return <Explorer />;
}
