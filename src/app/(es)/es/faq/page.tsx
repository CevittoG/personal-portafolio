import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Faq } from "@/components/faq/Faq";

export const metadata: Metadata = staticPageMetadata("faq", "es");

export default function FaqPage() {
  return <Faq locale="es" />;
}
