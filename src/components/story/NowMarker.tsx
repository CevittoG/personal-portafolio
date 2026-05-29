import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * NowMarker — closing beat of the Story page (plan §7 Act 3).
 *
 * The timeline ends here. Says "this is the current state, this is what's
 * next," and bridges to the Contact page. Server-renderable.
 */
export interface NowMarkerProps {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function NowMarker({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  className,
}: NowMarkerProps) {
  return (
    <section
      aria-labelledby="now-heading"
      className={cn(
        "relative rounded-3xl border border-accent/40 bg-surface/60",
        "px-6 py-10 sm:px-10 sm:py-12 text-center",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <h2
        id="now-heading"
        className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary"
      >
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
        {body}
      </p>
      <Link
        href={ctaHref}
        className={cn(
          "mt-6 inline-flex items-center justify-center gap-2 rounded-full",
          "bg-accent px-6 py-3 text-sm font-medium text-on-accent",
          "hover:bg-accent-hover transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent focus-visible:ring-offset-2",
          "focus-visible:ring-offset-bg",
        )}
      >
        {ctaLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
