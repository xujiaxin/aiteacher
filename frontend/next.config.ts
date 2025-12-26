import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/aiteacher',
  assetPrefix: '/aiteacher',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
