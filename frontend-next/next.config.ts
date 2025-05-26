import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Added for Docker deployment
  /* config options here */
};

export default nextConfig;
