import type { Metadata } from "next";
import { DeepDive } from "@/components/experience/DeepDive";
import { experienceRepository } from "@/lib/experience/json-repository";
import { experienceMetadata } from "@/lib/site/metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return experienceRepository.getAll().map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return experienceMetadata(id, "es");
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DeepDive locale="es" id={id} />;
}
