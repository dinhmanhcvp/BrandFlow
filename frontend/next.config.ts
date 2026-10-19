import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Các trang planning trùng lặp đã gộp về trang chính — giữ link cũ hoạt động */
  async redirects() {
    return [
      { source: "/planning/b3-action", destination: "/planning/b2-action", permanent: true },
      { source: "/planning/b5-contingency", destination: "/planning/b4-contingency", permanent: true },
      { source: "/planning/b7-gantt", destination: "/planning/b6-gantt", permanent: true },
      { source: "/planning/c2-matrix", destination: "/planning/c2-history", permanent: true },
    ];
  },
  /* Proxy mọi request bắt đầu bằng /api/v1/ xuống BE Python (cổng 8000) */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/v1/:path*`,
      },
    ];
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "110mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
