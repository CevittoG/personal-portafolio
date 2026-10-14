import { DEFAULT_LOCALE } from "@/i18n/locale";
import { withLocale } from "@/i18n/path";
import { getTranslator } from "@/i18n/server";
import { siteConfig } from "./config";
import { FAQ_SECTIONS, faqText } from "./faq";
import { CORE_STACK, getEngineeringYears } from "./profile";

/**
 * `/llms.txt`: a Markdown brief for language models, built from the same
 * config and FAQ data as the pages. Few providers read it yet; it costs
 * nothing and gives an agent one page that says who, what and where.
 */
export function buildLlmsTxt(): string {
  const t = getTranslator(DEFAULT_LOCALE);
  const { location, languages, links, email, url } = siteConfig;
  const abs = (path: string) => `${url}${withLocale(path, DEFAULT_LOCALE)}`.replace(/\/$/, "");
  const place = `${location.locality}, ${location.regionName}, ${location.countryName}`;

  const lines = [
    `# ${siteConfig.name} (${siteConfig.alternateName})`,
    "",
    `> ${t("hero.role")} based in ${place}. ${getEngineeringYears()}+ years in engineering. Open to ${location.openTo.join(" or ")} roles. Works in ${languages.map((l) => l.name).join(" and ")}. This is his portfolio.`,
    "",
    `Core stack: ${CORE_STACK.join(", ")}. Authorized to work for any U.S. employer without sponsorship (U.S. permanent resident). The résumé is sent on request, not published.`,
    "",
    "## Pages",
    "",
    `- [Home](${url}): career highlights and an explorer that filters his experience by tool or role`,
    `- [Story](${abs("/story")}): his career in three acts`,
    `- [Contact](${abs("/contact")}): availability, work authorization, how to request his résumé`,
    `- [FAQ](${abs("/faq")}): location, work authorization, languages, what he builds`,
    `- [How it's built](${abs("/how-its-built")}): the engineering behind this site`,
    `- [Spanish version](${url}${withLocale("/", "es")}): every page also exists under /es`,
    "",
    "## FAQ",
    "",
    ...FAQ_SECTIONS.flatMap((section) =>
      section.items.flatMap((item) => [
        `### ${item.question[DEFAULT_LOCALE]}`,
        "",
        faqText(item.answer[DEFAULT_LOCALE]),
        "",
      ]),
    ),
    "## Contact and profiles",
    "",
    `- Email: ${email}`,
    `- LinkedIn: ${links.linkedin}`,
    `- GitHub: ${links.github}`,
    `- Site source: ${links.repo}`,
    "",
  ];
  return lines.join("\n");
}
