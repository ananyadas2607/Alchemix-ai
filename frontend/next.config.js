/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*'
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true // Temporarily ignore TS errors during build
  }
}

module.exports = nextConfig