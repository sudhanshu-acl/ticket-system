import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
