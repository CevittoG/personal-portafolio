/**
 * Footer social links (plan §5). Keep this list short — the plan says
 * "GitHub · LinkedIn · Email · Copyright line. Nothing else."
 *
 * Each entry exposes the data the Footer renders; the Footer itself
 * stays oblivious to which links exist (OCP).
 */
import type { MessageKey } from "@/i18n/translator";

export interface SocialLink {
  label: string;
  href: string;
  /** i18n key for the aria-label / tooltip (plan §18). */
  labelKey: MessageKey;
  /** Heroicons-style 24×24 SVG path. Filled via `currentColor`. */
  iconPath: string;
}

// Heroicons / Simple-Icons-derived single-path SVGs (24×24 viewBox).
const ICON_GITHUB =
  "M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.35.78 1.05.78 2.11 0 1.52-.01 2.74-.01 3.11 0 .31.21.68.8.56 4.56-1.53 7.85-5.85 7.85-10.95C23.5 5.65 18.35.5 12 .5z";

const ICON_LINKEDIN =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z";

const ICON_MAIL =
  "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-9.74 6.09a1.5 1.5 0 01-1.52 0L1.5 8.67zM22.5 6.91V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.16l9.75 6.09a.75.75 0 00.76 0l9.49-6.09z";

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/CevittoG",
    labelKey: "footer.github",
    iconPath: ICON_GITHUB,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/asebagutierrezm/",
    labelKey: "footer.linkedin",
    iconPath: ICON_LINKEDIN,
  },
  {
    label: "Email",
    href: "mailto:aseba.gutierrezm@gmail.com",
    labelKey: "footer.email",
    iconPath: ICON_MAIL,
  },
];

export const OWNER_NAME = "Sebastian Gutierrez";
