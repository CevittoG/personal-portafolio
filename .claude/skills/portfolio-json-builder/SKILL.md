---
name: portfolio-json-builder
description: >
  Parses markdown documentation files about professional experience and produces or updates two structured JSON files:
  `taxonomy.json` (the controlled vocabulary of all tags) and `experience.json` (the experience entries with grouped tags).
  Use this skill whenever the user wants to convert a markdown experience/resume file into portfolio JSON data,
  add a new job or project to their existing portfolio JSONs, update an existing experience entry,
  or sync any markdown documentation into the portfolio data layer. Trigger even if the user phrases it casually,
  e.g. "add this job to my portfolio data", "update my JSON with this new experience", "parse my experience file",
  or "I wrote documentation for a new job, add it".
---

# Portfolio JSON Builder

Converts markdown documentation about professional experience into two structured JSON files that power an interactive portfolio website.

## Context

This skill is part of a personal portfolio project. The site's core mechanic is **tag-based filtering** — recruiters select tags and the UI reshapes around their interest. All data lives in two flat JSON files (no database). Each job experience is documented in a **separate markdown file**, so this skill must **merge** new content into existing JSONs rather than overwriting them.

---

## The Two Output Files

### `taxonomy.json`
The controlled vocabulary. Defines every valid tag with its type and metadata. No tag may appear in `experience.json` unless it exists here first. When parsing a new markdown file, extract all tags mentioned and add any that don't already exist.

**Tag types (the full taxonomy):**

| Type key | What it covers | Examples |
|---|---|---|
| `roles` | Job position targets | DevOps, Data Engineer, Backend, Full Stack, AI Engineer |
| `languages` | Programming/query languages | Python, SQL, TypeScript, Bash, PHP |
| `technologies` | Platforms, tools, infra | Snowflake, AWS, Docker, Postgres, Prometheus |
| `libraries` | Code-level packages/frameworks | FastAPI, Pandas, Pydantic, Boto3, Pytest |
| `domains` | Business/industry verticals | FinTech, SaaS, EdTech, Analytics, E-commerce |
| `concepts` | Abstract technical ideas | REST APIs, CI/CD, ETL, Observability, RAG, LLMs |
| `scale` | Impact/size indicators | production system, 10M+ rows, greenfield, migration |
| `soft_skills` | Human/interpersonal skills | Communication, Leadership, Teaching, Cross-cultural |

### `experience.json`
An array of experience entries. Each entry has a **base shape** (shared by all types) plus **type-specific extensions**.

See `references/schemas.md` for the full JSON schemas.

---

## Workflow

### Step 1 — Read existing files
Before doing anything, check whether `taxonomy.json` and `experience.json` already exist in the user's working directory. If they do, load both into context. If they don't, you'll be creating them from scratch (start with empty `{}` taxonomy and `[]` experience array).

### Step 2 — Parse the markdown file
Read the provided markdown file. Extract:

- **Entry type** — Is this a `job`, `project`, `education`, or `personal` entry? Infer from content if not explicit.
- **Identity fields** — title, company (if job), period, employment type, team, etc.
- **Summary** — Distill a 1–2 sentence overview from the content.
- **Description** — The full narrative. Preserve detail; this is the deep-dive content for the website.
- **Impact statements** — Any quantifiable outcomes (metrics, scale, team size, outcomes). Extract as an array of strings.
- **Tags** — Read through the full content and extract all relevant tags, grouped by type. Be thorough — err on the side of adding more tags rather than fewer, since tags drive discoverability.
- **Media** — Any URLs, repos, or links mentioned.
- **Featured** — Default to `false` unless the entry seems especially significant.
- **Relevant** — Whether this counts as professional/technical experience. Set `true` for software/data/engineering jobs, technical projects, and teaching/mentoring in tech (e.g. a coding bootcamp instructor). Set `false` for formal education, unrelated jobs (e.g. waiter), and personal pursuits (e.g. competitive sports). This flag drives the site's "Discover" tool — **only relevant entries appear in Discover and feed the years-of-experience stat**. Non-relevant entries remain in the data (Story timeline, direct deep-dive links) but are filtered out of Discover. When unsure, default to `false`.

### Step 3 — Resolve tags against taxonomy
For every tag extracted in Step 2:
- If it already exists in `taxonomy.json` → use the existing slug as-is.
- If it's new → create a new taxonomy entry with a kebab-case slug, display name, type, and empty optional fields. Add it to taxonomy.
- Never duplicate. Check slugs case-insensitively.

### Step 4 — Check for existing entry
Search `experience.json` for an entry with the same `id` (slug) or matching `title` + `company`/`period`.
- **If found** → merge/update the entry. Preserve fields the markdown doesn't mention. Add new tags, don't remove existing ones unless explicitly told to.
- **If not found** → append a new entry.

### Step 5 — Write output files
Write both updated files. Always write both even if only one changed, to keep them in sync.

### Step 6 — Report to user
Summarize what changed:
- New tags added to taxonomy (list them with their type)
- Whether the experience entry was created or updated
- Any ambiguities or decisions you made that the user should review

---

## ID / Slug Generation

Experience entry IDs should be human-readable and unique:
- Format: `{company-slug}-{role-slug}-{year}` for jobs (e.g., `acme-corp-data-engineer-2022`)
- Format: `{project-name-slug}` for projects (e.g., `realtime-pipeline-dashboard`)
- Format: `{institution-slug}-{year}` for education
- Format: `{descriptor-slug}` for personal (e.g., `teaching-colombia-2018`)

Tag slugs: always kebab-case, lowercase (e.g., `fast-api`, `data-pipelines`, `cross-cultural`).

---

## Update vs. Overwrite Rules

This is critical. These files are **append/merge only** unless the user explicitly says to replace something.

| Scenario | Action |
|---|---|
| New markdown file, entry doesn't exist yet | Append new entry |
| Markdown file for existing entry (same id) | Merge: update fields present in markdown, keep fields not mentioned |
| New tags found in markdown | Add to taxonomy, never remove existing tags |
| Tag already in taxonomy with different casing | Use existing slug, do not create duplicate |
| User says "replace" or "rewrite this entry" | Full overwrite of that entry only |

---

## Edge Cases & Judgment Calls

**Ambiguous type**: If unsure whether something is a `job` vs `project`, prefer `job` if there's a company and employment duration, `project` if it's self-directed or freelance.

**Missing dates**: Use `null` for unknown end dates (implies current). Use approximate years if only year is known (`"2021"` is fine as a period value).

**Tag inference**: Don't only tag what's explicitly named. If the markdown describes building REST endpoints, infer `concepts: ["rest-apis"]` even if the words "REST API" don't appear verbatim.

**Impact extraction**: Look for numbers, percentages, team sizes, user counts, uptime figures, cost savings. These power the Page 1 dashboard numbers on the website.

**Soft skills**: Parse the narrative tone and story. If someone describes explaining a complex system to non-technical stakeholders, tag `soft_skills: ["communication", "technical-writing"]` even if the word "communication" isn't used.

---

## Reference Files

- `references/schemas.md` — Full JSON schemas for both files with annotated examples. **Read this before writing any JSON output.**
