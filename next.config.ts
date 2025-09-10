import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  //basePath: "/portal-pensionados",
};

export default nextConfig;
