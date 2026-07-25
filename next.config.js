/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: false,
    domains: ['supabase.co', 'images.unsplash.com']
  }
};

module.exports = nextConfig;
