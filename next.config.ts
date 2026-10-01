import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native (napi-rs) module: must be loaded by Node, not bundled.
  serverExternalPackages: ["@firecrawl/pdf-inspector"],
};

export default nextConfig;
