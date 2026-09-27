import { LOCALES } from "@/i18n/locale";
import { experienceRepository } from "@/lib/experience/json-repository";
import { allShareImageIds, renderShareImageById } from "@/lib/site/og-image";

export const dynamic = "force-static";

/**
 * Share images as real `.png` files (`/og/en-home.png`, …).
 *
 * Not the `opengraph-image.tsx` convention on purpose: under static export
 * that writes extensionless files, which a static host serves without an
 * image content type and link-preview scrapers then ignore.
 */
export function generateStaticParams() {
  return allShareImageIds(LOCALES, experienceRepository.getAll()).map((id) => ({
    image: `${id}.png`,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ image: string }> },
) {
  const { image } = await params;
  return renderShareImageById(image.replace(/\.png$/, ""));
}
