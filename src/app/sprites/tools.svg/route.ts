import { buildToolSprite } from "@/lib/explorer/tool-icons";

export const dynamic = "force-static";

/**
 * The tool field's icons as one static file, `/sprites/tools.svg`: written
 * once at build, cached by the browser, and referenced per tool with
 * `<use href>` (see `src/lib/explorer/tool-icons.ts` for why not inline).
 */
export function GET() {
  return new Response(buildToolSprite(), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
