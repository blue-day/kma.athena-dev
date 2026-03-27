/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kma/api-interface', '@kma/utils'],
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/athena-api/:path*',
        destination: 'https://kma-athena.dev.uracle.co.kr/:path*',
      },
    ];
  },
};

export default nextConfig;
