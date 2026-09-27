import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/site/metadata";
import { Story } from "@/components/story/Story";
import { DEFAULT_LOCALE } from "@/i18n/locale";

export const metadata: Metadata = staticPageMetadata("story", DEFAULT_LOCALE);

/**
 * EN Story route. Body lives in the shared `<Story>` component (plan §7,
 * §18) — both EN and ES routes render it with their own locale prop.
 */
export default function StoryPage() {
  return <Story locale={DEFAULT_LOCALE} />;
}
