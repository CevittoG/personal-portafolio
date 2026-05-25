import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { I18nProvider } from "@/i18n/I18nProvider";
import { DEFAULT_LOCALE } from "@/i18n/locale";

/**
 * EN layout (plan §18).
 *
 * The (en) route group is invisible in URLs — pages here resolve at the
 * unprefixed root (`/`, `/story`, etc.). This layout wraps the tree in an
 * `I18nProvider` pinned to the default locale and renders the shared shell
 * (Navbar + Footer) so they consume the EN catalogue.
 *
 * Static export note: Next.js root layout can't branch on URL, so locale-
 * specific shell rendering has to live in per-locale layouts. ES has the
 * mirror at `src/app/es/layout.tsx`.
 */
export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale={DEFAULT_LOCALE}>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </I18nProvider>
  );
}
