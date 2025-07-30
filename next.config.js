/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['tr.rbxcdn.com', 'assetgame.roblox.com'],
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig
