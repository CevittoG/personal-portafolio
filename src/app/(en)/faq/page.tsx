import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { Faq } from "@/components/faq/Faq";

export const metadata: Metadata = staticPageMetadata("faq", DEFAULT_LOCALE);

export default function FaqPage() {
  return <Faq locale={DEFAULT_LOCALE} />;
}
