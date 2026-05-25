import type { Metadata } from "next";
import { Explorer } from "@/components/explorer/Explorer";
import { getMessages } from "@/i18n/server";

const messages = getMessages("es");

export const metadata: Metadata = {
  title: messages.meta.title,
  description: messages.meta.description,
  alternates: {
    canonical: "/es",
    languages: {
      en: "/",
      es: "/es",
      "x-default": "/",
    },
  },
};

export default function ExplorerPage() {
  return <Explorer />;
}
