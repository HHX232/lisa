import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "random.imagecdn.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.septaria.by",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'septaria-api.up.railway.app',
      }
    ],
  },
};

export default nextConfig;
