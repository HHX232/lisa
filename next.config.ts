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

    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*', 
        destination: 'https://septaria-api.up.railway.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;