import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Production builds must fail when TypeScript checks fail.
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withMDX(nextConfig);
