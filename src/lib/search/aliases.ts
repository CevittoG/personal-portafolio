/**
 * Common shorthands recruiters type, mapped to taxonomy slugs. Keys are
 * lowercase. Only map to slugs that exist in taxonomy.json: an alias for a
 * tool the owner hasn't used would be a false promise.
 */
export const SEARCH_ALIASES: Readonly<Record<string, string>> = {
  k8s: "kubernetes",
  kube: "kubernetes",
  postgres: "postgresql",
  pg: "postgresql",
  psql: "postgresql",
  py: "python",
  js: "javascript",
  ts: "typescript",
  amazon: "aws",
  "amazon web services": "aws",
  lambda: "aws-lambda",
  "gh actions": "github-actions",
  cicd: "ci-cd",
  "ci/cd": "ci-cd",
  "apache spark": "spark",
  "apache airflow": "airflow",
  sklearn: "scikit-learn",
  ml: "machine-learning",
  llm: "llms",
  "data engineering": "data-engineer",
  "backend developer": "backend",
  "back end": "backend",
  "back-end": "backend",
  "full stack": "full-stack",
  fullstack: "full-stack",
};
