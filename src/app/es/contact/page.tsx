import type { Metadata } from "next";
import { Contact } from "@/components/contact/Contact";
import { siteConfig } from "@/lib/site/config";
import { getMessages } from "@/i18n/server";

const messages = getMessages("es");

export const metadata: Metadata = {
  title: messages.contact.metaTitle.replace("{name}", siteConfig.name),
  description: messages.contact.metaDescription,
  alternates: {
    canonical: "/es/contact",
    languages: { en: "/contact", es: "/es/contact", "x-default": "/contact" },
  },
};

export default function ContactPage() {
  return <Contact locale="es" />;
}
