import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.makoto-hk.com" }],
        destination: "https://makoto-hk.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
