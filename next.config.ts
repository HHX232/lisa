import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'random.imagecdn.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'septaria-api.up.railway.app',
        port: '',
        pathname: '/**',
      },
    ],
  },

};

export default nextConfig;