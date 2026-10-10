import type { MetadataRoute } from "next";
import { docArticles } from "@/lib/docs-registry";
import {
  authorUrl,
  getAuthors,
  questUrl,
  SITE_ORIGIN,
} from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Одна группировка каталога даёт и квесты, и авторов: sitemap не стоит ни
  // одного запроса к API сверх того, что уже кэшируется.
  const authors = await getAuthors();
  const quests = [...authors.values()].flat();

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
    // Страницы авторов: на них ведёт ссылка с каждой карточки квеста, и теперь
    // они отдают содержимое сервером, а не пустую оболочку.
    ...[...authors.entries()].map(([id, authorQuests]) => ({
      url: authorUrl(id),
      lastModified: new Date(
        Math.max(...authorQuests.map((q) => Date.parse(q.updated_at)))
      ),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
