"use client";

import { TagPill } from "@/components/tags/TagPill";
import type { TaxonomyEntry } from "@/lib/taxonomy/types";
import { cn } from "@/lib/utils";

/**
 * RoleShortcuts — Explorer Zone 2 secondary input (plan §6).
 *
 * A row of pre-built role pills that act as entry-point shortcuts for
 * common recruiter searches. Clicking one delegates to `onSelect` — same
 * mechanism as picking from the SearchBar dropdown, not a parallel system.
 *
 * Presentational: caller supplies the role taxonomy entries to show and the
 * currently active slugs (to grey out picks already in the filter).
 */
export interface RoleShortcutsProps {
  /** Role taxonomy entries to render as quick-filter pills. */
  roles: readonly TaxonomyEntry[];
  /** Already-selected slugs — pills for these render in `active` state. */
  activeSlugs: readonly string[];
  onSelect: (slug: string) => void;
  /** Label shown before the pills row. Defaults to "Common searches". */
  label?: string;
  className?: string;
}

export function RoleShortcuts({
  roles,
  activeSlugs,
  onSelect,
  label = "Common searches",
  className,
}: RoleShortcutsProps) {
  if (roles.length === 0) return null;
  const active = new Set(activeSlugs);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs uppercase tracking-wider text-text-muted mr-1">
        {label}
      </span>
      {roles.map((role) => {
        const isActive = active.has(role.slug);
        return (
          <TagPill
            key={role.slug}
            slug={role.slug}
            label={role.display_name}
            type={role.type}
            state={isActive ? "active" : "inactive"}
            onClick={isActive ? undefined : () => onSelect(role.slug)}
          />
        );
      })}
    </div>
  );
}
