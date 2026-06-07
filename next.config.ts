import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['172.26.156.82'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mytheresa.com',
      },
      {
        protocol: 'https',
        hostname: 'www.transparentpng.com',
      },
    ],
  },
};

export default nextConfig;
