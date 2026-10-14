import { ContactActions } from "@/components/contact/ContactLinks";
import type { Locale } from "@/i18n/locale";
import { getTranslator } from "@/i18n/server";
import { FAQ_SECTIONS, faqText } from "@/lib/site/faq";
import { faqJsonLd, jsonLdScript } from "@/lib/site/structured-data";
import { cn } from "@/lib/utils";

/**
 * FAQ: shared page body for `/faq` and `/es/faq`, linked from the footer
 * only. Every section opens with a short lead and every question is an H3
 * with an always-visible answer (no accordion), so the answers are in the
 * static HTML for crawlers and AI search engines. Copy and the FAQPage
 * JSON-LD both come from `src/lib/site/faq.ts`.
 */
const LINK = cn(
  "inline-flex min-h-10 items-center rounded-sm text-sm font-medium",
  "text-text-primary underline decoration-accent underline-offset-4",
  "hover:text-accent transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
);

export function Faq({ locale }: { locale: Locale }) {
  const t = getTranslator(locale);

  return (
    <main className="px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(locale)) }}
      />
      <div className="mx-auto max-w-2xl space-y-12">
        <header className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-widest text-text-secondary">
            {t("faq.eyebrow")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {t("faq.title")}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-text-secondary">
            {t("faq.intro")}
          </p>
          <nav aria-label={t("faq.jumpLabel")}>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {FAQ_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={LINK}>
                    {section.title[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {FAQ_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-24 space-y-6"
          >
            <h2
              id={`${section.id}-title`}
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary"
            >
              {section.title[locale]}
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              {faqText(section.lead[locale])}
            </p>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <h3 className="text-lg font-medium text-text-primary">
                    {item.question[locale]}
                  </h3>
                  <p className="text-base leading-relaxed text-text-secondary">
                    {faqText(item.answer[locale])}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section
          aria-labelledby="faq-cta-title"
          className="space-y-5 rounded-2xl border border-border bg-surface/40 px-6 py-8 text-center sm:px-10"
        >
          <h2
            id="faq-cta-title"
            className="text-2xl font-semibold tracking-tight text-text-primary"
          >
            {t("faq.ctaTitle")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
            {t("contact.resume.body")}
          </p>
          <ContactActions t={t} source="faq" layout="row" className="mx-auto max-w-md" />
        </section>
      </div>
    </main>
  );
}
