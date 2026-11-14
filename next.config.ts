import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Outputs pure HTML/CSS/JS to 'out/' directory
  images: { unoptimized: true }, // Required for pure static export
  basePath: "/Local-Tools",
  trailingSlash: true, // Emits /route/index.html for reliable static hosting & GitHub Pages deep links
  // assetPrefix: "/Local-Tools/",
};

export default nextConfig;
