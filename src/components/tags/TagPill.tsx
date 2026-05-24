import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { TagType } from "@/lib/taxonomy/types";
import { tagColorVar } from "./tag-colors";

/**
 * Tag Pill — the most-used primitive in the app (plan §10).
 *
 * One prop interface covers all four states (LSP): every state is
 * substitutable in every consumer. The component never holds filter state
 * itself — it only renders. `onRemove` is only consulted when state is
 * "removable".
 */
export type TagPillState = "active" | "inactive" | "muted" | "removable";

export interface TagPillProps {
  slug: string;
  /** Display label. Callers should look this up from the taxonomy repository. */
  label: string;
  /** Taxonomy type — drives the pill's color via a CSS var lookup. */
  type: TagType;
  state?: TagPillState;
  /** Optional secondary label rendered after a thin separator (e.g. taxonomy
   *  type name on a filter chip — "Python · Language"). Visually quieter than
   *  the primary label. */
  sublabel?: string;
  /** Click handler (e.g. add to filter). Ignored when state is "removable". */
  onClick?: () => void;
  /** Required when state is "removable". */
  onRemove?: () => void;
  className?: string;
}

/* ── State-specific class fragments ──────────────────────────────────── */

const BASE_CLASSES = cn(
  "inline-flex items-center gap-1.5 rounded-full border",
  "px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap",
  "transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-bg",
);

const STATE_CLASSES: Record<TagPillState, string> = {
  // Filled, full-color — currently selected/matching
  active: "border-current",
  // Default — color-tinted outline, no fill
  inactive: "border-current/50 hover:border-current",
  // Greyed out — visible but de-emphasized (doesn't match filter)
  muted: "border-border text-text-muted bg-transparent",
  // Active + interactive remove control
  removable: "border-current",
};

/**
 * Per-state inline style. We use CSS color-mix on `currentColor` so each
 * tag-type color produces a consistent tint without per-color tokens.
 */
function styleFor(type: TagType, state: TagPillState): CSSProperties {
  const color = tagColorVar(type);
  if (state === "muted") {
    return {}; // tailwind handles muted entirely
  }
  const fill =
    state === "active" || state === "removable"
      ? `color-mix(in srgb, ${color} 14%, transparent)`
      : "transparent";
  return {
    color,
    backgroundColor: fill,
  };
}

/* ── Component ───────────────────────────────────────────────────────── */

export function TagPill({
  slug,
  label,
  type,
  state = "inactive",
  sublabel,
  onClick,
  onRemove,
  className,
}: TagPillProps) {
  const interactive = state !== "muted" && (onClick || state === "removable");
  const Component = interactive && state !== "removable" ? "button" : "span";

  return (
    <Component
      type={Component === "button" ? "button" : undefined}
      data-slug={slug}
      data-state={state}
      data-tag-type={type}
      onClick={state === "removable" ? undefined : onClick}
      aria-pressed={state === "active" ? true : undefined}
      className={cn(
        BASE_CLASSES,
        STATE_CLASSES[state],
        interactive && state !== "removable" && "cursor-pointer",
        className,
      )}
      style={styleFor(type, state)}
    >
      <span>{label}</span>
      {sublabel && (
        <span
          aria-hidden="true"
          className="text-[0.65rem] uppercase tracking-wider opacity-60"
        >
          · {sublabel}
        </span>
      )}
      {state === "removable" && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={cn(
            "-mr-1 grid h-4 w-4 place-items-center rounded-full",
            "cursor-pointer hover:bg-current/15",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
            "transition-colors duration-150",
          )}
        >
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="h-2.5 w-2.5"
          >
            <path
              d="M2 2l8 8M10 2l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      )}
    </Component>
  );
}
