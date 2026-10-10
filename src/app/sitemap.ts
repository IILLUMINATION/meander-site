import type { MetadataRoute } from "next";
import { docArticles } from "@/lib/docs-registry";
import { SITE_ORIGIN, getQuestList, questUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const quests = await getQuestList();

  return [
    { url: SITE_ORIGIN, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}/market`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_ORIGIN}/docs`, changeFrequency: "monthly", priority: 0.5 },
    ...docArticles.map((doc) => ({
      url: `${SITE_ORIGIN}/docs/${doc.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    // Анонимный /quests уже отдаёт только опубликованное и не 18+, так что
    // в sitemap попадает ровно то, что имеет смысл индексировать.
    ...quests.map((quest) => ({
      url: questUrl(quest.id),
      lastModified: new Date(quest.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
