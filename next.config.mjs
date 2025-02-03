/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Added to ignore ESLint errors during builds
  },
    images: {
        domains: ['cdn.sanity.io'],
      },
};

export default nextConfig;
