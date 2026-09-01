import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static output: `next build` writes plain .html/.css/.js to `out/`,
  // deployable to GitHub Pages / Netlify / any static host, no Node server.
  output: "export",
  // No Image Optimization endpoint in a static export; all images are local
  // .webp under public/, so serve them as-is.
  images: { unoptimized: true },
  // Emit /route/index.html so a plain file host resolves clean URLs.
  trailingSlash: true,
};

export default nextConfig;
