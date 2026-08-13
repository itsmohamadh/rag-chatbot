import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pdf-parse"],

  reactCompiler: true,
};

export default nextConfig;
