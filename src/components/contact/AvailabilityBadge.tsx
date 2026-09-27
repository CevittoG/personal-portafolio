import { cn } from "@/lib/utils";

/**
 * AvailabilityBadge — "Open to opportunities" pill (plan §9).
 *
 * Hook-free so it renders in both the server Contact page and the client
 * Hero. Green (scale tag hue) when open, muted when not looking.
 */
export interface AvailabilityBadgeProps {
  open: boolean;
  label: string;
  className?: string;
}

export function AvailabilityBadge({ open, label, className }: AvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        "text-xs font-medium",
        open
          ? "border-[color:color-mix(in_srgb,var(--color-tag-scale)_50%,transparent)] text-[color:var(--color-tag-scale)] bg-[color:color-mix(in_srgb,var(--color-tag-scale)_12%,transparent)]"
          : "border-border text-text-muted bg-surface",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative h-1.5 w-1.5 rounded-full",
          open ? "bg-[color:var(--color-tag-scale)]" : "bg-text-muted",
        )}
      >
        {open && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-[color:var(--color-tag-scale)] opacity-60",
              "motion-safe:animate-ping",
            )}
          />
        )}
      </span>
      {label}
    </span>
  );
}
