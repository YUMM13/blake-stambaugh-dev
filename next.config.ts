import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: '/blake-stambaugh-dev',
  assetPrefix: '/blake-stambaugh-dev/',
};

export default nextConfig;
