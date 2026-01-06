import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 静态导出配置（仅在生产构建时生效）
  ...(isProduction && {
    output: 'export',
    basePath: '/aiteacher',
    assetPrefix: '/aiteacher',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
