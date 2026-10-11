import "server-only";
import { experienceRepository } from "@/lib/experience/json-repository";
import { toolSpriteHref } from "@/lib/explorer/tool-icons";
import { scatter, type ScatteredTool } from "@/lib/explorer/scatter";
import { FIELD_TOOLS } from "@/lib/site/field-tools";
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";

/**
 * Everything the hero's tool field needs, computed on the server: which
 * tools, where each sits (`scatter`), where their icons live, and just
 * enough about each role to tell which tools were used together.
 */
export interface FieldTool extends ScatteredTool {
  slug: string;
  name: string;
  type: TagType;
}

export interface ToolFieldData {
  tools: FieldTool[];
  /** The Explorer's roles as bare tag slugs: what a filter is matched on. */
  roles: { id: string; tags: string[] }[];
  spriteHref: string;
}

export function buildToolField(): ToolFieldData {
  const spots = scatter(FIELD_TOOLS.length);
  const tools = FIELD_TOOLS.map((slug, i) => {
    const tag = taxonomyRepository.getBySlug(slug);
    // The content validator reports this properly; this only narrows the type.
    if (!tag) throw new Error(`field-tools.ts: unknown tag "${slug}"`);
    return { ...spots[i], slug, name: tag.display_name, type: tag.type };
  });
  const roles = experienceRepository.getRelevant().map((entry) => ({
    id: entry.id,
    tags: [...new Set(TAG_TYPES.flatMap((type) => entry.tags[type]))],
  }));
  return { tools, roles, spriteHref: toolSpriteHref() };
}
