import type { Locale } from "@/i18n/locale";
import { getMessages, getTranslator } from "@/i18n/server";
import { siteConfig } from "@/lib/site/config";
import { cn } from "@/lib/utils";

/**
 * HowItsBuilt — `/how-its-built`, the site's engineering story (mirrors the
 * README): the content pipeline, the quality gates every change passes,
 * and the architecture decisions with their trade-offs.
 *
 * Server component, zero client JS. Copy lives in `howItsBuilt.*` in both
 * catalogues; list sections read arrays via `getMessages`.
 */
export function HowItsBuilt({ locale }: { locale: Locale }) {
  const t = getTranslator(locale);
  const m = getMessages(locale).howItsBuilt;

  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-16">
        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">
            {t("howItsBuilt.eyebrow")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {t("howItsBuilt.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-text-secondary">
            {t("howItsBuilt.intro")}
          </p>
        </header>

        <Section id="pipeline" title={t("howItsBuilt.pipelineTitle")}>
          <ol className="space-y-5">
            {m.pipeline.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-sm font-medium text-text-secondary"
                >
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-medium text-text-primary">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="gates" title={t("howItsBuilt.gatesTitle")}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {m.gates.map((gate) => (
              <li
                key={gate.title}
                className="space-y-1.5 rounded-2xl border border-border bg-surface p-5"
              >
                <h3 className="font-medium text-text-primary">{gate.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{gate.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="decisions" title={t("howItsBuilt.decisionsTitle")}>
          <ol className="space-y-6">
            {m.decisions.map((d, i) => (
              <li key={d.title} className="space-y-1.5 border-t border-border pt-5 first:border-t-0 first:pt-0">
                <h3 className="font-medium text-text-primary">
                  <span className="text-text-muted">{i + 1}. </span>
                  {d.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{d.body}</p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  <span className="font-medium text-text-primary">{m.tradeoffLabel}</span>{" "}
                  {d.tradeoff}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <section
          aria-labelledby="source-title"
          className="space-y-4 rounded-2xl border border-border bg-surface/40 px-6 py-8 text-center sm:px-10"
        >
          <h2 id="source-title" className="text-2xl font-semibold tracking-tight text-text-primary">
            {t("howItsBuilt.sourceTitle")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
            {t("howItsBuilt.sourceBody")}
          </p>
          <a
            href={siteConfig.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex min-h-10 items-center gap-1 rounded-full border border-border bg-surface px-5",
              "text-sm font-medium text-text-primary hover:bg-surface-elevated hover:border-text-muted",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            )}
          >
            {t("howItsBuilt.sourceCta")}
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-6">
      <h2
        id={`${id}-title`}
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
