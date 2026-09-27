"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — sun/moon button in the Navbar (plan §17).
 *
 * Two-state icon button: sun face when current theme is light (clicking
 * switches to dark), moon face when current is dark (clicking switches to
 * light). `aria-pressed` reflects "light is active"; the visually hidden
 * label spells out the action so screen-reader users hear the verb.
 *
 * Both icons are always rendered and the visible one is chosen in CSS off
 * `<html data-theme>` (the `light:` variant), which the inline script sets
 * before first paint. So the icon is right from the first frame and the
 * server HTML never depends on client-only state (no hydration mismatch).
 * Theme state only drives the label, and it syncs right after mount.
 * The swap is a CSS cross-fade with a small rotate; reduced motion keeps
 * only an instant switch.
 */
export interface ThemeToggleProps {
  className?: string;
}

const ICON = cn(
  "absolute inset-0 grid place-items-center",
  "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-reduce:transition-none",
);

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const t = useTranslations();
  const isLight = theme === "light";
  const label = t(isLight ? "nav.themeToDark" : "nav.themeToLight");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-grid h-9 w-9 cursor-pointer place-items-center rounded-full",
        "text-text-secondary hover:text-text-primary",
        "hover:bg-surface-elevated",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "active:scale-[0.94] motion-reduce:active:scale-100",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          ICON,
          "opacity-0 rotate-45 scale-60",
          "light:opacity-100 light:rotate-0 light:scale-100",
        )}
      >
        <SunIcon />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          ICON,
          "opacity-100 rotate-0 scale-100",
          "light:opacity-0 light:-rotate-45 light:scale-60",
        )}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

function SunIcon() {
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
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1" />
    </svg>
  );
}

function MoonIcon() {
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
      strokeLinejoin="round"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
    </svg>
  );
}
