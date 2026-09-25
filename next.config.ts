import type { NextConfig } from "next";

// Blog images are served from the public `blog` bucket in Supabase Storage.
// Derive the host from the project URL so next/image will optimise them.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...(supabaseUrl
        ? [
            {
              protocol: supabaseUrl.protocol === "http:" ? ("http" as const) : ("https" as const),
              hostname: supabaseUrl.hostname,
              ...(supabaseUrl.port ? { port: supabaseUrl.port } : {}),
              pathname: "/storage/v1/object/public/blog/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
