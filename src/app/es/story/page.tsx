import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Story } from "@/components/story/Story";

export const metadata: Metadata = staticPageMetadata("story", "es");

export default function StoryPage() {
  return <Story locale="es" />;
}
