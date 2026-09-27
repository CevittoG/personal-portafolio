import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Explorer } from "@/components/explorer/Explorer";

export const metadata: Metadata = staticPageMetadata("home", "es");

export default function ExplorerPage() {
  return <Explorer />;
}
