// Форма квеста, как её отдаёт GET /quests. Нужна и серверному слою (метаданные,
// sitemap, JSON-LD), и клиентским карточкам, поэтому живёт в обычном модуле:
// импортировать тип из файла с "use client" в серверном коде нельзя, а отсюда —
// можно обеим сторонам.
export interface Quest {
  id: string;
  title: string;
  description: string;
  author_id: string;
  author_name?: string;
  author_is_verified?: boolean;
  preview_image_url: string | null;
  download_url: string;
  version: string;
  node_count: number;
  estimated_playtime: number;
  quest_size_bytes: number;
  status: string;
  category: string;
  genres: string[];
  like_count: number;
  dislike_count: number;
  downloads_count: number;
  average_rating: number;
  is_demo: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}
