# JSON Schemas Reference

Full schemas for `taxonomy.json` and `experience.json` with annotated examples.

---

## taxonomy.json

Top-level structure is an object keyed by tag type. Each type contains an object keyed by tag slug.

```json
{
  "roles": {
    "data-engineer": {
      "slug": "data-engineer",
      "display_name": "Data Engineer",
      "type": "roles",
      "icon": null,
      "color": null,
      "related": ["data-analyst", "data-scientist"]
    },
    "backend": {
      "slug": "backend",
      "display_name": "Backend Developer",
      "type": "roles",
      "icon": null,
      "color": null,
      "related": ["full-stack", "devops"]
    }
  },
  "languages": {
    "python": {
      "slug": "python",
      "display_name": "Python",
      "type": "languages",
      "icon": null,
      "color": null,
      "related": ["fastapi", "pandas"]
    },
    "sql": {
      "slug": "sql",
      "display_name": "SQL",
      "type": "languages",
      "icon": null,
      "color": null,
      "related": ["postgres", "snowflake"]
    }
  },
  "technologies": {
    "snowflake": {
      "slug": "snowflake",
      "display_name": "Snowflake",
      "type": "technologies",
      "icon": null,
      "color": null,
      "related": ["sql", "data-warehousing"]
    }
  },
  "libraries": {
    "fastapi": {
      "slug": "fastapi",
      "display_name": "FastAPI",
      "type": "libraries",
      "icon": null,
      "color": null,
      "related": ["python", "rest-apis"]
    },
    "pandas": {
      "slug": "pandas",
      "display_name": "Pandas",
      "type": "libraries",
      "icon": null,
      "color": null,
      "related": ["python", "etl"]
    }
  },
  "domains": {
    "fintech": {
      "slug": "fintech",
      "display_name": "FinTech",
      "type": "domains",
      "icon": null,
      "color": null,
      "related": []
    }
  },
  "concepts": {
    "rest-apis": {
      "slug": "rest-apis",
      "display_name": "REST APIs",
      "type": "concepts",
      "icon": null,
      "color": null,
      "related": ["fastapi", "backend"]
    },
    "etl": {
      "slug": "etl",
      "display_name": "ETL",
      "type": "concepts",
      "icon": null,
      "color": null,
      "related": ["data-engineer", "pandas", "snowflake"]
    },
    "ci-cd": {
      "slug": "ci-cd",
      "display_name": "CI/CD",
      "type": "concepts",
      "icon": null,
      "color": null,
      "related": ["devops", "docker"]
    }
  },
  "scale": {
    "production-system": {
      "slug": "production-system",
      "display_name": "Production System",
      "type": "scale",
      "icon": null,
      "color": null,
      "related": []
    },
    "10m-plus-rows": {
      "slug": "10m-plus-rows",
      "display_name": "10M+ Rows",
      "type": "scale",
      "icon": null,
      "color": null,
      "related": []
    }
  },
  "soft_skills": {
    "communication": {
      "slug": "communication",
      "display_name": "Communication",
      "type": "soft_skills",
      "icon": null,
      "color": null,
      "related": ["teaching", "technical-writing"]
    },
    "teaching": {
      "slug": "teaching",
      "display_name": "Teaching",
      "type": "soft_skills",
      "icon": null,
      "color": null,
      "related": ["communication", "mentoring"]
    },
    "cross-cultural": {
      "slug": "cross-cultural",
      "display_name": "Cross-cultural",
      "type": "soft_skills",
      "icon": null,
      "color": null,
      "related": ["communication", "adaptability"]
    }
  }
}
```

### Taxonomy entry fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | yes | kebab-case, matches the key |
| `display_name` | string | yes | Human-readable, shown in UI |
| `type` | string | yes | Must match the parent key |
| `icon` | string\|null | no | Leave null; filled later by designer |
| `color` | string\|null | no | Leave null; filled later by designer |
| `related` | string[] | yes | Array of related slugs (can be empty) |

---

## experience.json

Top-level structure is an array of entry objects.

### Base fields (all types share these)

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | kebab-case unique slug |
| `title` | string | yes | Role or experience name |
| `type` | string | yes | `"job"` \| `"project"` \| `"education"` \| `"personal"` |
| `period` | object | yes | `{ "start": "2022-03", "end": "2024-01" }` — use `null` for end if current |
| `summary` | string | yes | 1–2 sentences, used in cards/filtered views |
| `description` | string | yes | Full narrative from documentation |
| `tags` | object | yes | Grouped tag slugs (see below) |
| `impact` | string[] | yes | Quantifiable outcomes. Empty array if none. |
| `media` | object[] | yes | Links/repos. Empty array if none. |
| `featured` | boolean | yes | Whether to surface prominently. Default `false`. |
| `relevant` | boolean | yes | Professional/technical experience. `true` → shown in the "Discover" tool and counted in the years-of-experience stat. `false` → kept in data (Story, deep-dive) but hidden from Discover. Default `false`; set `true` for engineering/data/tech jobs, technical projects, and tech teaching/mentoring. |
| `story_act` | string | no | Which Story-page act this entry belongs to: `"foundation"` (non-technical Act 1 — sports, hospitality, teaching, mentoring) or `"technical"` (Act 3 — engineering roles). **Omit** to keep an entry off the Story timeline (e.g. formal education). Independent of `relevant`: an entry can be `relevant: true` (in Discover) yet `story_act: "foundation"`. |
| `personal_impact` | string | no | 1–2 sentence reflective statement: the pillar/core of this chapter and how it shaped the person. Shown on the Story timeline *in place of* `summary`. Distinct from `impact` (quantifiable outcomes) and `summary` (factual capsule). |

### Tags object shape

```json
"tags": {
  "roles": ["data-engineer", "backend"],
  "languages": ["python", "sql"],
  "technologies": ["snowflake", "postgres"],
  "libraries": ["fastapi", "pandas", "pydantic"],
  "domains": ["fintech"],
  "concepts": ["etl", "rest-apis", "ci-cd"],
  "scale": ["production-system", "10m-plus-rows"],
  "soft_skills": ["communication"]
}
```

All 8 tag type keys must be present. Use empty arrays `[]` for types with no tags — never omit a key.

### Media object shape

```json
{
  "label": "GitHub Repository",
  "url": "https://github.com/user/repo",
  "type": "repo"
}
```

Media types: `"repo"`, `"url"`, `"demo"`, `"article"`, `"certificate"`.

---

## Type-specific extension fields

### type: "job"

```json
{
  "id": "acme-corp-data-engineer-2022",
  "title": "Data Engineer",
  "type": "job",
  "company": {
    "name": "Acme Corp",
    "url": "https://acmecorp.com",
    "industry": "fintech"
  },
  "location": "Remote",
  "employment_type": "full-time",
  "team": "Data Platform",
  "period": { "start": "2022-03", "end": null },
  "summary": "Built and maintained data pipelines processing 10M+ rows daily for a FinTech platform.",
  "description": "Full narrative here...",
  "tags": {
    "roles": ["data-engineer"],
    "languages": ["python", "sql"],
    "technologies": ["snowflake", "aws", "airflow"],
    "libraries": ["pandas", "pydantic", "boto3"],
    "domains": ["fintech"],
    "concepts": ["etl", "data-pipelines", "observability"],
    "scale": ["production-system", "10m-plus-rows"],
    "soft_skills": ["communication"]
  },
  "impact": [
    "Reduced pipeline failure rate by 40% through better observability tooling",
    "Processed 10M+ rows daily with sub-5-minute latency",
    "Mentored 2 junior engineers on data modeling best practices"
  ],
  "media": [
    { "label": "Company Website", "url": "https://acmecorp.com", "type": "url" }
  ],
  "featured": true,
  "relevant": true,
  "story_act": "technical",
  "personal_impact": "This role turned a capable builder into a data engineer who owns systems end to end — and taught me to spot and fix inefficiencies before anyone asks."
}
```

**Job-specific fields:**

| Field | Type | Required for job | Notes |
|---|---|---|---|
| `company` | object | yes | `{ name, url, industry }` — url and industry optional |
| `location` | string | yes | "Remote", "New York, NY", "Hybrid — Bogotá" |
| `employment_type` | string | yes | `"full-time"` \| `"contract"` \| `"freelance"` \| `"part-time"` |
| `team` | string\|null | no | Team or department name within the company |

---

### type: "project"

```json
{
  "id": "realtime-pipeline-dashboard",
  "title": "Realtime Pipeline Dashboard",
  "type": "project",
  "status": "completed",
  "client": null,
  "period": { "start": "2023-06", "end": "2023-09" },
  "summary": "Open-source dashboard for monitoring Airflow pipelines with real-time alerting.",
  "description": "Full narrative here...",
  "tags": { ... },
  "impact": ["500+ GitHub stars", "Used in production by 3 companies"],
  "media": [
    { "label": "GitHub", "url": "https://github.com/user/project", "type": "repo" }
  ],
  "featured": false
}
```

**Project-specific fields:**

| Field | Type | Required for project | Notes |
|---|---|---|---|
| `status` | string | yes | `"completed"` \| `"ongoing"` \| `"archived"` |
| `client` | string\|null | no | Client name if freelance; null if personal |

---

### type: "education"

```json
{
  "id": "udemy-aws-solutions-architect-2021",
  "title": "AWS Solutions Architect Associate",
  "type": "education",
  "institution": "AWS / Udemy",
  "credential": "certification",
  "issuer": "Amazon Web Services",
  "period": { "start": "2021-01", "end": "2021-03" },
  "summary": "Certified AWS Solutions Architect with focus on serverless and data architectures.",
  "description": "Full narrative here...",
  "tags": { ... },
  "impact": [],
  "media": [
    { "label": "Certificate", "url": "https://...", "type": "certificate" }
  ],
  "featured": false
}
```

> Note: `education` entries omit `story_act` (and usually `personal_impact`) so they
> stay off the Story timeline — they remain in the data for direct deep-dive links.

**Education-specific fields:**

| Field | Type | Required for education | Notes |
|---|---|---|---|
| `institution` | string | yes | School, platform, or organization |
| `credential` | string | yes | `"degree"` \| `"certification"` \| `"course"` \| `"bootcamp"` |
| `issuer` | string\|null | no | Certifying body if different from institution |

---

### type: "personal"

```json
{
  "id": "teaching-colombia-2018",
  "title": "English Teacher — Colombia & Southeast Asia",
  "type": "personal",
  "region": "Colombia, Thailand, Vietnam",
  "period": { "start": "2016-08", "end": "2019-05" },
  "summary": "Taught English across three countries while living abroad, developing deep cross-cultural communication skills.",
  "description": "Full narrative here...",
  "tags": {
    "roles": [],
    "languages": [],
    "technologies": [],
    "libraries": [],
    "domains": ["edtech"],
    "concepts": [],
    "scale": [],
    "soft_skills": ["teaching", "cross-cultural", "communication", "adaptability", "leadership"]
  },
  "impact": [
    "Taught 100+ students across 3 countries",
    "Developed curriculum for intermediate English learners"
  ],
  "media": [],
  "featured": true,
  "story_act": "foundation",
  "personal_impact": "Teaching across three cultures taught me that communication is reading your audience and adapting — not just speaking clearly."
}
```

**Personal-specific fields:**

| Field | Type | Required for personal | Notes |
|---|---|---|---|
| `region` | string\|null | no | Geographic context for the experience |
