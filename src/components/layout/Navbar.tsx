"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { OWNER_NAME } from "./social-links";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { withLocale } from "@/i18n/path";
import type { MessageKey } from "@/i18n/translator";

const SCROLL_THRESHOLD_PX = 16;

/**
 * Global Navbar (plan §10, §18).
 * - Sticky top-0, 64px tall.
 * - Transparent by default; backdrop-blur + bg-surface/80 once scrolled.
 * - Active route gets accent treatment + aria-current.
 * - Mobile breakpoint: hamburger toggles a full-screen overlay with large
 *   nav links (Framer Motion fade + scale).
 * - Theme toggle + language switcher live to the right of the nav links.
 *
 * Nav `href` is the EN path; `withLocale()` prefixes the active locale so
 * `/story` becomes `/es/story` when ES is active. Owner name and all labels
 * resolve through `useTranslations()`.
 */
export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const homeHref = withLocale("/", locale);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16",
        "transition-colors duration-200 ease-out",
        scrolled
          ? "border-b border-border bg-surface/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label={t("nav.primary")}
        className="mx-auto flex h-full max-w-6xl items-center justify-between px-6"
      >
        <Link
          href={homeHref}
          className={cn(
            "text-sm font-semibold tracking-tight text-text-primary",
            "hover:text-accent transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
          )}
        >
          {OWNER_NAME}
        </Link>

        {/* Desktop links + controls */}
        <div className="hidden sm:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                labelKey={item.labelKey}
                href={withLocale(item.href, locale)}
                pathname={pathname}
                label={t(item.labelKey)}
              />
            ))}
          </ul>
          <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
          <LanguageSwitcher />
          <ThemeToggle className="ml-1" />
        </div>

        {/* Mobile: theme + language toggles + hamburger */}
        <div className="sm:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-md",
              "text-text-primary hover:bg-surface-elevated cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              "transition-colors duration-150",
            )}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.site")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="sm:hidden fixed inset-0 top-16 z-30 bg-bg/95 backdrop-blur-sm"
          >
            <motion.ul
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-2 px-6 py-10"
            >
              {NAV_ITEMS.map((item) => {
                const href = withLocale(item.href, locale);
                const active = isActive(href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block py-4 text-3xl font-medium tracking-tight",
                        "border-b border-border",
                        "transition-colors duration-150",
                        active
                          ? "text-accent"
                          : "text-text-primary hover:text-accent",
                        "focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-accent rounded-sm",
                      )}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  pathname,
}: {
  /** i18n key — used as a React key only, label is pre-resolved by caller. */
  labelKey: MessageKey;
  href: string;
  label: string;
  pathname: string | null;
}) {
  const active = isActive(href, pathname);
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-block rounded-md px-3 py-2 text-sm font-medium",
          "transition-colors duration-150",
          active
            ? "text-accent"
            : "text-text-secondary hover:text-text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}
