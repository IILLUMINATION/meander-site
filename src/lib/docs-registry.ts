export interface DocArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  order: number;
}

export const docArticles: DocArticle[] = [
  {
    slug: "test-article",
    title: "Создание первого квеста",
    description: "Полное руководство по созданию вашего первого текстового квеста в Meander — от установки до публикации",
    category: "Начало работы",
    tags: ["квест", "начало", "гайд", "первый проект"],
    order: 1,
  },
];

export function getArticleBySlug(slug: string): DocArticle | undefined {
  return docArticles.find(a => a.slug === slug);
}

export function getPrevArticle(slug: string): DocArticle | undefined {
  const sorted = [...docArticles].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(a => a.slug === slug);
  return idx > 0 ? sorted[idx - 1] : undefined;
}

export function getNextArticle(slug: string): DocArticle | undefined {
  const sorted = [...docArticles].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(a => a.slug === slug);
  return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
}

export function getArticlesByCategory(): Map<string, DocArticle[]> {
  const map = new Map<string, DocArticle[]>();
  const sorted = [...docArticles].sort((a, b) => a.order - b.order);
  for (const article of sorted) {
    const existing = map.get(article.category) || [];
    existing.push(article);
    map.set(article.category, existing);
  }
  return map;
}

export function searchArticles(query: string): DocArticle[] {
  const q = query.toLowerCase();
  return docArticles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q)) ||
    a.category.toLowerCase().includes(q)
  );
}
