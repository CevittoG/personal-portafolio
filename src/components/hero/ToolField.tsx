"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { tagColorVar } from "@/components/tags/tag-colors";
import { track } from "@/lib/analytics/umami";
import type { FieldBreakpoint } from "@/lib/explorer/scatter";
import type { FieldTool, ToolFieldData } from "@/lib/explorer/tool-field";
import { useFilterTags } from "@/lib/filters/use-filter-tags";
import { EASE_OUT_QUINT } from "@/lib/motion/tokens";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { WIDE_FIELD_QUERY, showToolIcons } from "./tool-icons-script";

/**
 * ToolField — the tools scattered around the hero. Each one is a real tag
 * and a toggle: pressing it filters the Explorer further down the page,
 * through the same store (`useFilterTags`) the Explorer reads.
 *
 * What moves, and why:
 *   - On arrival one gust crosses the field (CSS, `.tool-icon` in
 *     globals.css, so it never waits for this component to load).
 *   - Pressing a tool sends a gust outwards from it.
 *   - Tools near the pointer move away from it.
 * Otherwise the field is still. Touch and reduced motion get none of it.
 *
 * Every position comes from the server (`scatter`); this component only
 * turns numbers into CSS variables. Names show on hover and focus and stay
 * up while a tool is selected. A tool that would leave no role is switched
 * off rather than left as a dead end. Thirty-six toggles would be thirty-
 * six tab stops before the page's content, so the field is one tab stop
 * and the arrow keys move within it.
 *
 * The root spans the hero's whole grid on wide screens so its two fields
 * can sit in the gutters; it lets the pointer through to the copy between
 * them.
 */
export interface ToolFieldProps extends ToolFieldData {
  /** Where "See them" goes: the Explorer's filter section. */
  resultsId: string;
  className?: string;
}

const BREAKPOINTS: FieldBreakpoint[] = ["sm", "md", "xl"];
/** The tool's reach for the pointer, and how far it gets pushed, in px. */
const REACH = 130;
const PUSH = 10;
/** A click's gust: px per ms it travels, and how far a tool is thrown. */
const GUST_SPEED = 1.5;
const GUST_THROW = 14;
const GUST_TURN = 6;

function toolStyle(tool: FieldTool): CSSProperties {
  const vars: Record<string, string | number> = {
    "--side": tool.side,
    "--size": `${tool.size}px`,
    "--rest": `${tool.rest}deg`,
    "--jx": tool.jx,
    "--jy": tool.jy,
    "--k": tool.k,
    "--uy": Number(((tool.k - 1) * 0.6).toFixed(2)),
    "--tag": tagColorVar(tool.type),
  };
  for (const breakpoint of BREAKPOINTS) {
    const cell = tool.cells[breakpoint];
    if (!cell) continue;
    vars[`--c-${breakpoint}`] = cell.col;
    vars[`--r-${breakpoint}`] = cell.row;
    vars[`--tip-${breakpoint}`] = cell.tip;
  }
  return vars as CSSProperties;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shownTools = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLButtonElement>("button[data-tool]")).filter(
    (button) => button.offsetParent !== null,
  );

/** A gust from a pressed tool: the others are thrown outwards and return. */
function gustFrom(root: HTMLElement, origin: HTMLElement) {
  if (reducedMotion()) return;
  const from = origin.getBoundingClientRect();
  const ox = from.left + from.width / 2;
  const oy = from.top + from.height / 2;
  const easing = `cubic-bezier(${EASE_OUT_QUINT.join(",")})`;
  for (const tool of shownTools(root)) {
    if (tool === origin) continue;
    const box = tool.getBoundingClientRect();
    const dx = box.left + box.width / 2 - ox;
    const dy = box.top + box.height / 2 - oy;
    const distance = Math.hypot(dx, dy) || 1;
    const delay = distance / GUST_SPEED;
    const strength = Number(tool.style.getPropertyValue("--k") || 1) * Math.max(0.3, 1 - delay / 900);
    const thrown =
      `translate(${((dx / distance) * GUST_THROW * strength).toFixed(2)}px, ${((dy / distance) * GUST_THROW * strength).toFixed(2)}px) ` +
      `rotate(${((dx >= 0 ? 1 : -1) * GUST_TURN * strength).toFixed(2)}deg)`;
    const icon = tool.querySelector(".tool-icon");
    if (!icon) continue;
    icon.getAnimations().forEach((animation) => animation.cancel());
    icon.animate(
      [
        { transform: "none", easing },
        { transform: thrown, offset: 0.25, easing },
        { transform: "none" },
      ],
      { duration: 800, delay, fill: "backwards" },
    );
  }
}

export function ToolField({ tools, roles, spriteHref, resultsId, className }: ToolFieldProps) {
  const t = useTranslations();
  const filter = useFilterTags();
  const active = filter.slugs;
  const rootRef = useRef<HTMLDivElement>(null);
  /** The one tool that is in the tab order (roving tabindex). */
  const [tabStop, setTabStop] = useState(0);

  const roleTags = useMemo(() => roles.map((role) => new Set(role.tags)), [roles]);
  const countFor = (slugs: readonly string[]) =>
    roleTags.reduce((n, tags) => n + (slugs.every((slug) => tags.has(slug)) ? 1 : 0), 0);
  const matching = countFor(active);

  // A narrower layout hides the later tools; never leave the tab stop on one.
  useEffect(() => {
    const queries = ["(min-width: 40rem)", "(min-width: 80rem)"].map((q) => window.matchMedia(q));
    const reset = () => setTabStop(0);
    queries.forEach((query) => query.addEventListener("change", reset));
    return () => queries.forEach((query) => query.removeEventListener("change", reset));
  }, []);

  // Fetch the icons: at once where the field is on the first screen (or
  // the page has already loaded), otherwise once the page has.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const show = () => showToolIcons(root);
    if (window.matchMedia(WIDE_FIELD_QUERY).matches || document.readyState === "complete") {
      show();
      return;
    }
    window.addEventListener("load", show, { once: true });
    return () => window.removeEventListener("load", show);
  }, []);

  // Tools near the pointer move away from it. Written straight to CSS
  // variables: nothing here needs React to re-render.
  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest("section");
    if (!root || !hero) return;
    let centers: { icon: SVGElement; x: number; y: number }[] | null = null;
    let frame = 0;
    const measure = () =>
      shownTools(root).flatMap((tool) => {
        const icon = tool.querySelector<SVGElement>(".tool-icon");
        const box = tool.getBoundingClientRect();
        return icon
          ? [{ icon, x: box.left + box.width / 2 + window.scrollX, y: box.top + box.height / 2 + window.scrollY }]
          : [];
      });
    const settle = () => {
      cancelAnimationFrame(frame);
      for (const icon of root.querySelectorAll<SVGElement>(".tool-icon")) {
        icon.style.removeProperty("--lx");
        icon.style.removeProperty("--ly");
      }
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        centers ??= measure();
        for (const center of centers) {
          const dx = center.x - event.pageX;
          const dy = center.y - event.pageY;
          const distance = Math.hypot(dx, dy) || 1;
          // Not the tool under the pointer: a target that runs away is hard to press.
          const push = distance < REACH && distance > 22 ? (1 - distance / REACH) * PUSH : 0;
          center.icon.style.setProperty("--lx", `${((dx / distance) * push).toFixed(2)}px`);
          center.icon.style.setProperty("--ly", `${((dy / distance) * push).toFixed(2)}px`);
        }
      });
    };
    const forget = () => {
      centers = null;
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", settle);
    window.addEventListener("resize", forget);
    return () => {
      settle();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", settle);
      window.removeEventListener("resize", forget);
    };
  }, []);

  const press = (tool: FieldTool, button: HTMLButtonElement) => {
    if (button.getAttribute("aria-disabled") === "true") return;
    if (active.includes(tool.slug)) {
      track("filter_removed", { slug: tool.slug, type: tool.type });
      filter.remove(tool.slug);
    } else {
      track("filter_added", { slug: tool.slug, type: tool.type, source: "field" });
      filter.add(tool.slug);
    }
    if (rootRef.current) gustFrom(rootRef.current, button);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step === undefined && event.key !== "Home" && event.key !== "End") return;
    const root = rootRef.current;
    if (!root) return;
    const shown = shownTools(root);
    const current = shown.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? shown.length - 1
          : (current + (step ?? 0) + shown.length) % shown.length;
    shown[next].focus();
  };

  const field = (side: 0 | 1) => (
    <div
      className={cn(
        "tool-field h-[116px] xl:pointer-events-auto xl:row-span-2 xl:row-start-1 xl:h-auto",
        side === 0 ? "xl:col-start-1" : "xl:col-start-3",
      )}
    >
      {tools.map((tool, i) => {
        if (tool.side !== side) return null;
        const pressed = active.includes(tool.slug);
        // Adding this tool would leave no role: switched off, not a trap.
        const off = !pressed && countFor([...active, tool.slug]) === 0;
        return (
          <button
            key={tool.slug}
            type="button"
            data-tool={tool.slug}
            // The name pill reads `aria-label`; the reason only exists while off.
            data-off={off ? t("field.off", { name: tool.name }) : undefined}
            aria-label={tool.name}
            aria-pressed={pressed}
            aria-disabled={off || undefined}
            tabIndex={i === tabStop ? 0 : -1}
            onFocus={() => setTabStop(i)}
            onClick={(event) => press(tool, event.currentTarget)}
            style={toolStyle(tool)}
            className={cn(
              "tool",
              // Later tools only where there is room for them.
              i >= 12 && "max-sm:hidden",
              i >= 20 && "max-xl:hidden",
            )}
          >
            {/* One element carries the tilt, the pointer push and the gust
                (`rotate`, `translate` and `transform` compose). Its `use`
                holds only the address: tool-icons-script.ts says when it loads. */}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="tool-icon">
              <use data-href={`${spriteHref}#${tool.slug}`} />
            </svg>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={t("field.label")}
      onKeyDown={onKeyDown}
      className={cn(
        "grid gap-y-2",
        "xl:pointer-events-none xl:grid-cols-subgrid xl:grid-rows-subgrid xl:gap-y-0",
        className,
      )}
    >
      {field(0)}
      {field(1)}
      <p
        aria-live="polite"
        className={cn(
          "mt-2 min-h-6 text-center text-sm text-text-muted",
          "xl:pointer-events-auto xl:col-start-2 xl:row-start-2 xl:mt-8",
        )}
      >
        {active.length === 0 ? (
          t("field.hint")
        ) : (
          <>
            {t("field.count", { count: matching, total: roles.length })}{" "}
            <a
              href={`#${resultsId}`}
              className={cn(
                "font-medium text-text-primary underline decoration-accent underline-offset-4",
                "hover:text-accent transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
              )}
            >
              {t("field.see")}
              <span aria-hidden="true"> ↓</span>
            </a>
            <span aria-hidden="true"> · </span>
            <button
              type="button"
              onClick={filter.clear}
              className={cn(
                "min-h-6 cursor-pointer text-text-secondary hover:text-text-primary",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:underline",
              )}
            >
              {t("field.clear")}
            </button>
          </>
        )}
      </p>
    </div>
  );
}
