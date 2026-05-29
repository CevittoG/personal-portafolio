"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from "framer-motion";
import { TagPill } from "@/components/tags/TagPill";
import {
  formatPeriod,
  getDescriptionTeaser,
  getDrawerSubMeta,
  getHeadingLine,
  getMetaBadge,
} from "@/lib/experience/format";
import type { ExperienceEntry } from "@/lib/experience/types";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { withLocale } from "@/i18n/path";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { formatTagLabel } from "@/lib/taxonomy/format";
import { tagTypeLabel } from "@/lib/taxonomy/labels";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";
import { cn } from "@/lib/utils";

/**
 * ExperienceDrawer — plan §11.
 *
 * Two layouts driven by one component:
 *   - Desktop (≥ sm): right-side slide-over, ~480px wide
 *   - Mobile  (< sm): bottom sheet, 90vh, swipe-down to dismiss
 *
 * Owns no entry data — presentational. Accepts the selected entry plus
 * open/close callbacks. URL is NOT changed when the drawer opens (plan §11):
 * the page keeps its `?tags=…` state, the user can close and the grid's
 * scroll position is preserved (grid never re-renders during open/close).
 *
 * Accessibility:
 *   - `role="dialog"` + `aria-modal="true"` + `aria-labelledby` on title
 *   - Escape closes; overlay click closes
 *   - Body scroll is locked while open
 *   - First focusable element (close button) is focused on open
 */
export interface ExperienceDrawerProps {
  entry: ExperienceEntry | null;
  onClose: () => void;
  /** Used to compose the Dig deeper link. Defaults to `/experience/{id}`. */
  detailHref?: (entry: ExperienceEntry) => string;
}

const DESKTOP_QUERY = "(min-width: 640px)"; // matches Tailwind `sm`

export function ExperienceDrawer({
  entry,
  onClose,
  detailHref,
}: ExperienceDrawerProps) {
  const open = entry !== null;
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);
  const reduceMotion = useReducedMotion();
  const t = useTranslations();
  const locale = useLocale();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  // Default deep-dive href is locale-aware so "Dig deeper" preserves locale.
  const resolveDetailHref =
    detailHref ?? ((e: ExperienceEntry) => withLocale(`/experience/${e.id}`, locale));

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus the close button on open (basic focus management)
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const panelVariants = useMemo(
    () =>
      isDesktop
        ? {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
          }
        : {
            initial: { y: "100%" },
            animate: { y: 0 },
            exit: { y: "100%" },
          },
    [isDesktop],
  );

  // On mobile, swipe-down past a threshold dismisses (plan §14)
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (isDesktop) return;
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };

  return (
    <AnimatePresence>
      {entry && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label={t("drawer.closeDrawer")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="absolute inset-0 cursor-default bg-bg/80 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.aside
            initial={panelVariants.initial}
            animate={panelVariants.animate}
            exit={panelVariants.exit}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "tween", ease: "easeOut", duration: 0.3 }
            }
            drag={isDesktop ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={onDragEnd}
            className={cn(
              "absolute bg-surface text-text-primary shadow-2xl",
              "flex flex-col overflow-hidden",
              // Desktop: right slide-over (~480px)
              "sm:right-0 sm:top-0 sm:h-full sm:w-[min(480px,90vw)]",
              "sm:border-l sm:border-border",
              // Mobile: bottom sheet 90vh with grab handle
              "inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl",
              "sm:rounded-none sm:max-h-none",
            )}
          >
            <DrawerContent
              entry={entry}
              titleId={titleId}
              closeRef={closeRef}
              onClose={onClose}
              detailHref={resolveDetailHref(entry)}
              isDesktop={isDesktop}
            />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Drawer body ─────────────────────────────────────────────────────── */

interface DrawerContentProps {
  entry: ExperienceEntry;
  titleId: string;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  detailHref: string;
  isDesktop: boolean;
}

// Body section stagger: each direct child of the scroll body fades up
// sequentially once the drawer panel finishes opening. Quiet by design.
const BODY_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.12 },
  },
} as const;
const BODY_ITEM = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

function DrawerContent({
  entry,
  titleId,
  closeRef,
  onClose,
  detailHref,
  isDesktop,
}: DrawerContentProps) {
  const t = useTranslations();
  const heading = getHeadingLine(entry);
  const subMeta = getDrawerSubMeta(entry);
  const badge = getMetaBadge(entry);
  const period = formatPeriod(entry.period);
  const teaser = getDescriptionTeaser(entry);
  const topImpact = entry.impact.slice(0, 3);
  const reduceMotion = useReducedMotion();

  // Tags grouped by type, in canonical order — empty buckets skipped
  const tagBuckets = TAG_TYPES
    .map((type) => ({ type, slugs: entry.tags[type] ?? [] }))
    .filter((b) => b.slugs.length > 0);

  return (
    <>
      {/* Mobile-only grab handle (cue for swipe-down) */}
      {!isDesktop && (
        <div
          aria-hidden="true"
          className="flex justify-center pt-2 pb-1"
        >
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-start justify-between gap-3 border-b border-border px-6 pt-5 pb-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {heading.secondary}
          </p>
          <h2
            id={titleId}
            className="mt-1 text-xl font-semibold tracking-tight text-text-primary"
          >
            {heading.primary}
          </h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("drawer.close")}
          className={cn(
            "shrink-0 cursor-pointer rounded-full p-2 text-text-secondary",
            "hover:bg-surface-elevated hover:text-text-primary",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "focus-visible:ring-offset-surface",
          )}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </header>

      {/* Scrollable body */}
      <motion.div
        variants={reduceMotion ? undefined : BODY_CONTAINER}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
      >
        {/* Meta row */}
        <motion.div
          variants={reduceMotion ? undefined : BODY_ITEM}
          className="flex flex-wrap items-center gap-2 text-sm text-text-secondary"
        >
          <span>{period}</span>
          {badge && (
            <>
              <span aria-hidden="true" className="text-text-muted">·</span>
              <span
                className={cn(
                  "rounded-full border border-border bg-bg/40",
                  "px-2 py-0.5 text-xs",
                )}
              >
                {badge}
              </span>
            </>
          )}
          {subMeta && (
            <>
              <span aria-hidden="true" className="text-text-muted">·</span>
              <span>{subMeta}</span>
            </>
          )}
        </motion.div>

        {/* Summary */}
        {entry.summary && (
          <motion.p
            variants={reduceMotion ? undefined : BODY_ITEM}
            className="text-base leading-relaxed text-text-primary"
          >
            {entry.summary}
          </motion.p>
        )}

        {/* Description teaser */}
        {teaser && teaser !== entry.summary && (
          <motion.p
            variants={reduceMotion ? undefined : BODY_ITEM}
            className="text-sm leading-relaxed text-text-secondary"
          >
            {teaser}
          </motion.p>
        )}

        {/* Top impact */}
        {topImpact.length > 0 && (
          <motion.section
            variants={reduceMotion ? undefined : BODY_ITEM}
            aria-labelledby={`${titleId}-impact`}
            className="space-y-2"
          >
            <h3
              id={`${titleId}-impact`}
              className="text-xs uppercase tracking-wider text-text-muted"
            >
              {t("drawer.impact")}
            </h3>
            <ul className="space-y-1.5">
              {topImpact.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-text-primary leading-relaxed"
                >
                  <span aria-hidden="true" className="mt-1 text-accent">
                    ▸
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Tag cloud, grouped by type */}
        {tagBuckets.length > 0 && (
          <motion.section
            variants={reduceMotion ? undefined : BODY_ITEM}
            aria-labelledby={`${titleId}-tags`}
            className="space-y-3"
          >
            <h3
              id={`${titleId}-tags`}
              className="text-xs uppercase tracking-wider text-text-muted"
            >
              {t("drawer.tags")}
            </h3>
            <div className="space-y-2">
              {tagBuckets.map(({ type, slugs }) => (
                <TagBucket key={type} type={type} slugs={slugs} />
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>

      {/* Footer — Dig deeper opens in new tab (plan §11) */}
      <footer className="border-t border-border px-6 py-4">
        <a
          href={detailHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-full",
            "bg-accent px-5 py-2.5 text-sm font-medium text-on-accent",
            "hover:bg-accent-hover transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "focus-visible:ring-offset-surface",
          )}
        >
          {t("drawer.digDeeper")}
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </>
  );
}

function TagBucket({ type, slugs }: { type: TagType; slugs: readonly string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[0.65rem] uppercase tracking-wider text-text-muted">
        {tagTypeLabel(type)}
      </span>
      {slugs.map((slug) => (
        <TagPill
          key={slug}
          slug={slug}
          label={formatTagLabel(slug)}
          type={type}
          state="inactive"
        />
      ))}
    </div>
  );
}
