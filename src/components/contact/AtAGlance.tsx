import type { Locale } from "@/i18n/locale";
import { getTranslator } from "@/i18n/server";
import { CORE_STACK, getEngineeringYears } from "@/lib/site/profile";

/**
 * "At a glance": the facts an ATS or recruiter screen checks, in one
 * scannable list. There is no public résumé, so the site has to carry them.
 * Years come from the same computer as the hero and Stats Bar.
 */
export function AtAGlance({ locale }: { locale: Locale }) {
  const t = getTranslator(locale);
  const rows: { label: string; value: string }[] = [
    { label: t("contact.glance.role"), value: t("hero.role") },
    {
      label: t("contact.glance.experience"),
      value: t("contact.glance.experienceValue", {
        years: getEngineeringYears(),
      }),
    },
    { label: t("contact.glance.stack"), value: CORE_STACK.join(", ") },
    {
      label: t("contact.glance.location"),
      value: t("contact.glance.locationValue"),
    },
    {
      label: t("contact.glance.authorization"),
      value: t("contact.workAuthorization"),
    },
    {
      label: t("contact.glance.education"),
      value: t("contact.glance.educationValue"),
    },
  ];

  return (
    <section
      aria-labelledby="glance-title"
      className="rounded-2xl border border-border bg-surface/40 px-6 py-6 text-left sm:px-8 sm:py-7"
    >
      <h2
        id="glance-title"
        className="mb-4 text-xs uppercase tracking-[0.2em] text-text-secondary"
      >
        {t("contact.glance.title")}
      </h2>
      <dl className="divide-y divide-border">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[11rem_1fr] sm:gap-4"
          >
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="text-sm leading-relaxed text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
