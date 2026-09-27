import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Contact } from "@/components/contact/Contact";
import { DEFAULT_LOCALE } from "@/i18n/locale";

export const metadata: Metadata = staticPageMetadata("contact", DEFAULT_LOCALE);

export default function ContactPage() {
  return <Contact locale={DEFAULT_LOCALE} />;
}
