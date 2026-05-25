"use client";

import { useMemo } from "react";
import { StatCard } from "./StatCard";
import { Reveal } from "@/components/motion/Reveal";
import { statComputers } from "@/lib/stats/registry";
import { defaultFilterStrategy } from "@/lib/filters/tag-match";
import { useTranslations } from "@/i18n/I18nProvider";
import type { ExperienceEntry } from "@/lib/experience/types";
import { cn } from "@/lib/utils";

/**
 * StatsBar — plan §6 Zone 3.
 *
 * Renders a horizontal row of StatCards (2×N grid on mobile) derived from
 * the currently filtered entries. Stats are computed client-side on every
 * filter change — no server needed.
 *
 * Presentational contract (SRP):
 *   - Receives the full entry array + active tag slugs as props.
 *   - Filters entries via the default AllTagsMatchStrategy.
 *   - Computes each stat by running the registered StatComputer instances.
 *   - Passes computed values down to StatCard for display + animation.
 *
 * Adding a new stat: drop a StatComputer in src/lib/stats/computers/ and
 * register it in src/lib/stats/registry.ts — this component is never touched.
 */
export interface StatsBarProps {
  entries: readonly ExperienceEntry[];
  /** Active tag slugs from useFilterTags — drives which entries count. */
  activeSlugs: readonly string[];
  className?: string;
}

export function StatsBar({ entries, activeSlugs, className }: StatsBarProps) {
  const t = useTranslations();
  const filtered = useMemo(
    () =>
      entries.filter((e) =>
        defaultFilterStrategy.matches(e, activeSlugs as string[]),
      ),
    [entries, activeSlugs],
  );

  const stats = useMemo(
    () =>
      statComputers.map((computer) => {
        const raw = computer.compute(filtered);
        // `format` present → non-animatable string (e.g. "15M+"), passed as-is
        // `suffix` present → animate number, append unit after count-up
        // neither          → plain number, no suffix
        const value: number | string = computer.format ? computer.format(raw) : (raw as number | string);
        const label = computer.labelKey ? t(computer.labelKey) : computer.label;
        return {
          id: computer.id,
          label,
          value,
          suffix: computer.suffix,
        };
      }),
    // `t` identity is stable per provider value; safe to omit, but include
    // it to satisfy the exhaustive-deps rule.
    [filtered, t],
  );

  return (
    <div
      aria-label={t("stats.region")}
      className={cn(
        // Mobile: 2-column grid; sm+: one row per plan §14
        "grid grid-cols-2 gap-3 sm:grid-cols-4",
        className,
      )}
    >
      {stats.map(({ id, label, value, suffix }, i) => (
        <Reveal key={id} delay={i * 0.05} amount={0.3}>
          <StatCard value={value} suffix={suffix} label={label} />
        </Reveal>
      ))}
    </div>
  );
}
