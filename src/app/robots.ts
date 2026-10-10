import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo";

export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api/* — прокси на бэкенд: JSON и служебные ручку, в поиске им не место.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
