import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/get-started",
        destination: "/get-started/index.html",
      },
      {
        source: "/get-started/thank-you",
        destination: "/get-started/thank-you/index.html",
      },
      {
        source: "/free-mockups",
        destination: "/free-mockups/index.html",
      },
      {
        source: "/free-mockups/thank-you",
        destination: "/free-mockups/thank-you/index.html",
      },
    ];
  },
};

export default nextConfig;
