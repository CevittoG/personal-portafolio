import { cn } from "@/lib/utils";
import { OWNER_NAME, SOCIAL_LINKS } from "./social-links";

/**
 * Global Footer (plan §5 — "GitHub · LinkedIn · Email · Copyright line.
 * Nothing else."). Server component — no state needed.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4",
          "px-6 py-6 flex-col sm:flex-row",
        )}
      >
        <p className="text-xs text-text-muted">
          © {year} {OWNER_NAME}
        </p>
        <ul className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-label={link.ariaLabel}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-md",
                  "text-text-secondary hover:text-accent",
                  "cursor-pointer transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-accent focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-bg",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d={link.iconPath} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
