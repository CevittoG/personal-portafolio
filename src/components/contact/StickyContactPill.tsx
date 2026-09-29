"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/I18nProvider";
import { umamiAttributes } from "@/lib/analytics/umami";
import { emailHref, resumeRequestHref } from "@/lib/site/contact";
import { cn } from "@/lib/utils";
import { DocumentIcon, MailIcon } from "./ContactLinks";

/**
 * Mobile-only contact pill (below `sm`), pinned to the bottom once the
 * element with `watchId` (the hero) has scrolled out of view, so the two
 * conversion actions stay one tap away on a long scroll.
 *
 * `suppressed` hides it while something else owns the bottom of the screen
 * (the experience bottom sheet); `hideWhenVisibleId` hides it while that
 * element is on screen (the landing's own Contact block, which offers the
 * same two actions). Fades with CSS only; `motion-reduce`
 * drops the slide.
 */
export interface StickyContactPillProps {
  watchId: string;
  suppressed?: boolean;
  hideWhenVisibleId?: string;
}

export function StickyContactPill({
  watchId,
  suppressed = false,
  hideWhenVisibleId,
}: StickyContactPillProps) {
  const t = useTranslations();
  const [pastHero, setPastHero] = useState(false);
  const [duplicateInView, setDuplicateInView] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setPastHero(!entry.isIntersecting),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  useEffect(() => {
    if (!hideWhenVisibleId) return;
    const target = document.getElementById(hideWhenVisibleId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setDuplicateInView(entry.isIntersecting),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  const visible = pastHero && !suppressed && !duplicateInView;
  const segment = cn(
    "inline-flex min-h-11 items-center gap-2 px-4 text-sm font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
    "focus-visible:ring-accent",
  );

  return (
    <nav
      aria-label={t("contactCta.sticky")}
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "sm:hidden fixed inset-x-0 z-30 flex justify-center px-4",
        "bottom-[max(1rem,env(safe-area-inset-bottom))]",
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-opacity",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-3",
      )}
    >
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-full",
          "border border-border bg-surface/90 shadow-lg backdrop-blur-md",
        )}
      >
        <a
          href={emailHref()}
          {...umamiAttributes("contact_clicked", {
            kind: "email",
            source: "sticky",
          })}
          className={cn(segment, "text-text-primary hover:bg-surface-elevated")}
        >
          <MailIcon />
          {t("contactCta.email")}
        </a>
        <a
          href={resumeRequestHref(t)}
          {...umamiAttributes("contact_clicked", {
            kind: "resume_request",
            source: "sticky",
          })}
          className={cn(segment, "bg-accent text-on-accent hover:bg-accent-hover")}
        >
          <DocumentIcon />
          {t("contactCta.resume")}
        </a>
      </div>
    </nav>
  );
}
