/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  transpilePackages: ['@repo/ui'],
  experimental: {
    externalDir: true,
  },
  // config solo para pruebas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
