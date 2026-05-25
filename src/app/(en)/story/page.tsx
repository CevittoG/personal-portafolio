import type { Metadata } from "next";
import { Story } from "@/components/story/Story";
import { siteConfig } from "@/lib/site/config";
import { getMessages } from "@/i18n/server";
import { DEFAULT_LOCALE } from "@/i18n/locale";

const messages = getMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: messages.story.metaTitle.replace("{name}", siteConfig.name),
  description: messages.story.metaDescription,
};

/**
 * EN Story route. Body lives in the shared `<Story>` component (plan §7,
 * §18) — both EN and ES routes render it with their own locale prop.
 */
export default function StoryPage() {
  return <Story locale={DEFAULT_LOCALE} />;
}
