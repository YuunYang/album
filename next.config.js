/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['image-cdn-fa.spotifycdn.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    }, {
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
}

module.exports = nextConfig
