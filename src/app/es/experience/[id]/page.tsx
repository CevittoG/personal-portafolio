import type { Metadata } from "next";
import { DeepDive } from "@/components/experience/DeepDive";
import { experienceRepository } from "@/lib/experience/json-repository";
import { getHeadingLine } from "@/lib/experience/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return experienceRepository.getAll().map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = experienceRepository.getById(id);
  if (!entry) return { title: "Not found" };
  const heading = getHeadingLine(entry);
  const title = heading.secondary
    ? `${heading.primary} · ${heading.secondary}`
    : heading.primary;
  return {
    title: `${title} — Sebastián Gutiérrez`,
    description: entry.summary,
    alternates: {
      canonical: `/es/experience/${id}`,
      languages: {
        en: `/experience/${id}`,
        es: `/es/experience/${id}`,
        "x-default": `/experience/${id}`,
      },
    },
  };
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DeepDive locale="es" id={id} />;
}
