import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/mockups/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
              "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
              "img-src 'self' data: https: http:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
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
      {
        source: "/preview",
        destination: "/preview.html",
      },
    ];
  },
};

export default nextConfig;
