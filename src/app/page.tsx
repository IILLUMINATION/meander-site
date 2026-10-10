import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import type { Quest } from "@/lib/quest";
import { SITE_ORIGIN, getTopQuests, jsonLd, questUrl } from "@/lib/seo";

// Как и маркет: топ по скачиваниям должен обновляться сам, без ручной
// перевыкладки сайта.
export const revalidate = 1800;

// Заголовок и описание лежат в layout.tsx — главной они подходят как есть,
// здесь только адрес, по которому страницу надо показывать в поиске.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_ORIGIN}/` },
};

/**
 * Организация + сайт + приложение. Без них поисковик видит на / только
 * лендинг со словами «текстовые квесты» и не связывает страницу с продуктом,
 * который можно скачать.
 *
 * downloadUrl — Google Play, а не ссылка на релиз: ссылки на релизы привязаны
 * к версии (2.8.14%2B259) и протухают с каждым билдом, а их в клиенте пять.
 */
function homeSchema(quests: Quest[]): unknown {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "Meander",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/images/logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: "Meander",
        inLanguage: "ru",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: "Meander",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Windows, macOS, Linux, Android, iOS",
        url: `${SITE_ORIGIN}/`,
        downloadUrl: "https://play.google.com/store/apps/details?id=com.IILLUMINAT.meadner",
        offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
      },
      ...(quests.length
        ? [
            {
              "@type": "ItemList",
              name: "Топ квестов Meander",
              itemListElement: quests.map((quest, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: quest.title,
                url: questUrl(quest.id),
              })),
            },
          ]
        : []),
    ],
  };
}

export default async function HomePage() {
  // Пустой список при сбое бэкенда здесь допустим — в отличие от маркета,
  // где он выглядел бы как сломавшийся каталог: на главной просто не
  // отрисуется карусель, а остальной текст страницы остаётся.
  const topQuests = await getTopQuests().catch(() => []);

  return (
    <>
      <HomeClient topQuests={topQuests} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(homeSchema(topQuests))}
      />
    </>
  );
}
