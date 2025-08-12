import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
}

export default nextConfig
