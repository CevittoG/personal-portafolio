import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Explorer } from "@/components/explorer/Explorer";
import { LandingTail } from "@/components/explorer/LandingTail";

export const metadata: Metadata = staticPageMetadata("home", "es");

export default function ExplorerPage() {
  return (
    <>
      <Explorer />
      <LandingTail locale="es" />
    </>
  );
}
