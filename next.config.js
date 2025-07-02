/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/nehky-platform',
  assetPrefix: '/nehky-platform/',
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  typescript: {
    // تجاهل أخطاء TypeScript أثناء البناء للمرحلة التطويرية
    ignoreBuildErrors: true,
  },
  eslint: {
    // تجاهل أخطاء ESLint أثناء البناء للمرحلة التطويرية
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
