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
 *
 * Where a wrapper `div` would break the layout (a grid or flex child), put
 * the `reveal` class on the element itself. Keep it to short blocks: the
 * fade runs over the first 35% of the element's own height, so a tall
 * section would stay see-through for too long.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
