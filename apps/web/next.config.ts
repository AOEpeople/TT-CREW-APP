import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  transpilePackages: ['@tt-crew/core'],
 eslint: {
  ignoreDuringBuilds: true,
 }
}
 
export default nextConfig