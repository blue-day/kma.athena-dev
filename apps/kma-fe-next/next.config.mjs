/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kma/api-interface', '@kma/auth', '@kma/comn', '@kma/ui-components', '@kma/utils'],
  reactStrictMode: false, // [Proxy 설정] 브라우저(3000) -> 백엔드(4000)로 API 중계

  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'http://localhost:4000/graphql',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
