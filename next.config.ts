import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
  // One root layout per language, so the 404 renders its own document
  // (src/app/global-not-found.tsx).
  experimental: { globalNotFound: true },
};

export default nextConfig;
