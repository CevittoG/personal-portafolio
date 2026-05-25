"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AnimatedRoleLine — Hero zone (plan §6 Zone 1).
 *
 * Cycles through a list of role labels with a fade + slight upward shift via
 * Framer Motion. Honors `prefers-reduced-motion` by static-rendering the
 * first label (no animation, no interval — accessibility wins over flair).
 *
 * The list is supplied by the caller so this component never reaches into
 * the taxonomy directly (DIP); Hero resolves the labels from the roles that
 * actually appear in experience entries.
 */
export interface AnimatedRoleLineProps {
  labels: readonly string[];
  /** ms between transitions. Defaults to 2200. */
  intervalMs?: number;
  className?: string;
}

export function AnimatedRoleLine({
  labels,
  intervalMs = 2800,
  className,
}: AnimatedRoleLineProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || labels.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % labels.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [labels.length, intervalMs, reduceMotion]);

  // Render the static first label when reduced motion or only one option.
  if (reduceMotion || labels.length <= 1) {
    return (
      <span className={cn("inline-block", className)} aria-live="off">
        {labels[0] ?? ""}
      </span>
    );
  }

  return (
    <span
      className={cn("relative inline-block align-baseline", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Invisible sizer keeps the line height stable across labels */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {longest(labels)}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={labels[index]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 whitespace-nowrap"
        >
          {labels[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function longest(labels: readonly string[]): string {
  return labels.reduce((a, b) => (b.length > a.length ? b : a), "");
}
