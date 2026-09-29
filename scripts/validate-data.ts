/**
 * `pnpm validate:data` — check taxonomy.json and experience.json against
 * the schemas and cross-file rules without a full build. Exit code 1 and a
 * list of problems on failure.
 */
import experience from "../src/data/experience.json";
import taxonomy from "../src/data/taxonomy.json";
import { validateContent } from "../src/content/validate";

const errors = validateContent(taxonomy, experience);
if (errors.length > 0) {
  console.error(`✗ Content validation failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ Content valid: ${experience.length} entries, ${Object.values(taxonomy).reduce((n, b) => n + Object.keys(b).length, 0)} tags`);
