import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbs4.imagebam.com',
      },
      {
        protocol: 'https',
        hostname: 'www.imagebam.com',
      },
      // Full-res hosts (add as needed)
      { protocol: 'https', hostname: 'images1.imagebam.com' },
      { protocol: 'https', hostname: 'images2.imagebam.com' },
      { protocol: 'https', hostname: 'images3.imagebam.com' },
      { protocol: 'https', hostname: 'images4.imagebam.com' },
      { protocol: 'https', hostname: 'images5.imagebam.com' },
      { protocol: 'https', hostname: 'images6.imagebam.com' },
      { protocol: 'https', hostname: 'images7.imagebam.com' },
      { protocol: 'https', hostname: 'images8.imagebam.com' },
      { protocol: 'https', hostname: 'images9.imagebam.com' },
      { protocol: 'https', hostname: 'images10.imagebam.com' },
    ],
  },
};

export default nextConfig;