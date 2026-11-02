import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Preserve previously shared article links; the canonical slug is the MDX filename.
  async redirects() {
    return [
      {
        source: "/blog/engineering-a-registration-platform-with-public-and-dealer-journeys",
        destination: "/blog/registration-platform-lessons",
        permanent: true,
      },
    ];
  },
  // Production builds must fail when TypeScript checks fail.
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withMDX(nextConfig);
