import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { HowItsBuilt } from "@/components/how-its-built/HowItsBuilt";

export const metadata: Metadata = staticPageMetadata("how-its-built", DEFAULT_LOCALE);

export default function HowItsBuiltPage() {
  return <HowItsBuilt locale={DEFAULT_LOCALE} />;
}
