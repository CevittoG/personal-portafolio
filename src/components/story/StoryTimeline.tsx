"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { TagPill } from "@/components/tags/TagPill";
import {
  formatPeriod,
  getDrawerSubMeta,
  getHeadingLine,
} from "@/lib/experience/format";
import type { ExperienceEntry } from "@/lib/experience/types";
import { formatTagLabel } from "@/lib/taxonomy/format";
import { cn } from "@/lib/utils";

/**
 * StoryTimeline — the visual spine of the Story page (plan §7 Acts 1 & 3).
 *
 * Vertical timeline with a centre rail on `lg+`, alternating left/right
 * entries. Below `lg` it collapses to a single column with the rail flush
 * left, like a reading column.
 *
 * Plan §15 polish: the rail now draws in as the user scrolls (TracingBeam
 * equivalent built with Framer Motion's `useScroll` — Aceternity's component
 * is hardcoded for a left-rail layout and doesn't fit the alternating-side
 * centre rail we use here). Each entry fades up as it enters the viewport.
 * Reduced-motion users get the final state immediately.
 */
export interface StoryTimelineProps {
  entries: readonly ExperienceEntry[];
  /** Which tag type to surface as the entry's chip cluster. Defaults to
   *  `soft_skills` for Act 1 (the foundation acts emphasize human skills);
   *  the technical career act uses `concepts` to spotlight what was built. */
  highlightTagType?: "soft_skills" | "concepts" | "technologies";
  /** When true, each entry's heading links to its deep-dive page in a new
   *  tab (plan §7 Act 3). */
  linkToDeepDive?: boolean;
  className?: string;
}

export function StoryTimeline({
  entries,
  highlightTagType = "soft_skills",
  linkToDeepDive = false,
  className,
}: StoryTimelineProps) {
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLOListElement>(null);

  // `useScroll` returns 0 at the moment the ol's top hits the viewport bottom
  // and 1 when its bottom hits the viewport top. We crop the active range so
  // the beam fills as the user reads, not before/after.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 60%"],
  });
  // Smooth out scroll jitter so the beam tracks the read pace, not the wheel.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const scaleY = useTransform(smooth, [0, 1], [0, 1]);

  if (entries.length === 0) return null;

  return (
    <ol ref={railRef} className={cn("relative", className)}>
      {/* Centre rail (desktop) / left rail (mobile) — base track, faint */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 bottom-0 w-px bg-border",
          "left-3 lg:left-1/2",
        )}
      />
      {/* Scroll-linked accent overlay drawing the rail in as you read */}
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          style={{ scaleY, transformOrigin: "top" }}
          className={cn(
            "absolute top-0 bottom-0 w-px bg-accent/70",
            "left-3 lg:left-1/2",
          )}
        />
      )}
      {entries.map((entry, i) => (
        <TimelineRow
          key={entry.id}
          entry={entry}
          side={i % 2 === 0 ? "left" : "right"}
          highlightTagType={highlightTagType}
          linkToDeepDive={linkToDeepDive}
        />
      ))}
    </ol>
  );
}

function TimelineRow({
  entry,
  side,
  highlightTagType,
  linkToDeepDive,
}: {
  entry: ExperienceEntry;
  side: "left" | "right";
  highlightTagType: NonNullable<StoryTimelineProps["highlightTagType"]>;
  linkToDeepDive: boolean;
}) {
  const heading = getHeadingLine(entry);
  const meta = getDrawerSubMeta(entry);
  const period = formatPeriod(entry.period);
  const highlight = entry.tags[highlightTagType] ?? [];

  return (
    <li
      className={cn(
        "relative pl-10 pb-12 last:pb-0",
        // Desktop split: even-index → left column, odd → right column
        "lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-12",
      )}
    >
      {/* Node dot on the rail */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute z-10 h-3 w-3 rounded-full bg-accent ring-4 ring-bg",
          "left-3 -translate-x-1/2 top-1.5",
          "lg:left-1/2",
        )}
      />

      {/* Content cell — sits on one side; the other cell is empty for spacing */}
      <div
        className={cn(
          "lg:col-start-1",
          side === "right" && "lg:col-start-2",
          // Visual padding so cards don't bleed into the rail
          "lg:pr-8",
          side === "right" && "lg:pl-8 lg:pr-0",
        )}
      >
        <Reveal>
          <article
            className={cn(
              "rounded-2xl border border-border bg-surface/40 p-5",
            )}
          >
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {period}
            {meta && (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                {meta}
              </>
            )}
          </p>

          {linkToDeepDive ? (
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              <Link
                href={`/experience/${entry.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-accent transition-colors duration-150"
              >
                {heading.primary}
                <span aria-hidden="true" className="ml-1 text-text-muted">
                  ↗
                </span>
              </Link>
            </h3>
          ) : (
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-text-primary">
              {heading.primary}
            </h3>
          )}

          {heading.secondary && (
            <p className="text-sm text-text-secondary">{heading.secondary}</p>
          )}

          {entry.summary && (
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {entry.summary}
            </p>
          )}

          {highlight.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {highlight.map((slug) => (
                <TagPill
                  key={slug}
                  slug={slug}
                  label={formatTagLabel(slug)}
                  type={highlightTagType}
                  state="inactive"
                />
              ))}
            </div>
          )}
          </article>
        </Reveal>
      </div>
    </li>
  );
}
