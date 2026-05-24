import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — class-name composer. clsx handles conditionals/arrays, tailwind-merge
 * resolves conflicting Tailwind utilities (last one wins, correctly).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
