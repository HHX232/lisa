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
    ],
  },
};

export default nextConfig;
