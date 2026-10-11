import "server-only";
import { createHash } from "node:crypto";
import {
  siApacheairflow,
  siApacheparquet,
  siApachespark,
  siDjango,
  siDocker,
  siFastapi,
  siGithubactions,
  siGnubash,
  siKeras,
  siKubernetes,
  siMariadb,
  siMongodb,
  siMysql,
  siNeo4j,
  siNginx,
  siNumpy,
  siOpencv,
  siPandas,
  siPlotly,
  siPostgresql,
  siPrometheus,
  siPydantic,
  siPytest,
  siPython,
  siPytorch,
  siReact,
  siRedis,
  siScikitlearn,
  siSentry,
  siSnowflake,
  siSplunk,
  siSqlalchemy,
  siStreamlit,
  siTensorflow,
  siTrino,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { FIELD_TOOLS, type FieldToolSlug } from "@/lib/site/field-tools";

/**
 * Icons for the hero's tool field, one per `FIELD_TOOLS` slug (the type
 * makes a missing one a compile error). From the `simple-icons` package,
 * drawn in `currentColor`: one colour, no brand hex in the codebase.
 *
 * They are served as a single SVG sprite (`/sprites/tools.svg`, see the
 * route), not inlined: the field is a client component, and inline paths
 * would ship twice, once as HTML and once in its props. Each tool then
 * needs only `<use href="…#slug">`.
 */
const TOOL_ICONS: Record<FieldToolSlug, SimpleIcon> = {
  python: siPython,
  snowflake: siSnowflake,
  kubernetes: siKubernetes,
  postgresql: siPostgresql,
  spark: siApachespark,
  airflow: siApacheairflow,
  fastapi: siFastapi,
  docker: siDocker,
  pandas: siPandas,
  trino: siTrino,
  redis: siRedis,
  pytorch: siPytorch,
  prometheus: siPrometheus,
  sqlalchemy: siSqlalchemy,
  pydantic: siPydantic,
  pytest: siPytest,
  numpy: siNumpy,
  "scikit-learn": siScikitlearn,
  django: siDjango,
  typescript: siTypescript,
  react: siReact,
  mysql: siMysql,
  mongodb: siMongodb,
  neo4j: siNeo4j,
  parquet: siApacheparquet,
  nginx: siNginx,
  "github-actions": siGithubactions,
  tensorflow: siTensorflow,
  keras: siKeras,
  bash: siGnubash,
  sentry: siSentry,
  splunk: siSplunk,
  mariadb: siMariadb,
  streamlit: siStreamlit,
  plotly: siPlotly,
  opencv: siOpencv,
};

/** Every field tool as a `<symbol>` whose id is its tag slug. */
export function buildToolSprite(): string {
  const symbols = FIELD_TOOLS.map(
    (slug) => `<symbol id="${slug}" viewBox="0 0 24 24"><path d="${TOOL_ICONS[slug].path}"/></symbol>`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`;
}

/**
 * The sprite's address. It is not a hashed `_next/static` asset, so the
 * query string changes whenever its content does and a cached copy can
 * never be stale.
 */
export function toolSpriteHref(): string {
  const version = createHash("sha256").update(buildToolSprite()).digest("hex").slice(0, 8);
  return `/sprites/tools.svg?v=${version}`;
}
