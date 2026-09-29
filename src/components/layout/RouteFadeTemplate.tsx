import type { ReactNode } from "react";

/**
 * Route fade template (plan §15 polish, Layer D), re-exported as
 * `template.tsx` by both root-layout groups, `(en)` and `(es)`.
 *
 * Next.js App Router re-mounts this on every route change, so the CSS
 * animation on `.route-fade` (globals.css) replays per navigation. 180ms
 * fade, no slide, no scale — the brief explicitly forbids loud transitions.
 *
 * Pure CSS on purpose: the static HTML renders fully visible, so content
 * paints before any JS loads (LCP) and crawlers and link-preview bots see
 * it. The keyframe only runs under `prefers-reduced-motion: no-preference`.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
