import {
  siApacheairflow,
  siApachespark,
  siFastapi,
  siKubernetes,
  siPostgresql,
  siPython,
  siSnowflake,
  type SimpleIcon,
} from "simple-icons";
import { CORE_STACK } from "@/lib/site/profile";
import { cn } from "@/lib/utils";

/**
 * CoreStack — the hero's "Core stack" row: a static, labeled list of the
 * same `CORE_STACK` the Contact page's At a glance block shows.
 *
 * Replaced the animated Logo Drop Cluster (≈68 remote CDN logos, a layout
 * read per logo per frame, forever). Logos are bundled from the
 * `simple-icons` package (only the imported paths ship), rendered in
 * `currentColor` so they sit in the quiet palette and no brand hex enters
 * the codebase. A tool without a Simple Icons logo (SQL) shows its label
 * only: never a synthesized logo. Hook-free and motion-free.
 */
const ICONS: Partial<Record<(typeof CORE_STACK)[number], SimpleIcon>> = {
  Python: siPython,
  Snowflake: siSnowflake,
  Kubernetes: siKubernetes,
  PostgreSQL: siPostgresql,
  Spark: siApachespark,
  FastAPI: siFastapi,
  Airflow: siApacheairflow,
};

export function CoreStack({
  label,
  className,
}: {
  /** Localized heading, e.g. "Core stack". */
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs uppercase tracking-[0.2em] text-text-muted">{label}</p>
      <ul
        aria-label={label}
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
      >
        {CORE_STACK.map((name) => {
          const icon = ICONS[name];
          return (
            <li
              key={name}
              className="inline-flex items-center gap-2 text-sm text-text-secondary"
            >
              {icon && (
                <svg
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                >
                  <path d={icon.path} />
                </svg>
              )}
              <span>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
