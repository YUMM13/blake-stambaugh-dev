import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  output: isProd ? "export" : undefined,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/blake-stambaugh-dev" : "",
  assetPrefix: isProd ? "/blake-stambaugh-dev/" : "",
};

export default nextConfig;
