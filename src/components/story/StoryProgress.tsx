"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * StoryProgress — a thin bar under the navbar on /story: which act the
 * reader is in, the year, and a marker on the career axis (the same
 * 2016 → now axis as the swimlane that opens the page).
 *
 * It shows only while the three acts are being read. The page tells it
 * everything through data attributes, so it imports no content:
 *
 *   [data-story-acts]   the wrapper around the acts (when to show)
 *   [data-story-step]   a timeline row or the Act 2 interlude, in document
 *                       order, with `data-act` and, for rows, `data-year`
 *                       and `data-left` (percent on the axis, from the
 *                       server)
 *
 * The current step is the last one whose top has passed the reading line.
 * A step with no position of its own (Act 2) keeps the marker where the
 * previous one left it. Cards are not evenly spaced in time, which is why
 * this is measured per step rather than tied to scroll progress.
 *
 * Decorative: it repeats what the page already says, so it is hidden from
 * assistive technology.
 */
export interface StoryProgressProps {
  /** The ends of the axis, as labels. */
  startYear: number;
  endYear: number;
}

/** A step is current once its top is above this fraction of the viewport. */
const READING_LINE = 0.35;

interface Progress {
  visible: boolean;
  act: string;
  year: number | null;
  left: number;
}

const HIDDEN: Progress = { visible: false, act: "", year: null, left: 0 };

export function StoryProgress({ startYear, endYear }: StoryProgressProps) {
  const [progress, setProgress] = useState<Progress>(HIDDEN);

  useEffect(() => {
    const acts = document.querySelector<HTMLElement>("[data-story-acts]");
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-story-step]"));
    if (!acts || steps.length === 0) return;

    const read = () => {
      const line = window.innerHeight * READING_LINE;
      const box = acts.getBoundingClientRect();
      const next: Progress = { ...HIDDEN, visible: box.top <= line && box.bottom > line };
      // Walk the steps in order up to the reading line. The first one
      // counts from the start, so the bar is never empty.
      for (const [i, step] of steps.entries()) {
        if (i > 0 && step.getBoundingClientRect().top > line) break;
        next.act = step.dataset.act ?? next.act;
        if (step.dataset.left !== undefined) {
          next.left = Number(step.dataset.left);
          next.year = Number(step.dataset.year);
        }
      }
      setProgress((prev) =>
        prev.visible === next.visible &&
        prev.act === next.act &&
        prev.year === next.year &&
        prev.left === next.left
          ? prev
          : next,
      );
    };

    // The observer only says "something crossed the reading line"; `read`
    // then works out the state from scratch, so it can never drift.
    const top = Math.round(READING_LINE * 100);
    const observer = new IntersectionObserver(read, {
      rootMargin: `-${top}% 0px -${100 - top}% 0px`,
    });
    observer.observe(acts);
    for (const step of steps) observer.observe(step);
    window.addEventListener("resize", read);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);

  const move = "transition-transform duration-(--duration-reveal) ease-(--ease-out-quint)";

  return (
    <div
      aria-hidden="true"
      data-story-progress=""
      data-visible={progress.visible}
      data-act={progress.act}
      data-left={progress.left}
      className={cn(
        "fixed inset-x-0 top-16 z-30 border-b border-border bg-bg",
        "transition-opacity duration-200",
        progress.visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="mx-auto flex h-9 max-w-5xl items-center gap-3 px-6 text-xs">
        <span className="min-w-24 shrink-0 tabular-nums text-text-secondary">
          <span className="font-medium text-text-primary">{progress.act}</span>
          {progress.year !== null && ` · ${progress.year}`}
        </span>
        <span className="tabular-nums text-text-muted">{startYear}</span>
        <span className="relative h-px flex-1 bg-border">
          {/* Time passed so far, then the "you are here" marker. */}
          <span
            className={cn("absolute inset-0 origin-left bg-text-muted", move)}
            style={{ transform: `scaleX(${progress.left / 100})` }}
          />
          <span
            className={cn("absolute inset-0", move)}
            style={{ transform: `translateX(${progress.left}%)` }}
          >
            <span className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </span>
        </span>
        <span className="tabular-nums text-text-muted">{endYear}</span>
      </div>
    </div>
  );
}
