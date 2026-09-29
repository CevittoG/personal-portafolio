import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { HowItsBuilt } from "@/components/how-its-built/HowItsBuilt";

export const metadata: Metadata = staticPageMetadata("how-its-built", "es");

export default function HowItsBuiltPage() {
  return <HowItsBuilt locale="es" />;
}
