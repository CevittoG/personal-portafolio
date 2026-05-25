"use client";

import Link from "next/link";
import { AnimatedRoleLine } from "./AnimatedRoleLine";
import { LogoDropCluster, type LogoItem } from "./LogoDropCluster";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { withLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

/**
 * Hero — Explorer Zone 1 (plan §6).
 *
 * First impression in under 5 seconds. Name, animated role line, one sharp
 * positioning sentence, two CTAs that intentionally split the audience
 * (technical recruiter vs culture-curious hiring manager), and a
 * Logo Drop Cluster sitting beneath the CTAs (step 17).
 *
 * Owns no data: name + statement come from `siteConfig`, role labels and
 * the logo list come from the caller. SRP — only renders.
 */
export interface HeroProps {
  name: string;
  positioningStatement: string;
  /** Labels for the cycling role line (Hero animates these). */
  roleLabels: readonly string[];
  /** ID of the scroll target for the primary CTA (Zone 2 anchor). */
  exploreTargetId: string;
  /** Logos for the drop cluster band (step 17). Empty list = no cluster. */
  logos?: readonly LogoItem[];
  className?: string;
}

export function Hero({
  name,
  positioningStatement,
  roleLabels,
  exploreTargetId,
  logos,
  className,
}: HeroProps) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <section
      aria-label={t("hero.greeting")}
      className={cn(
        "relative isolate overflow-hidden",
        "px-6 pt-20 pb-24 sm:pt-28 sm:pb-32",
        className,
      )}
    >
      {/* Ambient visual — soft accent blooms + a top-edge vignette.
          Step 15 keeps this restrained because the Logo Drop Cluster in
          step 17 will land in the band below and own the signature
          motion; a busy Hero ambient would compete with it. */}
      <AmbientBackdrop />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-text-secondary">
          {t("hero.greeting")}
        </p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-text-primary">
          {name}
        </h1>

        <p className="mt-6 text-xl sm:text-2xl text-text-secondary leading-snug">
          <span className="mr-2">{t("hero.introVerb")}</span>
          <AnimatedRoleLine
            labels={roleLabels}
            className="font-medium text-accent"
          />
        </p>

        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-text-secondary">
          {positioningStatement}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={`#${exploreTargetId}`}
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              "px-6 py-3 text-sm font-medium",
              "bg-accent text-text-primary hover:bg-accent-hover",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg",
            )}
          >
            {t("hero.cta.explore")}
            <span aria-hidden="true" className="ml-2">
              ↓
            </span>
          </a>
          <Link
            href={withLocale("/story", locale)}
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              "px-6 py-3 text-sm font-medium",
              "border border-border bg-surface text-text-primary",
              "hover:bg-surface-elevated hover:border-text-muted",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg",
            )}
          >
            {t("hero.cta.story")}
          </Link>
        </div>
      </div>

      {/* Logo Drop Cluster — signature visual (plan §6, step 17). Sits in
          its own band beneath the CTAs and above Zone 2's search title. */}
      {logos && logos.length > 0 && (
        <div className="relative mt-12 sm:mt-16">
          <LogoDropCluster logos={logos} />
        </div>
      )}
    </section>
  );
}

/**
 * Subtle, non-distracting backdrop: two soft accent radial blooms, a faint
 * top-edge vignette to anchor the name, and a bottom fade into the bg so
 * Zone 2 picks up cleanly. All CSS, no canvas — keeps the Logo Drop Cluster
 * (step 17) as the signature visual in the band below.
 */
function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      {/* Top-edge vignette: faint darkening at the very top, fades fast.
          Reads as "frame" without ever announcing itself. */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-bg) 80%, transparent) 0%, transparent 100%)",
        }}
      />
      {/* Accent radial blooms */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 25% 10%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 50% at 80% 60%, color-mix(in srgb, var(--color-tag-domains) 14%, transparent) 0%, transparent 75%)",
        }}
      />
      {/* Soft fade to bg at the bottom so Zone 2 transitions cleanly */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg))",
        }}
      />
    </div>
  );
}
