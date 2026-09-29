"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads Motion's animation features on demand, in their own chunk, instead
 * of bundling the full library with every page. Components use the light
 * `m.*` elements; `strict` makes a stray `motion.*` import throw in
 * development, so the full bundle can't creep back in.
 *
 * `domMax` because the drawer drags and the grid animates layout.
 */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
