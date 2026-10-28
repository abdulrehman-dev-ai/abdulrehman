import { baseURL } from "@/app/resources";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/api/", "/admin/", "/order/", "/secure-access"],
      },
    ],
    sitemap: `https://${baseURL}/sitemap.xml`,
  };
}
