/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
