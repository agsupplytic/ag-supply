import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are local today; Sanity's CDN is allowed for the future
    // CONTENT_SOURCE=sanity swap (see docs/DEPLOY.md).
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
