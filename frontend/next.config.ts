import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        critical: {
          test: /[\\/]styles[\\/]critical/,
          name: 'critical',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        noncritical: {
          test: /[\\/]styles[\\/](?!critical)/,
          name: 'noncritical',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
