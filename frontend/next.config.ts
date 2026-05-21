import type { NextConfig } from "next";

const experimental: any = {
  //IP to access the dev server
  allowedDevOrigins: ["10.4.5.216", "localhost:3000"],
};

const nextConfig: NextConfig = {
  /* config options here */
  experimental,
};

export default nextConfig;