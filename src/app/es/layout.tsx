import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { I18nProvider } from "@/i18n/I18nProvider";

/**
 * ES layout (plan §18).
 *
 * Wraps the Spanish tree in an `I18nProvider` pinned to "es" and renders
 * the shared shell (Navbar + Footer) so they consume the ES catalogue.
 * Mirror of `(en)/layout.tsx`.
 */
export default function EsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale="es">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </I18nProvider>
  );
}
