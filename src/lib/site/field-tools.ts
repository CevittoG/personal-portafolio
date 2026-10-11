/**
 * The tools scattered around the hero (the "tool field"), as tag slugs.
 *
 * Ordered by how much each says about the target role, because narrower
 * screens show only the first few: the first 12 on phones, the first 20 on
 * tablets and small laptops, all of them on wide screens (see
 * `FIELD_LAYOUTS` in `src/lib/explorer/scatter.ts`).
 *
 * Every slug must be a languages, technologies or libraries tag
 * (`src/content/validate.ts` checks) and have an icon in
 * `src/lib/explorer/tool-icons.ts` (the compiler checks).
 */
export const FIELD_TOOLS = [
  "python",
  "snowflake",
  "kubernetes",
  "postgresql",
  "spark",
  "airflow",
  "fastapi",
  "docker",
  "pandas",
  "trino",
  "redis",
  "pytorch",
  "prometheus",
  "sqlalchemy",
  "pydantic",
  "pytest",
  "numpy",
  "scikit-learn",
  "django",
  "typescript",
  "react",
  "mysql",
  "mongodb",
  "neo4j",
  "parquet",
  "nginx",
  "github-actions",
  "tensorflow",
  "keras",
  "bash",
  "sentry",
  "splunk",
  "mariadb",
  "streamlit",
  "plotly",
  "opencv",
] as const;

export type FieldToolSlug = (typeof FIELD_TOOLS)[number];
