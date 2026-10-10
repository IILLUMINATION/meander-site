import type { Metadata } from "next";
import MarketClient from "./MarketClient";
import { SITE_ORIGIN, excerpt, getQuestList, pluralRu } from "@/lib/seo";
import type { Quest } from "@/lib/quest";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const quests = await getQuestList();
  const n = quests.length;
  const fresh = quests
    .slice()
    .sort((a, b) => b.downloads_count + b.like_count * 5 - (a.downloads_count + a.like_count * 5))
    .slice(0, 3)
    .map((q) => q.title)
    .join(", ");

  const description = excerpt(
    `Каталог текстовых квестов Meander: ${n} ${pluralRu(n, [
      "история",
      "истории",
      "историй",
    ])} с ветвящимся сюжетом — ` +
      `фэнтези, фантастика, ужасы, мистика, приключения. Скачать бесплатно, играть в приложении Meander.` +
      (fresh ? ` Сейчас в топе: ${fresh}.` : ""),
    300
  );

  return {
    title: `Маркет — ${n} ${pluralRu(n, ["текстовый квест", "текстовых квеста", "текстовых квестов"])}`,
    description,
    alternates: { canonical: `${SITE_ORIGIN}/market` },
    openGraph: {
      type: "website",
      url: `${SITE_ORIGIN}/market`,
      title: "Маркет текстовых квестов | Meander",
      description,
      locale: "ru_RU",
      siteName: "Meander",
      // Картинки не наследуются из layout: без этого поля у /market не было og:image.
      images: [
        {
          url: `${SITE_ORIGIN}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Маркет текстовых квестов Meander",
        },
      ],
    },
    // twitter.title в layout задан явно и из openGraph не наследуется.
    twitter: {
      card: "summary_large_image",
      title: `Маркет — ${n} ${pluralRu(n, ["текстовый квест", "текстовых квеста", "текстовых квестов"])}`,
      description,
      images: [`${SITE_ORIGIN}/opengraph-image.jpg`],
    },
  };
}

export default async function MarketPage() {
  const quests: Quest[] = await getQuestList();
  return <MarketClient initialQuests={quests} />;
}
