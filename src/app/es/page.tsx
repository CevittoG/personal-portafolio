import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Landing } from "@/components/explorer/Landing";

export const metadata: Metadata = staticPageMetadata("home", "es");

/** ES landing route (`/es`): same server `<Landing>` as `/`, in Spanish. */
export default function ExplorerPage() {
  return <Landing locale="es" />;
}
