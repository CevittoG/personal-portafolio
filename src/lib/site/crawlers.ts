/**
 * Crawler policy, one place. The owner's decision (2026-10-14): search and
 * assistant crawlers are welcome, AI *training* crawlers are not. To allow
 * training later, move an agent from TRAINING_AGENTS to SEARCH_AGENTS.
 *
 * Google's own search crawlers (Googlebot) fall under the `*` group.
 * `Google-Extended` and `Applebot-Extended` are opt-out signals for
 * training, not crawlers that fetch pages for search.
 */

/** Paths no crawler should fetch. Empty today (the site has no admin or
 *  private routes). Every named group below repeats it, because a named
 *  group replaces the `*` group for that bot. */
export const PRIVATE_PATHS: readonly string[] = [];

/** Fetch pages to answer a user's question or build a search index. */
export const SEARCH_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Bingbot",
  "DuckAssistBot",
  "MistralAI-User",
] as const;

/** Collect content to train or improve models. */
export const TRAINING_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "CCBot",
] as const;
