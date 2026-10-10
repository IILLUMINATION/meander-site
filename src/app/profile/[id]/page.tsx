import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";
import {
  apiJson,
  authorUrl,
  excerpt,
  getAuthors,
  isNotFoundError,
  isUuid,
  jsonLd,
  pluralRu,
  SITE_ORIGIN,
} from "@/lib/seo";
import type { Profile } from "@/lib/profile";
import type { Quest } from "@/lib/quest";

export const revalidate = 3600;

/**
 * Карточка автора. Профиль берём точечным запросом (/profiles/<id> анонимный и,
 * в отличие от /quests*, НЕ под publicQuestLimiter), а его квесты — из общего
 * кэша каталога: лишнего запроса к API страница не стоит.
 */
async function loadAuthor(id: string): Promise<{ profile: Profile; quests: Quest[] }> {
  if (!isUuid(id)) notFound();
  try {
    const [profile, authors] = await Promise.all([
      apiJson<Profile>(`/profiles/${id}`),
      getAuthors(),
    ]);
    return { profile, quests: authors.get(id) ?? [] };
  } catch (e) {
    // Только честный «такого автора нет» (404 / 400 битлый id) имеет право стать
    // 404-й: таймаут или 5xx иначе закешировались бы живой страницей-пустышкой.
    if (isNotFoundError(e)) notFound();
    throw e;
  }
}

function authorSchema(profile: Profile, quests: Quest[]) {
  const name = profile.full_name?.trim() || "Аноним";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${name} — автор Meander`,
    url: authorUrl(profile.id),
    inLanguage: "ru",
    isAccessibleForFree: true,
    mainEntity: {
      "@type": "Person",
      name,
      url: authorUrl(profile.id),
      description: profile.bio?.trim() || undefined,
      image: profile.avatar_url || undefined,
      identifier: profile.id,
      // email в профиле есть, но показывать его краулеру не за чем и нельзя —
      // это персональные данные.
      knowsAbout: quests.length ? quests.map((q) => q.title) : undefined,
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { profile, quests } = await loadAuthor(id);

  const name = profile.full_name?.trim() || "Аноним";
  const titles = quests.map((q) => q.title).join(", ");
  const description = excerpt(
    (quests.length
      ? `${name} — автор ${pluralRu(quests.length, ["квеста", "квестов", "квестов"])} Meander: ${titles}.`
      : `${name} в Meander.`) +
      (profile.bio?.trim() ? ` ${profile.bio.trim()}` : "") +
      " Страница автора в каталоге текстовых квестов."
  );

  return {
    title: quests.length
      ? `${name} — автор квестов Meander`
      : `${name} — профиль Meander`,
    description,
    alternates: { canonical: authorUrl(id) },
    openGraph: {
      type: "profile",
      url: authorUrl(id),
      title: `${name} — автор квестов | Meander`,
      description,
      locale: "ru_RU",
      siteName: "Meander",
      images: [
        profile.avatar_url
          ? { url: profile.avatar_url, alt: name }
          : {
              url: `${SITE_ORIGIN}/opengraph-image.jpg`,
              width: 1200,
              height: 630,
              alt: "Meander — текстовые квесты",
            },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — автор квестов | Meander`,
      description,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, quests } = await loadAuthor(id);

  return (
    <>
      <ProfileClient userId={id} initialProfile={profile} initialQuests={quests} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(authorSchema(profile, quests))}
      />
    </>
  );
}
