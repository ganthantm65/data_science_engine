/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Python backend files from compilation
  webpack: (config) => {
    config.module.rules.push({
      test: /\.py$/,
      use: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
