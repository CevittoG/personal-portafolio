import { cn } from "@/lib/utils";

/**
 * PivotInterlude — Act 2 of the Story page (plan §7).
 *
 * Pure authored prose between the two timelines. The visual divider is
 * intentional — a tonal shift, not just a header. Centered narrow column
 * for reading pace.
 */
export interface PivotInterludeProps {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  className?: string;
}

export function PivotInterlude({
  eyebrow,
  title,
  paragraphs,
  className,
}: PivotInterludeProps) {
  return (
    <section
      aria-labelledby="pivot-heading"
      className={cn(
        "relative isolate overflow-hidden rounded-3xl",
        "border border-border bg-surface/30",
        "px-6 py-12 sm:px-12 sm:py-16",
        className,
      )}
    >
      {/* Subtle accent backdrop so the act reads as a distinct moment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(45% 60% at 50% 0%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2
          id="pivot-heading"
          className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary"
        >
          {title}
        </h2>
        <div className="mt-6 space-y-4 text-left sm:text-center">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-base sm:text-lg leading-relaxed text-text-secondary"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
