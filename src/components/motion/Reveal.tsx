"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { Children, isValidElement } from "react";

/**
 * Reveal — site-wide scroll-enter primitive (plan §15 polish, Layer A).
 *
 * Fades + nudges children upward as they cross into the viewport, once.
 * Honors `prefers-reduced-motion` by rendering the final state immediately.
 *
 * Renders a `motion.div`. Callers that need a different semantic tag wrap
 * the inner content with their own element. This keeps Framer Motion's
 * typing narrow and predictable.
 *
 * Motion law: 320ms, ease-out-quint, transform+opacity only. No bounce.
 */
export interface RevealProps {
  children: ReactNode;
  /** Delay before the reveal kicks in, in seconds. Defaults to 0. */
  delay?: number;
  /** Y offset to start from, in px. Defaults to 8. */
  y?: number;
  /** Duration in seconds. Defaults to 0.32. */
  duration?: number;
  /** Fraction of element that must be in view to trigger. Defaults to 0.2. */
  amount?: number;
  className?: string;
}

// Ease-out-quint approximation. Starts fast, settles slow — "quiet but deliberate".
const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  delay = 0,
  y = 8,
  duration = 0.32,
  amount = 0.2,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT_QUINT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealStagger — wraps a list of children with sequential reveal delays.
 *
 * Each direct child is wrapped in its own `<Reveal>` with `step × index`
 * delay. The wrapper element tag is configurable via `as` (default `div`)
 * so callers can render semantic `<ul>` / `<ol>` lists.
 */
export interface RevealStaggerProps {
  children: ReactNode;
  /** Delay between successive children, in seconds. Defaults to 0.06. */
  step?: number;
  /** Initial delay before the first child reveals. Defaults to 0. */
  initialDelay?: number;
  /** Y offset to start from, in px. Defaults to 8. */
  y?: number;
  /** Wrapper element tag. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  /** Class applied to each per-child Reveal. */
  childClassName?: string;
}

export function RevealStagger({
  children,
  step = 0.06,
  initialDelay = 0,
  y = 8,
  as,
  className,
  childClassName,
}: RevealStaggerProps) {
  const Wrapper = (as ?? "div") as ElementType;
  const items = Children.toArray(children);
  return (
    <Wrapper className={className}>
      {items.map((child, i) => (
        <Reveal
          key={isValidElement(child) && child.key != null ? child.key : i}
          className={childClassName}
          delay={initialDelay + i * step}
          y={y}
        >
          {child}
        </Reveal>
      ))}
    </Wrapper>
  );
}
