"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import { DURATION, EASE_OUT_QUINT } from "@/lib/motion/tokens";

/**
 * Pill travel: when the visitor adds a filter by pressing a tag pill (on a
 * card or a starter chip), a copy of that pill flies to the new chip in the
 * active-filter row, so the cause and the effect read as one thing.
 *
 * It works by event delegation on a container that holds both the pills
 * and the filter row, so no pill has to know about it:
 *
 *   1. `onClickCapture` notes the pressed pill (its box and a copy of it)
 *      before the pill's own handler runs.
 *   2. The caller reports the add with `noteAdded(slug)`.
 *   3. Once the chip for that slug is in the DOM, the copy flies to it.
 *
 * `arrival` tells the filter row which chip to hold back until the copy
 * lands. Nothing happens under reduced motion, or when the add came from
 * somewhere else (the search box, the URL).
 */

/** Seconds the copy is in the air; it fades out for a moment after landing. */
const FLIGHT = DURATION.reveal;
const FADE = 0.12;

/** A clickable, not yet selected pill: the only kind that adds a filter. */
const ADDABLE_PILL = "button[data-slug]:is([data-state='inactive'], [data-state='muted'])";

interface Departure {
  slug: string;
  from: DOMRect;
  ghost: HTMLElement;
  /** Set once the caller confirms this press added the tag. */
  claimed: boolean;
}

export interface PillArrival {
  slug: string;
  /** Seconds the real chip should wait before it appears. */
  delay: number;
}

export function usePillTravel(
  containerRef: RefObject<HTMLElement | null>,
  activeSlugs: readonly string[],
) {
  const departure = useRef<Departure | null>(null);
  const [arrival, setArrival] = useState<PillArrival | null>(null);

  const onClickCapture = (event: MouseEvent<HTMLElement>) => {
    departure.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pill = (event.target as Element).closest<HTMLElement>(ADDABLE_PILL);
    const slug = pill?.dataset.slug;
    if (!pill || !slug) return;
    departure.current = {
      slug,
      from: pill.getBoundingClientRect(),
      ghost: pill.cloneNode(true) as HTMLElement,
      claimed: false,
    };
  };

  const noteAdded = (slug: string) => {
    const leaving = departure.current;
    if (leaving?.slug === slug) {
      leaving.claimed = true;
      setArrival({ slug, delay: FLIGHT * 0.75 });
      // If the add turns out to change nothing, don't keep the press around.
      window.setTimeout(() => {
        if (departure.current === leaving) departure.current = null;
      }, 0);
    } else {
      departure.current = null;
      setArrival(null);
    }
  };

  useLayoutEffect(() => {
    const leaving = departure.current;
    if (!leaving?.claimed) return;
    departure.current = null;
    const chip = containerRef.current?.querySelector<HTMLElement>(
      `[data-filter-chip="${CSS.escape(leaving.slug)}"]`,
    );
    if (!chip) return;
    // On phones the row is one scrolling line: bring the new chip into it.
    const scroller = chip.parentElement;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
    fly(leaving, chip.getBoundingClientRect());
  }, [activeSlugs, containerRef]);

  return { onClickCapture, noteAdded, arrival };
}

function fly({ from, ghost }: Departure, to: DOMRect) {
  const onScreen =
    to.bottom > 0 && to.top < window.innerHeight && to.right > 0 && to.left < window.innerWidth;
  if (!onScreen) return;

  // The copy is decoration: nothing may find it, focus it or read it out.
  for (const name of ["data-slug", "data-state", "data-tag-type", "aria-pressed"]) {
    ghost.removeAttribute(name);
  }
  ghost.setAttribute("data-pill-ghost", "");
  ghost.setAttribute("aria-hidden", "true");
  ghost.inert = true;
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: "0",
    zIndex: "50",
    pointerEvents: "none",
  });
  document.body.append(ghost);

  const landed = `translate(${to.left - from.left}px, ${to.top - from.top}px)`;
  const total = FLIGHT + FADE;
  const flight = ghost.animate(
    [
      { transform: "none", opacity: 1, easing: `cubic-bezier(${EASE_OUT_QUINT.join(",")})` },
      { transform: landed, opacity: 1, offset: FLIGHT / total },
      { transform: landed, opacity: 0 },
    ],
    { duration: total * 1000 },
  );
  const remove = () => ghost.remove();
  flight.finished.then(remove, remove);
}
