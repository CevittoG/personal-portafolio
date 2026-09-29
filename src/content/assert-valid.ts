import "server-only";
import { rawContent } from "./data";
import { validateContent } from "./validate";

/**
 * Fail the build on invalid content. Imported by the root layout, so it
 * runs during `next build` (locally, in CI and on Render) and never ships
 * to the browser. The problems are listed in the build log.
 */
export function assertValidContent(): void {
  const errors = validateContent(rawContent.taxonomy, rawContent.experience);
  if (errors.length > 0) {
    throw new Error(
      `Content validation failed (${errors.length}):\n  - ${errors.join("\n  - ")}`,
    );
  }
}
