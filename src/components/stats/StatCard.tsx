"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * StatCard — plan §10.
 *
 * Displays a single stat (large value + label). When the value changes,
 * Framer Motion counts up/down from the previous value over ~800 ms with an
 * ease-out curve so filters feel alive without being distracting.
 *
 * Non-numeric values (e.g. "15M+", "—") skip the count-up and swap in place.
 */
export interface StatCardProps {
  /** Displayed value. Numbers animate; strings swap immediately. */
  value: number | string;
  /** Appended to the animated number (e.g. " yrs"). Ignored for string values. */
  suffix?: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, suffix = "", className }: StatCardProps) {
  const isNumeric = typeof value === "number";
  const [display, setDisplay] = useState<string>(
    isNumeric ? `${value}${suffix}` : (value as string),
  );
  const prevRef = useRef<number>(isNumeric ? (value as number) : 0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(value as string);
      return;
    }

    const from = prevRef.current;
    const to = value as number;
    prevRef.current = to;

    // Stop any in-progress animation before starting the next one.
    animRef.current?.stop();

    animRef.current = animate(from, to, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(latest) {
        const decimals = Number.isInteger(to) ? 0 : 1;
        setDisplay(`${latest.toFixed(decimals)}${suffix}`);
      },
    });
  }, [value, isNumeric, suffix]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-xl",
        "border border-border bg-surface px-4 py-5 text-center",
        "transition-colors duration-300",
        className,
      )}
    >
      <span
        aria-live="polite"
        aria-atomic="true"
        className="text-3xl font-semibold tabular-nums tracking-tight text-text-primary"
      >
        {display}
      </span>
      <span className="text-xs uppercase tracking-widest text-text-secondary">
        {label}
      </span>
    </div>
  );
}
