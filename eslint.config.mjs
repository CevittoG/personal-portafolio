import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Native flat config (eslint-config-next 16 ships flat configs, so the
 * FlatCompat shim is gone): Next's core-web-vitals and TypeScript rules.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
    ".lighthouseci/**",
  ]),
]);
