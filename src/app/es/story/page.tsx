import type { Metadata } from "next";
import { Story } from "@/components/story/Story";
import { siteConfig } from "@/lib/site/config";
import { getMessages } from "@/i18n/server";

const messages = getMessages("es");

export const metadata: Metadata = {
  title: messages.story.metaTitle.replace("{name}", siteConfig.name),
  description: messages.story.metaDescription,
  alternates: {
    canonical: "/es/story",
    languages: { en: "/story", es: "/es/story", "x-default": "/story" },
  },
};

export default function StoryPage() {
  return <Story locale="es" />;
}
