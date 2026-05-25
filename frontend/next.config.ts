import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Move this OUT of experimental
  allowedDevOrigins: ['10.4.5.216', 'localhost:3000'],
  
  /* other options here */
};

export default nextConfig;