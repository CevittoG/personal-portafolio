import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Contact } from "@/components/contact/Contact";

export const metadata: Metadata = staticPageMetadata("contact", "es");

export default function ContactPage() {
  return <Contact locale="es" />;
}
