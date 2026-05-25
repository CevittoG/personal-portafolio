"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * LogoDropCluster — Hero signature visual (plan §6 Zone 1, build step 17).
 *
 * Reads the deduplicated set of taxonomy logos and drops each one from the
 * top of the band under a Framer Motion spring, with staggered start times
 * and a deterministic landing position seeded off the slug. The cluster
 * reads as a single object — overlapping, slightly rotated, slightly
 * jittered — not a 3×N grid of logos.
 *
 * Accessibility:
 *   - The band is a labeled region; the icons are decorative for sighted
 *     users (they carry no information beyond brand recognition).
 *   - A visually hidden list of tag names provides the semantic content for
 *     screen readers.
 *   - `prefers-reduced-motion`: logos fade in at their final positions, no
 *     drop, no bounce.
 *
 * SSR safety:
 *   - Positions are deterministic (seeded RNG keyed off slug) so server and
 *     client agree on the DOM order and approximate placement.
 *   - The animation only mounts after hydration so the spring doesn't fire
 *     on the static server-rendered fallback.
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
  /** Horizontal position in % of band width (0–100). */
  x: number;
  /** Vertical position in % of band height (0–100). */
  y: number;
  /** Rotation in degrees (-12 to +12). */
  rotate: number;
  /** Seeded start delay in seconds. */
  delay: number;
  /** Initial drop distance, in viewport heights (negative = above). */
  fromY: number;
}

const ROT_MAX = 12;
const STAGGER_MS = 35;
const SPRING = { stiffness: 80, damping: 12, mass: 0.8 } as const;

export function LogoDropCluster({ logos, className }: LogoDropClusterProps) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  // Defer animation to post-hydration. Initial paint shows the static
  // fallback (or final positions for reduced motion) — never a half-drop.
  useEffect(() => setMounted(true), []);

  // Deterministic placements seeded off slug → stable across renders.
  const placements = useMemo(
    () => logos.map((l, i) => placementFor(l.slug, i)),
    [logos],
  );

  if (logos.length === 0) return null;

  return (
    <section
      aria-label={t("hero.logos.regionLabel")}
      className={cn(
        "relative mx-auto w-full max-w-4xl",
        "h-[160px] sm:h-[220px] lg:h-[240px]",
        // mask edges so logos fade if they overlap the band boundary
        "[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]",
        className,
      )}
    >
      {/* Visually hidden semantic list for screen readers */}
      <ul className="sr-only">
        {logos.map((l) => (
          <li key={l.slug}>{l.label}</li>
        ))}
      </ul>

      {/* Decorative cluster */}
      <div aria-hidden="true" className="absolute inset-0">
        {logos.map((logo, i) => {
          const p = placements[i];
          const shouldAnimate = mounted && !reduceMotion;

          return (
            <motion.div
              key={logo.slug}
              title={logo.label}
              initial={
                shouldAnimate
                  ? { y: `${p.fromY}vh`, rotate: p.rotate * 0.4, opacity: 0 }
                  : reduceMotion
                    ? { opacity: 0 }
                    : false
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { y: 0, rotate: p.rotate, opacity: 1 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                  : {
                      y: { type: "spring", delay: p.delay, ...SPRING },
                      rotate: {
                        type: "spring",
                        delay: p.delay,
                        stiffness: 60,
                        damping: 10,
                        mass: 0.6,
                      },
                      opacity: { duration: 0.18, delay: p.delay },
                    }
              }
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, scale: 1.08, transition: { duration: 0.18 } }
              }
              className={cn(
                "absolute select-none",
                "h-8 w-8 sm:h-11 sm:w-11",
                "drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]",
                "will-change-transform",
              )}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                // Place each logo by its center so percentages read intuitively
                transform: "translate(-50%, -50%)",
              }}
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
          );
        })}
      </div>
    </section>
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
 * Build a placement for a logo. Position picks a band-wide x (with small
 * margins) and a y that biases toward the middle of the band so logos
 * cluster rather than line up along an edge.
 */
function placementFor(slug: string, index: number): Placement {
  const r = rng(hash32(slug));
  const x = 6 + r() * 88; // 6–94%
  // Bell-ish curve via two samples → biased toward 50%
  const y = ((r() + r()) / 2) * 60 + 20; // 20–80%
  const rotate = (r() * 2 - 1) * ROT_MAX;
  const delay = index * (STAGGER_MS / 1000);
  // Each logo starts a slightly different distance above the band — adds
  // visual interest to the drop without breaking the "they fell together"
  // gestalt.
  const fromY = -110 - r() * 30;
  return { x, y, rotate, delay, fromY };
}
