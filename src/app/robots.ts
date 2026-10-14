import type { MetadataRoute } from "next";
import {
  PRIVATE_PATHS,
  SEARCH_AGENTS,
  TRAINING_AGENTS,
} from "@/lib/site/crawlers";
import { siteConfig } from "@/lib/site/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const disallow = [...PRIVATE_PATHS];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...SEARCH_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
      ...TRAINING_AGENTS.map((userAgent) => ({
        userAgent,
        disallow: ["/", ...disallow],
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
