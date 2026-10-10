import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuestDetailClient from "./QuestDetailClient";
import {
  apiJson,
  excerpt,
  findQuest,
  isNotFoundError,
  isUuid,
  jsonLd,
  questUrl,
  SITE_ORIGIN,
} from "@/lib/seo";
import { translateGenre } from "@/lib/genres";
import type { Quest } from "@/lib/quest";

export const revalidate = 3600;

/**
 * Квест и признак «его можно показывать поисковику».
 *
 * Всё, что отдаёт анонимный GET /quests (опубликованное и не 18+), берётся из
 * общего кэша каталога — один запрос на все страницы. Если квеста там нет, он
 * всё равно может быть доступен по прямой ссылке (18+, снят с листинга), поэтому
 * переспрашиваем точечно: страницу отдаём, но в индекс не отпускаем.
 */
async function loadQuest(id: string): Promise<{ quest: Quest; indexable: boolean }> {
  if (!isUuid(id)) notFound();
  const fromCatalog = await findQuest(id);
  if (fromCatalog) return { quest: fromCatalog, indexable: true };

  try {
    return { quest: await apiJson<Quest>(`/quests/${id}`), indexable: false };
  } catch (e) {
    // 404/400 — квеста правда нет. Любая другая ошибка (таймаут, 5xx, лимит) не
    // повод превращать живую страницу в 404 и кешировать её такой.
    if (isNotFoundError(e)) notFound();
    throw e;
  }
}

function questSchema(quest: Quest) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: quest.title,
    url: questUrl(quest.id),
    description: quest.description || undefined,
    image: quest.preview_image_url || undefined,
    genre: quest.genres.map(translateGenre),
    inLanguage: "ru",
    isAccessibleForFree: true,
    datePublished: quest.created_at,
    dateModified: quest.updated_at,
    publisher: { "@type": "Organization", name: "Meander", url: SITE_ORIGIN },
    downloadUrl: quest.download_url,
    gamePlatform: "Meander",
  };
}

function breadcrumbSchema(quest: Quest) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Meander", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Маркет", item: `${SITE_ORIGIN}/market` },
      { "@type": "ListItem", position: 3, name: quest.title, item: questUrl(quest.id) },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { quest, indexable } = await loadQuest(id);

  const author = quest.author_name?.trim() || "Аноним";
  const genres = quest.genres.map(translateGenre).join(", ");
  const description = excerpt(
    (quest.description || "").trim() +
      (genres ? ` Жанры: ${genres}.` : "") +
      ` Автор: ${author}. Играй в текстовый квест Meander — скачай бесплатно.`
  );

  return {
    title: `${quest.title} — текстовый квест`,
    description,
    // noindex-страница не должна ещё и ссылаться сама на себя как на канон.
    alternates: indexable ? { canonical: questUrl(id) } : undefined,
    robots: indexable ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: questUrl(id),
      title: `${quest.title} — текстовый квест | Meander`,
      description,
      locale: "ru_RU",
      siteName: "Meander",
      // Без превью квеста иначе оставалась бы страница вообще без og:image:
      // openGraph из layout картинку не наследует, а обложка нужна для
      // расшаривания в Telegram и ВК.
      images: [
        quest.preview_image_url
          ? { url: quest.preview_image_url, alt: quest.title }
          : {
              url: `${SITE_ORIGIN}/opengraph-image.jpg`,
              width: 1200,
              height: 630,
              alt: "Meander — текстовые квесты",
            },
      ],
    },
    // В layout twitter.title задан явно, поэтому из openGraph он не наследуется:
    // без этого блока превью в X остаётся дефолтным заголовком сайта.
    twitter: {
      card: "summary_large_image",
      title: `${quest.title} — текстовый квест | Meander`,
      description,
    },
  };
}

export default async function QuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { quest } = await loadQuest(id);

  return (
    <>
      <QuestDetailClient initialQuest={quest} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(questSchema(quest))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(quest))}
      />
    </>
  );
}
