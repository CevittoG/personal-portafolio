"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Root template — site-wide route fade (plan §15 polish, Layer D).
 *
 * Next.js App Router re-renders this on every route change, so it's the
 * natural hook for a quiet route transition. 180ms fade, no slide, no
 * scale — the brief explicitly forbids loud transitions. Reduced-motion
 * users get the final state without animation.
 *
 * Lives at the app root so every route inherits it; if a specific route
 * needs to opt out, add its own `template.tsx` deeper in the tree.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
