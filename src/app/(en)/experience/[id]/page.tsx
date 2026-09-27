import type { Metadata } from "next";
import { DeepDive } from "@/components/experience/DeepDive";
import { experienceRepository } from "@/lib/experience/json-repository";
import { experienceMetadata } from "@/lib/site/metadata";
import { DEFAULT_LOCALE } from "@/i18n/locale";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return experienceRepository.getAll().map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return experienceMetadata(id, DEFAULT_LOCALE);
}

/**
 * EN Deep Dive route (`/experience/[id]`). All assembly lives in the shared
 * `<DeepDive>` server component, which takes locale + id and renders the
 * full page. Same pattern as `<Explorer>` / `<Story>` / `<Contact>`.
 */
export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DeepDive locale={DEFAULT_LOCALE} id={id} />;
}
