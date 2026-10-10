import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import DocsArticleClient from "./DocsArticleClient";
import { docArticles, getArticleBySlug } from "@/lib/docs-registry";
import { SITE_ORIGIN } from "@/lib/seo";

// Собираем обе статьи на билде и не отдаём на сервере ничего сверх них:
// slug до чтения файла сверяется с реестром, поэтому в путь fs не попадает
// ничего управляемого запросом.
export const generateStaticParams = () => docArticles.map((a) => ({ slug: a.slug }));
export const dynamicParams = false;

async function readDoc(slug: string): Promise<string> {
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  try {
    return await readFile(path.join(process.cwd(), "public", "docs", `${article.slug}.md`), "utf8");
  } catch {
    // Пустая страница в ISR вместо ошибки — ровно то, чего нельзя допускать.
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE_ORIGIN}/docs/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    keywords: article.tags,
    openGraph: {
      type: "article",
      url,
      title: `${article.title} | Meander`,
      description: article.description,
      locale: "ru_RU",
      siteName: "Meander",
      images: [{ url: `${SITE_ORIGIN}/opengraph-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${SITE_ORIGIN}/opengraph-image.jpg`],
    },
  };
}

export default async function DocsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const markdown = await readDoc(slug);
  return <DocsArticleClient slug={slug} markdown={markdown} />;
}
