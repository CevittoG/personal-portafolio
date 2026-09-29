import { ExplorerClient } from "@/components/explorer/ExplorerClient";
import { LandingTail } from "@/components/explorer/LandingTail";
import { Hero } from "@/components/hero/Hero";
import type { Locale } from "@/i18n/locale";
import { getTranslator } from "@/i18n/server";
import { buildLandingData } from "@/lib/explorer/landing-data";
import { siteConfig } from "@/lib/site/config";

/**
 * Landing — the whole `/` (and `/es`) page, server-rendered around one
 * client island.
 *
 *   Hero (server) → ExplorerClient (client: featured roles, filter, drawer)
 *   → LandingTail (server: Story teaser, Contact)
 *
 * Data is computed here (`buildLandingData`) and handed to the island as
 * props, so the browser gets only the fields it renders.
 */
const HERO_ID = "hero";
const WORK_ID = "work";
const CONTACT_ID = "landing-contact";

export function Landing({ locale }: { locale: Locale }) {
  const t = getTranslator(locale);
  const { years, ...island } = buildLandingData(locale);
  const open = siteConfig.availability.open;

  return (
    <>
      <Hero
        locale={locale}
        id={HERO_ID}
        exploreTargetId={WORK_ID}
        name={siteConfig.name}
        role={t("hero.role")}
        proofLine={t("hero.proofLine", { years })}
        positioningStatement={t("hero.positioningStatement")}
        availability={{
          open,
          label: open ? t("contact.availability.open") : t("contact.availability.closed"),
        }}
      />
      <ExplorerClient {...island} heroId={HERO_ID} workId={WORK_ID} contactId={CONTACT_ID} />
      <LandingTail locale={locale} contactId={CONTACT_ID} />
    </>
  );
}
