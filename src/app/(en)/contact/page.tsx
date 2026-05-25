import type { Metadata } from "next";
import { Contact } from "@/components/contact/Contact";
import { siteConfig } from "@/lib/site/config";
import { getMessages } from "@/i18n/server";
import { DEFAULT_LOCALE } from "@/i18n/locale";

const messages = getMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: messages.contact.metaTitle.replace("{name}", siteConfig.name),
  description: messages.contact.metaDescription,
};

export default function ContactPage() {
  return <Contact locale={DEFAULT_LOCALE} />;
}
