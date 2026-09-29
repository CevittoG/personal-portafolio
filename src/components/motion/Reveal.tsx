import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal — scroll-enter fade, in CSS (plan §15 polish, Layer A).
 *
 * A scroll-driven animation (`animation-timeline: view()`, see `.reveal`
 * in globals.css) fades and nudges content up as it enters the viewport.
 * No JavaScript and no hydration concerns: it renders the same markup on
 * the server and the client. Browsers without scroll-driven animations,
 * and visitors with reduced motion, simply see the content.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}

/**
 * Longest a staggered item may wait, in seconds. Past ~150ms a stagger
 * stops reading as rhythm and starts reading as the page being slow.
 */
export const MAX_STAGGER_DELAY = 0.15;
