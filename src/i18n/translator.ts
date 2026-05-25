import type { Messages } from "./messages/en";

/**
 * Tiny ICU-lite translator (plan §18).
 *
 * Resolves dot-notation message keys against a `Messages` object and
 * substitutes `{name}` placeholders with the provided values. Falls back to
 * the key itself if the path doesn't resolve — makes missing strings loud
 * in development without crashing production.
 *
 * Why custom over `next-intl`: static export blocks middleware, which is
 * how next-intl wires the EN-unprefixed routing the plan requires. A 30-line
 * resolver gets us the same call site (`t("hero.cta.explore")`) without the
 * dep or the workaround.
 */
export type Values = Record<string, string | number>;

/**
 * Dot-notation key into a Messages object. Constrained to leaf strings so
 * `t("hero.cta")` (which would resolve to an object) is a compile error.
 */
export type MessageKey<T = Messages> = T extends string
  ? ""
  : T extends Record<string, unknown>
    ? {
        [K in keyof T & string]: T[K] extends string
          ? K
          : T[K] extends Record<string, unknown>
            ? `${K}.${MessageKey<T[K]>}`
            : never;
      }[keyof T & string]
    : never;

export function translate(
  messages: Messages,
  key: string,
  values?: Values,
): string {
  const raw = resolvePath(messages, key);
  if (typeof raw !== "string") {
    if (process.env.NODE_ENV !== "production") {
      // Loud in dev, silent in prod (the key is shown so the gap is obvious)
      console.warn(`[i18n] Missing or non-string key: ${key}`);
    }
    return key;
  }
  return values ? interpolate(raw, values) : raw;
}

/**
 * Resolve a `"a.b.c"` path against a nested object. Returns the value or
 * `undefined` (never throws, never traverses prototype).
 */
function resolvePath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (
      cur === null ||
      typeof cur !== "object" ||
      !Object.prototype.hasOwnProperty.call(cur, part)
    ) {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

/** Replace `{name}` placeholders with values, leaving unknown names intact. */
function interpolate(template: string, values: Values): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const v = values[name];
    return v === undefined ? match : String(v);
  });
}
