import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbs4.imagebam.com',
      },
      {
        protocol: 'https',
        hostname: 'images4.imagebam.com',
      },
      {
        protocol: 'https',
        hostname: 'www.imagebam.com',
      },
      {
        protocol: 'https',
        hostname: 'imagebam.com',
      },
    ],
  },
};

export default nextConfig;