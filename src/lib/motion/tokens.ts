/**
 * Motion tokens for JavaScript-driven animation (Motion's `transition`
 * prop). The CSS side lives in globals.css (`--ease-out-quint`,
 * `--duration-quick`, `--duration-reveal`); change both together.
 */

/** Default easing: starts fast, settles slow. */
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/** Seconds. `quick` for chips and menus, `reveal` for content settling in. */
export const DURATION = { quick: 0.18, reveal: 0.32 } as const;

/**
 * Longest a staggered item may wait, in seconds. Past ~150ms a stagger
 * stops reading as rhythm and starts reading as the page being slow.
 */
export const MAX_STAGGER_DELAY = 0.15;
