"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { defaultSearchStrategy } from "@/lib/search/substring";
import type { SearchStrategy } from "@/lib/search/types";
import { TAG_TYPES, type TagType, type TaxonomyEntry } from "@/lib/taxonomy/types";
import { tagColorVar } from "@/components/tags/tag-colors";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * SearchBar — accessible combobox over the taxonomy.
 *
 * Presentational + interactive: suggestions are passed in as props. The
 * Explorer (Build Order step 10) wires this to `taxonomyRepository.getAll()`
 * and `topTagsByUsage(experienceRepository.getAll())`. Keeping the data
 * source out of the component makes it trivially testable and reusable.
 *
 * Keyboard: ↑/↓ navigate, Enter selects, Esc closes, Tab closes.
 * ARIA: WAI-ARIA 1.2 combobox pattern with listbox popup.
 */
export interface SearchBarProps {
  /** Universe of selectable taxonomy entries. */
  suggestions: readonly TaxonomyEntry[];
  /** Slugs surfaced when the query is empty (typically top-by-usage). */
  topSuggestions?: readonly string[];
  /** Already-active slugs — excluded from the dropdown. */
  excludeSlugs?: readonly string[];
  /** Fired when the user picks a suggestion. */
  onSelect: (slug: string) => void;
  /** Defaults to substring. */
  searchStrategy?: SearchStrategy;
  placeholder?: string;
  className?: string;
}

const MAX_VISIBLE = 24;

export function SearchBar({
  suggestions,
  topSuggestions = [],
  excludeSlugs = [],
  onSelect,
  searchStrategy = defaultSearchStrategy,
  placeholder,
  className,
}: SearchBarProps) {
  const t = useTranslations();
  const resolvedPlaceholder = placeholder ?? t("search.placeholder");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const listboxId = useId();
  const inputId = useId();

  const excludeSet = useMemo(() => new Set(excludeSlugs), [excludeSlugs]);

  /** Visible options — search result OR top-suggestions for empty state. */
  const options = useMemo(() => {
    const q = query.trim();
    if (q.length === 0) {
      // Empty state: show top suggestions, mapped back into TaxonomyEntry.
      const bySlug = new Map<string, TaxonomyEntry>(
        suggestions.map((s): [string, TaxonomyEntry] => [s.slug, s]),
      );
      return topSuggestions
        .map((slug) => bySlug.get(slug))
        .filter((e): e is TaxonomyEntry => Boolean(e))
        .filter((e) => !excludeSet.has(e.slug))
        .slice(0, MAX_VISIBLE);
    }
    return searchStrategy
      .search(q, suggestions)
      .filter((e) => !excludeSet.has(e.slug))
      .slice(0, MAX_VISIBLE);
  }, [query, suggestions, topSuggestions, excludeSet, searchStrategy]);

  /** Group options by taxonomy type, preserving original order within group. */
  const grouped = useMemo(() => {
    const buckets: Record<TagType, TaxonomyEntry[]> = Object.fromEntries(
      TAG_TYPES.map((t) => [t, [] as TaxonomyEntry[]]),
    ) as Record<TagType, TaxonomyEntry[]>;
    for (const entry of options) buckets[entry.type].push(entry);
    return TAG_TYPES.map((type) => ({ type, items: buckets[type] }))
      .filter((g) => g.items.length > 0);
  }, [options]);

  /* ── Close on outside click ─────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* ── Keep activeIndex within bounds when options change ─────────── */
  useEffect(() => {
    if (activeIndex >= options.length) setActiveIndex(options.length - 1);
  }, [options.length, activeIndex]);

  /* ── Handlers ───────────────────────────────────────────────────── */

  function commit(slug: string) {
    onSelect(slug);
    setQuery("");
    setActiveIndex(-1);
    // Keep dropdown open so the user can chain selections.
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && activeIndex < options.length) {
        e.preventDefault();
        commit(options[activeIndex].slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const showDropdown = open && options.length > 0;
  const activeId =
    activeIndex >= 0 && activeIndex < options.length
      ? optionDomId(listboxId, options[activeIndex].slug)
      : undefined;

  const reduceMotion = useReducedMotion();
  const panelMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <label htmlFor={inputId} className="sr-only">
        {t("search.inputLabel")}
      </label>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          value={query}
          placeholder={resolvedPlaceholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full rounded-full bg-surface text-text-primary",
            "h-12 pl-11 pr-4 text-base",
            "border border-border placeholder:text-text-muted",
            "transition-colors duration-150",
            "focus:outline-none focus:border-accent",
            "focus-visible:ring-2 focus-visible:ring-accent",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          )}
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
        <motion.div
          {...panelMotion}
          id={listboxId}
          role="listbox"
          aria-label={t("search.suggestionsLabel")}
          className={cn(
            "absolute z-50 mt-2 w-full max-h-[24rem] overflow-y-auto",
            "rounded-xl border border-border bg-surface-elevated shadow-xl",
            "p-2",
          )}
        >
          {query.trim().length === 0 && (
            <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-muted">
              {t("search.commonStartingPoints")}
            </p>
          )}
          {grouped.map(({ type, items }) => (
            <div key={type} className="px-1 py-1">
              <p
                className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider"
                style={{ color: tagColorVar(type) }}
              >
                {type.replace("_", " ")}
              </p>
              <ul role="presentation" className="flex flex-wrap gap-1">
                {items.map((entry) => {
                  const idx = options.indexOf(entry);
                  const isActive = idx === activeIndex;
                  return (
                    <li key={entry.slug} role="presentation">
                      <button
                        type="button"
                        id={optionDomId(listboxId, entry.slug)}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseDown={(e) => {
                          // mousedown (not click) so it fires before the
                          // outside-click handler that closes the dropdown
                          e.preventDefault();
                          commit(entry.slug);
                        }}
                        className={cn(
                          "cursor-pointer rounded-full border px-2.5 py-1 text-xs",
                          "transition-colors duration-150",
                          isActive
                            ? "border-current"
                            : "border-current/40 hover:border-current",
                        )}
                        style={{
                          color: tagColorVar(entry.type),
                          backgroundColor: isActive
                            ? `color-mix(in srgb, ${tagColorVar(entry.type)} 14%, transparent)`
                            : "transparent",
                        }}
                      >
                        {entry.display_name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && options.length === 0 && (
          <motion.div
            {...panelMotion}
            className={cn(
              "absolute z-50 mt-2 w-full rounded-xl border border-border",
              "bg-surface-elevated px-4 py-3 text-sm text-text-secondary shadow-xl",
            )}
          >
            {query.trim().length === 0
              ? t("search.empty")
              : t("search.noMatch", { query: query.trim() })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function optionDomId(listboxId: string, slug: string): string {
  return `${listboxId}-opt-${slug}`;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
