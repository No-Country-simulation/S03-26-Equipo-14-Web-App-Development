/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  transpilePackages: ['@repo/ui'],
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
