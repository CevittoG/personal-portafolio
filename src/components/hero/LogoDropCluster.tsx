"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * LogoDropCluster — Hero signature visual (plan §6 Zone 1).
 *
 * Motion model: each logo pops into existence (opacity + scale, staggered),
 * then floats continuously on an infinite mirror loop. A single cursor-tracker
 * at the cluster level lets every logo react to the pointer — when the cursor
 * gets within ~150px of a logo center, the logo is repelled outward along the
 * cursor-to-center vector, smoothed by spring physics.
 *
 * Accessibility:
 *   - The band is a labeled region; the icons are decorative for sighted
 *     users (they carry no information beyond brand recognition).
 *   - A visually hidden list of tag names provides the semantic content for
 *     screen readers.
 *   - `prefers-reduced-motion`: no entrance, no float, no cursor listener —
 *     logos render statically at their seeded positions.
 *
 * SSR safety:
 *   - Positions and float timing are deterministic (seeded RNG keyed off
 *     slug) so server and client agree on the DOM order and placement.
 *   - The animation only mounts after hydration so the entrance doesn't fire
 *     against the static fallback.
 */
export interface LogoItem {
  /** Taxonomy slug — drives the seed and the tooltip. */
  slug: string;
  /** Display name shown in the tooltip / SR list. */
  label: string;
  /** SVG URL (Simple Icons CDN or local path). */
  image: string;
}

export interface LogoDropClusterProps {
  logos: readonly LogoItem[];
  className?: string;
}

interface Placement {
  /** Horizontal position in % of hero width (0–100). */
  x: number;
  /** Vertical position in % of hero height (0–100). */
  y: number;
  /** Base rotation in degrees (-6 to +6) — gives the cluster a casually-thrown feel. */
  rotateBase: number;
  /** Continuous float loop duration, seconds (5–10). */
  floatDuration: number;
  /** Per-logo phase offset, seconds (0–4). */
  floatPhase: number;
  /**
   * Final opacity (0.30–0.95). Logos near the hero center fade so the
   * headline reads cleanly through them; logos near the corners sit at
   * near-full opacity so the cluster feels populated at the edges. The
   * cluster reads as a halo of icons around the text rather than a curtain.
   */
  opacity: number;
}

interface CursorRef {
  x: number;
  y: number;
}

const ENTRANCE_STAGGER_S = 0.07;
const ENTRANCE_DURATION_S = 0.55;
const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

const REPEL_RADIUS_PX = 150;
const REPEL_FORCE_PX = 50;
const REPEL_SPRING = { stiffness: 300, damping: 20 } as const;

const FLOAT_Y = 8;
const FLOAT_X = 6;
const FLOAT_ROT = 5;
const ROT_BASE_MAX = 6;

export function LogoDropCluster({ logos, className }: LogoDropClusterProps) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Deterministic placements seeded off slug → stable across renders.
  // Computed as a batch so each logo can be nudged off its neighbors
  // (min-distance rejection sampling) while staying SSR-deterministic.
  const placements = useMemo(() => layoutPlacements(logos), [logos]);

  // Shared cursor coordinates — one window listener for the whole cluster.
  // Sentinel (-99999) means "no pointer seen yet"; FloatingLogo treats that
  // as "out of range" so logos stay at rest until the user moves their cursor.
  const cursor = useRef<CursorRef>({ x: -99999, y: -99999 });
  useEffect(() => {
    if (reduceMotion || !mounted) return;
    const onMove = (e: MouseEvent) => {
      cursor.current.x = e.clientX;
      cursor.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, mounted]);

  if (logos.length === 0) return null;

  return (
    // Fills the parent (Hero) section behind the text content. Pointer
    // events disabled so the cluster never intercepts clicks on the CTAs
    // sitting on top — cursor repel works via the window mousemove listener,
    // not via hover hit-testing.
    <section
      aria-label={t("hero.logos.regionLabel")}
      className={cn("absolute inset-0 pointer-events-none", className)}
    >
      {/* Visually hidden semantic list for screen readers */}
      <ul className="sr-only">
        {logos.map((l) => (
          <li key={l.slug}>{l.label}</li>
        ))}
      </ul>

      {/* Decorative cluster */}
      <div aria-hidden="true" className="absolute inset-0">
        {logos.map((logo, i) => (
          <FloatingLogo
            key={logo.slug}
            logo={logo}
            placement={placements[i]}
            index={i}
            cursor={cursor}
            reduce={!!reduceMotion}
            mounted={mounted}
          />
        ))}
      </div>
    </section>
  );
}

/* ── FloatingLogo (private) ──────────────────────────────────────────── */

interface FloatingLogoProps {
  logo: LogoItem;
  placement: Placement;
  index: number;
  cursor: RefObject<CursorRef>;
  reduce: boolean;
  mounted: boolean;
}

/**
 * One logo. Two motion layers:
 *   - Outer: entrance (opacity + scale) + repel (style.x/y from springs).
 *   - Inner: continuous float (x/y/rotate keyframes on an infinite mirror).
 *
 * The repel reads the shared cursor ref each frame, computes the distance
 * to the logo's center, and sets the motion values toward a repulsion vector
 * (or back to zero). The spring smooths the target into a fluid motion.
 */
function FloatingLogo({
  logo,
  placement,
  index,
  cursor,
  reduce,
  mounted,
}: FloatingLogoProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Repel target values; the spring softens the transition between them.
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const springX = useSpring(targetX, REPEL_SPRING);
  const springY = useSpring(targetY, REPEL_SPRING);

  // rAF loop — reads cursor.current, updates target motion values. Framer
  // Motion ties useAnimationFrame to its frame loop, so it pauses when the
  // tab is hidden and doesn't double-fire alongside the layout effects.
  useAnimationFrame(() => {
    if (reduce || !mounted) return;
    const node = ref.current;
    if (!node) return;

    const c = cursor.current;
    if (!c) return;

    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = c.x - cx;
    const dy = c.y - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < REPEL_RADIUS_PX) {
      const angle = Math.atan2(dy, dx);
      const force = (1 - dist / REPEL_RADIUS_PX) * REPEL_FORCE_PX;
      targetX.set(-Math.cos(angle) * force);
      targetY.set(-Math.sin(angle) * force);
    } else {
      // Only assign when we're not already at zero — avoids dirtying the
      // spring every frame when the cursor is far away.
      if (targetX.get() !== 0) targetX.set(0);
      if (targetY.get() !== 0) targetY.set(0);
    }
  });

  // Outer animation: entrance only. Repel rides on style.x / style.y.
  // The animate `opacity` target is the per-logo halo opacity, not 1 —
  // logos closer to the hero center settle at a lower final opacity so
  // they don't fight the headline.
  const outerInitial = reduce
    ? false
    : mounted
      ? { opacity: 0, scale: 0.5 }
      : false;
  const outerAnimate = { opacity: placement.opacity, scale: 1 };
  const outerTransition = reduce
    ? { duration: 0 }
    : {
        delay: index * ENTRANCE_STAGGER_S,
        duration: ENTRANCE_DURATION_S,
        ease: ENTRANCE_EASE,
      };

  // Inner animation: continuous float (skipped under reduced motion).
  const base = placement.rotateBase;
  const innerAnimate = reduce
    ? undefined
    : {
        y: [0, -FLOAT_Y, 0, FLOAT_Y, 0],
        x: [0, FLOAT_X, 0, -FLOAT_X, 0],
        rotate: [base, base + FLOAT_ROT, base, base - FLOAT_ROT, base],
      };
  const innerTransition = reduce
    ? undefined
    : {
        duration: placement.floatDuration,
        delay: placement.floatPhase,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut" as const,
      };

  return (
    // Static wrapper owns absolute positioning + center offset.
    // Keeping placement out of the motion.div leaves Framer Motion's
    // transform composition (x/y springs) uncontested.
    <div
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        "h-8 w-8 sm:h-11 sm:w-11",
      )}
      style={{ left: `${placement.x}%`, top: `${placement.y}%` }}
    >
      <motion.div
        ref={ref}
        title={logo.label}
        initial={outerInitial}
        animate={outerAnimate}
        transition={outerTransition}
        style={reduce ? undefined : { x: springX, y: springY }}
        className="h-full w-full select-none will-change-transform"
      >
        <motion.div
          animate={innerAnimate}
          transition={innerTransition}
          // Static rotation under reduced motion so the cluster keeps its
          // casually-thrown feel without animating.
          style={reduce ? { rotate: base } : undefined}
          className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.image}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
            className="h-full w-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Deterministic placement ─────────────────────────────────────────── */

/**
 * Hash a string to a 32-bit unsigned int (cyrb53-lite). Stable across
 * Node and browsers — needed so SSR and CSR agree.
 */
function hash32(str: string): number {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h2 = Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}

/** mulberry32 PRNG seeded by the int hash — deterministic, fast. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Minimum spacing between logo centers, in the x/y percent space. Small but
 * enough that the ~44px icons never visually overlap on a typical hero width.
 */
const MIN_DIST_PCT = 9;
/** Candidate positions tried per logo before accepting the best-spaced one. */
const PLACEMENT_TRIES = 24;

/**
 * Lay out the whole cluster. Logos orbit the central text column — never
 * inside it — so the headline, role line, statement, and CTAs stay clean.
 * Placed sequentially: each logo samples candidate positions from its seeded
 * RNG and takes the first that clears `MIN_DIST_PCT` from every already-placed
 * logo (falling back to the best-spaced candidate). Deterministic for fixed
 * input, so SSR and CSR agree.
 *
 *   ┌─────────────────────────────┐
 *   │           TOP STRIP         │   y: 1–12%, x: 3–97%
 *   ├──────┬───────────────┬──────┤
 *   │ LEFT │   forbidden   │ RIGHT│   y: 12–78%, x in side margins
 *   │      │   (text)      │      │
 *   ├──────┴───────────────┴──────┤
 *   │         BOTTOM STRIP        │   y: 78–97%, x: 3–97%
 *   └─────────────────────────────┘
 */
function layoutPlacements(logos: readonly LogoItem[]): Placement[] {
  const placed: { x: number; y: number }[] = [];

  return logos.map((logo) => {
    const r = rng(hash32(logo.slug));

    let best = sampleZone(r);
    let bestDist = minDistance(best, placed);
    for (let i = 1; i < PLACEMENT_TRIES && bestDist < MIN_DIST_PCT; i++) {
      const candidate = sampleZone(r);
      const d = minDistance(candidate, placed);
      if (d > bestDist) {
        best = candidate;
        bestDist = d;
      }
    }
    placed.push(best);

    const rotateBase = (r() * 2 - 1) * ROT_BASE_MAX;
    const floatDuration = 5 + r() * 5; // 5–10 s
    const floatPhase = r() * 4; // 0–4 s

    // Mild distance-from-center falloff for visual variation only —
    // exclusion zones already guarantee logos aren't behind text, so this
    // is atmosphere, not legibility insurance.
    const distNorm = Math.min(1, Math.hypot(best.x - 50, best.y - 50) / 70.7);
    const smooth = distNorm * distNorm * (3 - 2 * distNorm);
    const opacity = 0.55 + smooth * 0.4; // 0.55–0.95

    return { x: best.x, y: best.y, rotateBase, floatDuration, floatPhase, opacity };
  });
}

/** Draw one candidate position from the four placement zones. Always consumes
 *  exactly three RNG draws so the caller's stream stays deterministic. */
function sampleZone(r: () => number): { x: number; y: number } {
  const zone = r();
  const a = r();
  const b = r();
  if (zone < 0.28) {
    // Top strip — above the greeting eyebrow.
    return { x: 3 + a * 94, y: 1 + b * 11 }; // y 1–12%
  } else if (zone < 0.6) {
    // Bottom strip — below the CTAs.
    return { x: 3 + a * 94, y: 79 + b * 18 }; // y 79–97%
  } else if (zone < 0.8) {
    // Left margin — beside the text column.
    return { x: 1 + a * 16, y: 14 + b * 62 }; // x 1–17%
  }
  // Right margin — beside the text column.
  return { x: 83 + a * 16, y: 14 + b * 62 }; // x 83–99%
}

/** Smallest distance from `p` to any already-placed center (∞ if none). */
function minDistance(
  p: { x: number; y: number },
  placed: { x: number; y: number }[],
): number {
  let min = Infinity;
  for (const q of placed) {
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < min) min = d;
  }
  return min;
}
